// Run against an isolated Chrome with --remote-debugging-port=9237.
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const targets = await (await fetch('http://127.0.0.1:9237/json/list')).json();
  const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let seq = 0;
  const pending = new Map(), errors = [];
  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails);
    if (pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error))); else resolve(msg.result);
    }
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };
  await call('Runtime.enable');
  await call('Page.enable');
  await call('Emulation.setFocusEmulationEnabled', { enabled: true });
  await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 1000, deviceScaleFactor: 1, mobile: false });
  const navigate = async (url, ready) => {
    await call('Page.navigate', { url });
    for(let i=0;i<100;i++){
      if(await evaluate(ready)) return;
      await new Promise(r=>setTimeout(r,50));
    }
    throw new Error('Page not ready: '+url);
  };
  const changeLanguage = lang => evaluate(`document.getElementById('language').value=${JSON.stringify(lang)}; document.getElementById('language').dispatchEvent(new Event('change'))`);
  const currentId=()=>evaluate('document.querySelector(".question").dataset.question');
  const settle=()=>evaluate(`new Promise((resolve,reject)=>{const start=performance.now();function check(){if(document.getElementById('questions')?.getAttribute('aria-busy')!=='true')resolve();else if(performance.now()-start>5000)reject(new Error('Transition did not settle'));else setTimeout(check,20)}check()})`);
  const click=async selector=>{await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);await settle();};
  const optionIds=()=>evaluate('[...document.querySelectorAll(".choices input")].map(i=>i.value)');
  const setImportance=value=>evaluate(`(()=>{const s=document.querySelector('.importance-select');s.value=${JSON.stringify(String(value))};s.dispatchEvent(new Event('change',{bubbles:true}))})()`);
  const step=()=>evaluate('Number(document.querySelector(".question-number").textContent)');
  const screenshot=async name=>fs.writeFileSync('/tmp/'+name+'.png',Buffer.from((await call('Page.captureScreenshot',{format:'png'})).data,'base64'));
  const assertSingle=async()=>{
    assert.equal(await evaluate('document.querySelectorAll(".question").length'),1);
    assert.equal(await evaluate('document.querySelector("legend").nextElementSibling.className'),'question-importance');
  };
  const assertRanking=async()=>{
    const cards=await evaluate('[...document.querySelectorAll(".result-card")].map(c=>({id:c.dataset.party,score:Number(c.dataset.score),coverage:Number(c.dataset.coverage),documented:Number(c.dataset.documented),shown:c.querySelector(".score").firstChild.textContent}))');
    assert.equal(cards.length,16);
    cards.forEach((c,i)=>{assert.equal(c.shown,`${Math.round(c.score*100)}%`);assert(c.score<=c.coverage+1e-10);if(i){assert(cards[i-1].score>=c.score);if(cards[i-1].score===c.score)assert(cards[i-1].documented>=c.documented);}});
    return cards;
  };
  const finishRun=async(skip=false)=>{
    const visited=[];
    for(let i=0;i<25;i++){
      if(await evaluate('document.getElementById("quiz").hidden'))return visited;
      await assertSingle();visited.push(await currentId());
      const checked=await evaluate('!!document.querySelector(".question input:checked")');
      if(checked) await evaluate('document.getElementById(document.getElementById("next").hidden?"calculate":"next").click()');
      else await click(skip?'.question input[value=__skip]':'.question .choices input');
    }
    throw new Error('The quiz did not finish');
  };
  await navigate('http://127.0.0.1:8765/?lang=ru','document.querySelectorAll(".question").length===1');
  await assertSingle();
  assert.equal(await evaluate('document.getElementById("step-label").textContent'),'Вопрос 1 из 10');
  assert.equal(await evaluate('document.querySelectorAll("#topics li").length'),6);
  assert((await evaluate('document.getElementById("topics").textContent')).includes('Положение Женщины'));
  assert.equal(await evaluate('document.getElementById("back").disabled'),true);
  assert.equal(await evaluate('document.getElementById("next").disabled'),true);
  assert.equal(await evaluate('document.getElementById("calculate").hidden'),true);
  assert.equal(await evaluate('document.querySelector(".change-question").textContent'),'Сменить вопрос');
  const first=await currentId();
  const originalOptions=await optionIds();
  await setImportance(1);assert.equal(await currentId(),first);
  await changeLanguage('he');
  assert((await evaluate('document.getElementById("topics").textContent')).includes('מעמד האישה'));
  assert.equal(await currentId(),first);
  assert.equal(await evaluate('document.documentElement.dir'),'rtl');
  assert.equal(await evaluate('document.querySelector(".importance-select").value'),'1');
  await changeLanguage('en');
  assert((await evaluate('document.getElementById("topics").textContent')).includes('Status of Women'));
  assert.deepEqual(await optionIds(),originalOptions,'Language changes must preserve option order');
  assert.equal(await evaluate('document.querySelector(".overlap-table th[scope=col]").title'),await evaluate('document.querySelector(".choice span:last-child").textContent'));
  // The same topic help is available within a single step.
  const overview=await evaluate('JSON.parse(document.getElementById("compass-data").textContent).questions.find(q=>q.id===document.querySelector(".question").dataset.question).help.overview.en');
  await evaluate('document.querySelector(".help-button").dispatchEvent(new PointerEvent("pointerover",{bubbles:true}))');
  assert.equal(await evaluate('document.querySelector(".issue-tooltip").hidden'),false);
  assert((await evaluate('document.querySelector(".issue-tooltip").textContent')).includes(overview));
  await evaluate('document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}))');
  assert.equal(await evaluate('document.querySelector(".issue-tooltip").hidden'),true);
  assert.equal(await evaluate('document.querySelectorAll(".issue-overview .reading-links a").length'),2);
  assert.equal(await evaluate('document.querySelector(".explore-issue").target'),'_blank');
  // Show the selection before leaving; repeated taps must not skip another question.
  const firstAnswer=await evaluate('document.querySelector(".choices input").value');
  await evaluate('document.querySelector(".choices input").closest("label").scrollIntoView({block:"center"});document.querySelector(".choices input").click();document.querySelectorAll(".choices input")[1].click()');
  assert.equal(await currentId(),first,'The selected answer must remain visible before advancing');
  assert.equal(await evaluate('document.getElementById("questions").getAttribute("aria-busy")'),'true');
  assert.equal(await evaluate('document.querySelector("input:checked").value'),firstAnswer,'A repeated tap cannot overwrite the committed choice');
  await evaluate('new Promise(r=>setTimeout(r,170))');
  assert.match(await evaluate('getComputedStyle(document.querySelector(".choice.is-confirmed")).backgroundColor'),/^rgba?\(29, 78, 216(?:, 1)?\)$/);
  await screenshot('compass-answer-confirmed');
  await settle();
  const second=await currentId();assert.notEqual(second,first);assert.equal(await step(),2);
  assert.equal(await evaluate('document.activeElement.tagName'),'LEGEND');
  assert.equal(await evaluate('document.getElementById("progress").value'),1);
  await click('#back');assert.equal(await currentId(),first);
  assert.deepEqual(await optionIds(),originalOptions,'Back must preserve option order');
  assert.equal(await evaluate('document.querySelector("input:checked").value'),firstAnswer);
  assert.equal(await evaluate('document.querySelector(".importance-select").value'),'1');
  await setImportance(.8);assert.equal(await currentId(),first);
  await click('#next');assert.equal(await currentId(),second);
  await click('#back');
  const revisedAnswer=await evaluate('document.querySelectorAll(".choices input")[1].value');
  await evaluate('document.querySelectorAll(".choices input")[1].click()');await settle();
  assert.equal(await currentId(),second);
  // Skip advances without replacing; it remains editable through Back.
  await click('input[value=__skip]');const third=await currentId();assert.equal(await step(),3);
  await click('#back');assert.equal(await currentId(),second);
  assert.equal(await evaluate('document.querySelector("input[value=__skip]").checked'),true);
  await click('#next');assert.equal(await currentId(),third);
  await click('input[value=__none]');assert.equal(await step(),4);
  await click('#back');await click('#back');assert.equal(await currentId(),second);
  // Replacements occupy the same step; both entry points exhaust the pool without repeats.
  await setImportance(.1);assert.equal(await evaluate('document.querySelectorAll(".replacement-select").length'),1);
  const retired=new Set([first,third]);
  for(let i=0;i<12;i++){
    const old=await currentId();retired.add(old);
    if(i%2)await setImportance('__replace');else await click('.change-question');
    const replacement=await currentId();assert(!retired.has(replacement));
    assert.equal(await step(),2);assert.equal(await evaluate('document.querySelector(".importance-select").value'),'0.8');
    assert.equal(await evaluate('document.getElementById("progress").value'),2);
  }
  assert.equal(await evaluate('document.querySelector(".change-question").disabled'),true);
  assert.equal(await evaluate('document.querySelector("option[value=__replace]").disabled'),true);
  const replacement=await currentId();await click('.change-question');assert.equal(await currentId(),replacement);
  await click('#back');assert.equal(await currentId(),first);
  assert.equal(await evaluate('document.querySelector("input:checked").value'),revisedAnswer);
  assert.equal(await evaluate('document.querySelector(".importance-select").value'),'0.8');
  await click('#next');
  const rest=await finishRun();assert.equal(rest.length,9);assert.equal(new Set([first,...rest]).size,10);
  assert.equal(await evaluate('document.getElementById("results").hidden'),false);
  await assertRanking();
  // Results return to the final step. Importance-only edits can be submitted without re-answering.
  await click('#edit');assert.equal(await step(),10);
  assert.equal(await evaluate('document.getElementById("next").hidden'),true);
  assert.equal(await evaluate('document.getElementById("calculate").disabled'),false);
  await setImportance(1);await click('#calculate');await assertRanking();
  // A fresh long run has 22 distinct sequential steps and no replacement pool.
  await click('#long');await assertSingle();assert.equal(await step(),1);
  assert.equal(await evaluate('document.getElementById("progress").max'),22);
  assert.equal(await evaluate('document.querySelector(".change-question").disabled'),true);
  assert.equal(await evaluate('document.querySelector(".importance-select").value'),'0.8');
  const longOrder=await finishRun();assert.equal(longOrder.length,22);assert.equal(new Set(longOrder).size,22);
  assert.equal(await evaluate('document.getElementById("progress").value'),22);
  const before=await assertRanking();
  await click('#edit');
  for(let i=21;i>longOrder.indexOf('Q1');i--)await click('#back');
  assert.equal(await currentId(),'Q1');await setImportance(1);await click('#results-tab');
  const after=await assertRanking();assert.notDeepEqual(before,after);
  assert(Number(await evaluate('document.querySelector("[data-party=balad]").dataset.documented'))>0);
  const estimatesOn=await assertRanking();
  await click('#estimates');
  assert.equal(await evaluate('document.getElementById("estimates").checked'),false);
  const estimatesOff=await assertRanking();
  for(const card of estimatesOff){const enabled=estimatesOn.find(c=>c.id===card.id);assert(card.score<=enabled.score+1e-12);assert.equal(card.documented,enabled.documented);}
  assert.equal(await evaluate('document.querySelectorAll(".score-breakdown").length'),0);
  await click('#estimates');
  await click('#historical');
  assert.equal(await evaluate('document.getElementById("historical").checked'),true);
  const english=await assertRanking();await changeLanguage('ru');assert.deepEqual(await assertRanking(),english);
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
  await screenshot('compass-mobile-results');
  await click('#edit');assert.equal(await currentId(),'Q1');
  assert.equal(await evaluate('document.querySelector(".importance-select").value'),'1');
  await assertSingle();assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
  await screenshot('compass-mobile-step');
  await changeLanguage('he');
  assert.equal(await currentId(),'Q1');await click('.help-button');
  assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
  await screenshot('compass-mobile-help');
  // Reset clears navigation, responses and importance. An all-skipped run also finishes.
  await click('#short');await changeLanguage('ru');
  const skipped=await finishRun(true);assert.equal(skipped.length,10);
  assert.equal(await evaluate('document.querySelectorAll(".result-card").length'),0);
  assert.equal(await evaluate('document.querySelectorAll(".empty").length'),1);
  await click('#edit');assert.equal(await step(),10);
  assert.equal(await evaluate('document.querySelector("input[value=__skip]").checked'),true);
  for(let i=0;i<9;i++)await click('#back');assert.equal(await step(),1);
  assert.equal(await evaluate('document.getElementById("back").disabled'),true);
  await click('.choices input');assert.equal(await step(),2);
  await click('#reset');assert.equal(await step(),1);
  assert.equal(await evaluate('document.getElementById("progress").value'),0);
  assert.equal(await evaluate('document.querySelectorAll(".question input:checked").length'),0);
  assert.equal(await evaluate('document.querySelector(".importance-select").value'),'0.8');
  assert.equal(await evaluate('document.getElementById("historical").checked'),false);
  // Reset, language changes and switching forms cancel pending timers cleanly.
  await evaluate('document.querySelector(".choices input").click();document.getElementById("reset").click()');
  await evaluate('new Promise(r=>setTimeout(r,1300))');assert.equal(await step(),1);
  assert.equal(await evaluate('document.querySelectorAll(".question input:checked").length'),0);
  const cancelledId=await currentId();
  await evaluate('document.querySelector(".choices input").click()');await changeLanguage('he');
  await evaluate('new Promise(r=>setTimeout(r,1300))');assert.equal(await currentId(),cancelledId);
  assert.equal(await evaluate('!!document.querySelector("input:checked")'),true);
  await click('#reset');
  await evaluate('document.querySelector(".choices input").click();document.getElementById("long").click()');
  await evaluate('new Promise(r=>setTimeout(r,1300))');assert.equal(await step(),1);
  assert.equal(await evaluate('document.getElementById("progress").value'),0);
  // Reduced motion keeps confirmation feedback but omits movement.
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const reducedId=await currentId();await evaluate('document.querySelector(".choices input").click()');
  assert.equal(await currentId(),reducedId);
  assert.equal(await evaluate('document.getElementById("questions").getAnimations({subtree:true}).length'),0);
  await settle();assert.equal(await step(),2);
  await call('Emulation.setEmulatedMedia',{features:[]});
  // New runs shuffle substantive choices; action choices stay at the end.
  const orders=await evaluate(`(()=>{const observations={};for(let n=0;n<60;n++){document.getElementById('reset').click();const q=document.querySelector('.question'),ids=[...q.querySelectorAll('.choices input')].map(i=>i.value);(observations[q.dataset.question]??=[]).push(ids);}return observations})()`);
  assert(Object.values(orders).some(runs=>new Set(runs.map(ids=>ids.join(','))).size>1),'New runs should change answer order');
  for(const runs of Object.values(orders))for(const ids of runs)assert.deepEqual(ids.slice(-2),['__skip','__none']);
  // Phone widths, tablet width and landscape: animated transitions and expanded results.
  await call('Emulation.setTouchEmulationEnabled',{enabled:true});
  for(const [width,height] of [[320,568],[360,740],[390,844],[430,932],[768,1024],[844,390]]){
    await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
    for(const lang of ['ru','en','he']){
      await click('#reset');await click('#long');await changeLanguage(lang);
      await evaluate('window.scrollTo(0,0)');
      if(width===320 && lang==='ru')await screenshot('compass-phone-home');
      for(let n=0;n<2;n++){
        assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,`${width}px ${lang}, step ${n+1}: page overflow`);
        assert.equal(await evaluate('parseFloat(getComputedStyle(document.querySelector(".importance-select")).fontSize)>=16'),true,'Phone selects need readable text');
        if(width<=650){
          assert.equal(await evaluate('document.querySelector(".help-button").getBoundingClientRect().height>=44'),true);
          assert.equal(await evaluate('document.querySelector(".choice.skip").getBoundingClientRect().height>=44'),true);
        }
        if(n>0){
          const rect=await evaluate('(()=>{const r=document.querySelector(".question legend").getBoundingClientRect();return {top:r.top,bottom:r.bottom}})()');
          assert(rect.top>=0 && rect.top<height,'Auto-advance must bring the new heading onscreen');
        }
        if(n===1){
          await click('.help-button');
          const popup=await evaluate('(()=>{const r=document.querySelector(".issue-tooltip").getBoundingClientRect();return {left:r.left,right:r.right}})()');
          assert(popup.left>=-1 && popup.right<=width+1,`${width}px ${lang}: clipped help`);
          await click('.help-button');
          if(width===320 && lang==='ru')await screenshot('compass-phone-question');
        }
        if(n===0){
          await evaluate('window.scrollTo(0,document.body.scrollHeight)');
          if(width<=650)assert(Math.abs(await evaluate('document.getElementById("question-navigation").getBoundingClientRect().top'))<2,'Back navigation should stay reachable');
        }
        await click('.choices input');
      }
      await click('#results-tab');await assertRanking();
      await evaluate('document.querySelectorAll(".result-card > details").forEach(d=>d.open=true)');
      assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,`${width}px ${lang}: expanded results overflow`);
      if(width===320 && lang==='ru'){
        await evaluate('document.querySelectorAll(".result-card > details").forEach(d=>d.open=false);document.querySelector(".result-card").scrollIntoView()');
        await screenshot('compass-phone-results');
      }
    }
  }
  // Guide and local-file artifacts remain independent of the step state.
  await navigate('http://127.0.0.1:8765/issues.html?lang=ru#Q3','document.querySelectorAll(".issue-section").length===22');
  assert.equal(await evaluate('location.hash'),'#Q3');
  assert.equal(await evaluate('document.querySelectorAll(".open-questions li").length'),48);
  assert.equal(await evaluate('document.querySelectorAll(".reading-links a").length'),44);
  assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
  for(const width of [320,390]){
    await call('Emulation.setDeviceMetricsOverride',{width,height:740,deviceScaleFactor:1,mobile:true});
    for(const lang of ['ru','en','he']){
      await changeLanguage(lang);
      assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,`${width}px ${lang}: guide overflow`);
    }
  }
  await changeLanguage('he');assert.equal(await evaluate('location.hash'),'#Q3');
  const path=require('node:path');
  await navigate('file://'+path.resolve(__dirname,'../index.html'),'document.querySelectorAll(".question").length===1');
  await click('.choices input');assert.equal(await step(),2);await click('#back');assert.equal(await step(),1);
  await navigate('file://'+path.resolve(__dirname,'../issues.html')+'?lang=ru#Q14','document.querySelectorAll(".issue-section").length===22');
  assert.equal(errors.length,0,JSON.stringify(errors));
  ws.close();
  console.log('Browser checks passed: step flow, editing, replacements and scores; answer confirmation and cancellation, shuffled options, transitions in three languages at six viewport sizes (320–844px), sticky navigation, touch targets, expanded results, mobile guide and direct-file loading.');
})().catch(error=>{console.error(error);process.exit(1);});
