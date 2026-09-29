(() => {
  const data=JSON.parse(document.getElementById('compass-data').textContent);
  let lang=compassInitialLanguage();
  const words={
    en:{title:'Explore the issues',eyebrow:'Questions worth thinking through',intro:'These are dilemmas, not a list of correct answers. Each section explains the dispute, outlines competing approaches and asks what a workable policy would need to resolve.',back:'← Ideological Compass',approaches:'Competing approaches',challenges:'Open questions and challenges',reading:'Read and discuss',contents:'Jump to a topic',footer:'Independent reading guide for the research preview. Linked analyses have their own perspectives; party programs are identified as such. External texts may be in a different language. This guide does not change your quiz answers.'},
    he:{title:'להכיר את הסוגיות',eyebrow:'שאלות שכדאי לחשוב עליהן',intro:'אלה דילמות, לא רשימת תשובות נכונות. כל פרק מסביר את המחלוקת, מציג גישות מתחרות ושואל אילו בעיות מדיניות מעשית צריכה לפתור.',back:'→ מצפן אידאולוגי',approaches:'גישות מתחרות',challenges:'שאלות ואתגרים פתוחים',reading:'לקריאה ולדיון',contents:'מעבר לסוגיה',footer:'מדריך קריאה לתצוגת המחקר. לניתוחים המקושרים נקודות מבט משלהם; מצעי מפלגות מסומנים בהתאם. המקורות עשויים להיות בשפה אחרת. המדריך אינו משנה את התשובות לשאלון.'},
    ru:{title:'Разобраться в проблемах',eyebrow:'Вопросы, над которыми стоит подумать',intro:'Это дилеммы, а не список правильных ответов. Каждый раздел объясняет спор, описывает конкурирующие подходы и задаёт вопросы, которые должна решить работающая политика.',back:'← Идеологический Компас',approaches:'Конкурирующие подходы',challenges:'Открытые вопросы и трудности',reading:'Читать и обсуждать',contents:'Перейти к теме',footer:'Руководство для исследовательской версии. У внешних аналитических материалов есть собственная точка зрения; партийные программы обозначены отдельно. Тексты могут быть на другом языке. Эта страница не меняет ответы в опросе.'}
  };
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render(){
    const t=words[lang];
    document.documentElement.lang=lang;document.documentElement.dir=lang==='he'?'rtl':'ltr';document.title=t.title;
    for(const id of ['title','eyebrow','intro','footer','back']) document.getElementById(id).textContent=t[id];
    document.getElementById('back').href=`index.html?lang=${lang}`;
    document.getElementById('language').value=lang;
    document.getElementById('contents').innerHTML=`<label for="topic-jump">${esc(t.contents)}</label><select id="topic-jump"><option value="">—</option>${data.questions.map(q=>`<option value="${q.id}">${esc(q[lang])}</option>`).join('')}</select>`;
    document.getElementById('issue-sections').innerHTML=data.questions.map(q=>`<section class="issue-section" id="${q.id}"><span class="eyebrow">${q.id}</span><h2>${esc(q[lang])}</h2><p class="issue-introduction">${esc(q.help.overview[lang])}</p><h3>${esc(t.challenges)}</h3><ul class="open-questions">${q.help.discussion[lang].map(s=>`<li>${esc(s)}</li>`).join('')}</ul><h3>${esc(t.approaches)}</h3><ul class="approach-list">${q.options.map(o=>`<li>${esc(o[lang])}</li>`).join('')}</ul><h3>${esc(t.reading)}</h3><div class="reading-links">${q.help.links.map(l=>`<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.title[lang])} <bdi>[${l.language.toUpperCase()}]</bdi> ↗</a>`).join('')}</div></section>`).join('');
    document.getElementById('topic-jump').onchange=e=>{if(e.target.value){location.hash=e.target.value;document.getElementById(e.target.value)?.scrollIntoView();}};
  }
  document.getElementById('language').onchange=e=>{
    lang=e.target.value;render();
    try{history.replaceState(null,'',`?lang=${lang}${location.hash}`);}catch{}
    if(location.hash)document.getElementById(location.hash.slice(1))?.scrollIntoView();
  };
  render();
  if(location.hash) requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
})();
