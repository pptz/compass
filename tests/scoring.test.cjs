const assert = require('node:assert/strict');
const { score, compareResults, createRun, componentSimilarity, optionSimilarity, importanceWeights, defaultImportance } = require('../web/scoring.js');
const data = require('../compass-data.json');
const assertClose = (actual, expected) => {
  if (typeof expected === 'number') assert(Math.abs(actual - expected) < 1e-12, `${actual} differs from ${expected}`);
  else assert.equal(actual, expected);
};
const dimension = id => ({ id, weight: 1, values: [{ id: 'x' }, { id: 'y' }], similarity: { matrix: { x: { x:1,y:0 }, y:{ x:0,y:1 } } } });
const q = (id, domain, options = [
  { id: 'one', profile: { a: 'x', b: 'x' } },
  { id: 'two', profile: { a: 'x', b: 'y' } },
  { id: 'three', profile: { a: 'y', b: 'y' } },
  { id: 'four', profile: { a: 'y', b: 'x' } }
]) => ({ id, domain, short: true, dimensions: [dimension('a'), dimension('b')], options });
const position = (id, dimensions) => ({ party_id: 'test', question_id: id, dimensions });
const known = value => ({ value, status: 'P' });
const fixture = { questions: [q('Q1','one')], parties: [{ id: 'test' }], positions: [position('Q1', { a: known('x'), b: known('x') })] };
assertClose(score(fixture, { Q1: 'one' })[0].similarity, 1);
assertClose(score(fixture, { Q1: 'two' })[0].similarity, .5);
assertClose(score(fixture, { Q1: 'three' })[0].similarity, 0);
assertClose(score(fixture, { Q1: 'four' })[0].similarity, .5);
// Position in a displayed answer list must never determine ideological distance.
const reordered = structuredClone(fixture);
reordered.questions[0].options.reverse();
assertClose(score(reordered, { Q1: 'four' })[0].similarity, .5);
for (const answer of ['__none', '__skip', 'bogus', 2, null, undefined]) {
  assertClose(score(fixture, { Q1: answer })[0].similarity, null);
  assertClose(score(fixture, { Q1: answer })[0].answered, 0);
}
// One evidenced ingredient gives half coverage, not a fully evidenced option.
const partial = structuredClone(fixture);
delete partial.positions[0].dimensions.b;
const p = score(partial, { Q1: 'two' })[0];
assert.equal(p.similarity, .5);
assert.equal(p.items[0].similarity, .5);
assert.equal(p.coverage, .5);
assert.equal(p.complete, 0);
// History is excluded per component, not per whole question.
const historic = structuredClone(fixture);
historic.positions[0].dimensions.b.status = 'H';
assertClose(score(historic, { Q1: 'two' })[0].similarity, .5);
assertClose(score(historic, { Q1: 'two' }, 'short', true)[0].similarity, .5);
assertClose(score(historic, { Q1: 'two' }, 'short', true)[0].historicalCount, 1);
// Equal importance means equal question weight, regardless of topic counts.
const weighted = {
  parties: fixture.parties,
  questions: [q('Q1','one'), q('Q2','one'), q('Q3','two')],
  positions: ['Q1','Q2','Q3'].map(id => position(id,{a:known('x'),b:known('x')}))
};
assertClose(score(weighted, { Q1:'one',Q2:'one',Q3:'three' })[0].similarity,2/3);
assertClose(score(weighted, { Q1:'one',Q2:'__skip',Q3:'three' })[0].similarity,.5);
// Importance is the only question multiplier, and unknowns retain their chosen weight.
assert.deepEqual(importanceWeights,[1,.8,.5,.1]);assert.equal(defaultImportance,.8);
const importanceFixture={parties:fixture.parties,questions:[q('Q1','one'),q('Q2','two')],positions:fixture.positions};
const importanceAnswers={Q1:'one',Q2:'one'};
assertClose(score(importanceFixture,importanceAnswers,'short',false,null,{Q1:1,Q2:.1})[0].similarity,1/1.1);
assertClose(score(importanceFixture,importanceAnswers,'short',false,null,{Q1:.1,Q2:1})[0].similarity,.1/1.1);
assertClose(score(importanceFixture,importanceAnswers,'short',false,null,{Q1:.1,Q2:.1})[0].similarity,.5);
assertClose(score(importanceFixture,importanceAnswers,'short',false,null,{Q1:1,Q2:1})[0].coverage,.5);
assertClose(score(importanceFixture,{Q1:'two',Q2:'one'},'short',false,null,{Q1:1,Q2:.8})[0].similarity,.5/1.8);
assertClose(score(importanceFixture,{Q1:'one',Q2:'__skip'},'short',false,null,{Q1:.1,Q2:1})[0].similarity,1);
for(const invalid of [0,-1,.05,.25,Infinity,NaN,'__replace','1',2]){
  assertClose(score(importanceFixture,importanceAnswers,'short',false,null,{Q1:invalid})[0].similarity,.5);
}
// Complete evidence and agreement can still score 100%.
const complete = {
  parties: fixture.parties,
  questions: Array.from({length:10},(_,i)=>q(`Q${i}`,`domain${i%5}`)),
  positions: Array.from({length:10},(_,i)=>position(`Q${i}`,{a:known('x'),b:known('x')}))
};
const allTen=Object.fromEntries(complete.questions.map(q=>[q.id,'one']));
assertClose(score(complete,allTen)[0].similarity,1);
// Two fully documented matches out of ten: no extrapolation to the other eight.
const sparse=structuredClone(complete);
sparse.positions=sparse.positions.slice(0,2);
assertClose(score(sparse,allTen)[0].similarity,.2);
assertClose(score(sparse,allTen)[0].coverage,.2);
// Half overlap on those two questions gives 10%; one known component each also gives 10%.
assertClose(score(sparse,{...allTen,Q0:'two',Q1:'two'})[0].similarity,.1);
const halfKnown=structuredClone(sparse);
halfKnown.positions.forEach(p=>delete p.dimensions.b);
assertClose(score(halfKnown,allTen)[0].similarity,.1);
const noEvidence=structuredClone(sparse);noEvidence.positions=[];
assertClose(score(noEvidence,allTen)[0].similarity,0);
assertClose(score(noEvidence,allTen)[0].coverage,0);
assertClose(score(noEvidence,{})[0].similarity,null);
// User skips leave the denominator; unknown party positions on answered questions stay in it.
assertClose(score(sparse,{Q0:'one',Q1:'one',Q2:'__skip'})[0].similarity,1);
assertClose(score(sparse,{Q0:'one',Q1:'one',Q2:'one'})[0].similarity,2/3);
// Higher confirmed score ranks first, then evidence coverage; never language or eligibility.
const ranking=[
  {party:{id:'sparse'},similarity:.2,coverage:.2},
  {party:{id:'broad'},similarity:.8,coverage:1},
  {party:{id:'known-zero'},similarity:0,coverage:1},
  {party:{id:'unknown'},similarity:0,coverage:0},
  {party:{id:'tie-more-data'},similarity:.2,coverage:.9},
  {party:{id:'unanswered'},similarity:null,coverage:0}
];
assert.deepEqual(ranking.sort(compareResults).map(r=>r.party.id),['broad','tie-more-data','sparse','known-zero','unknown','unanswered']);

// Validate all live policy packages and their evidence links.
assert.equal(data.questions.length,20);
assert.equal(data.questions.filter(q=>q.short).length,10);
assert(!data.choices, 'The old global agreement scale must not survive.');
assert.equal(new Set(data.positions.map(p=>`${p.party_id}/${p.question_id}`)).size,320);
for (const question of data.questions) {
  assert(question.options.length >= 4);
  assert.equal(new Set(question.options.map(o=>o.id)).size,question.options.length);
  assert.equal(new Set(question.options.map(o=>JSON.stringify(o.profile))).size,question.options.length);
  for (const option of question.options) {
    assert(option.en && option.he && option.ru);
    for (const dim of question.dimensions) assert(dim.values.some(v=>v.id===option.profile[dim.id]));
  }
  assert(question.en && question.he && question.ru);
  assert.equal(question.help.links.length,2);
  for (const lang of ['en','he','ru']) {
    assert(question.help.overview[lang]);
    assert(question.help.discussion[lang].length>=2);
    assert(question.help.links.every(l=>l.title[lang] && l.url.startsWith('https://')));
  }
  for (const dim of question.dimensions) {
    assert(new Set(question.options.map(o=>o.profile[dim.id])).size>=2);
    assert(dim.ru && dim.values.every(v=>v.ru));
    assert(dim.similarity.rationale.ru);
    for (const a of dim.values) for (const b of dim.values) {
      const sim=componentSimilarity(dim,a.id,b.id);
      assert(sim>=0 && sim<=1);
      assert.equal(sim,componentSimilarity(dim,b.id,a.id));
      if(a.id===b.id) assert.equal(sim,1);
    }
  }
}
for (const pos of data.positions) {
  const question = data.questions.find(q=>q.id===pos.question_id);
  for (const [id,evidence] of Object.entries(pos.dimensions)) {
    const values=evidence.values || [evidence.value];
    assert(values.length && values.every(value=>question.dimensions.find(d=>d.id===id)?.values.some(v=>v.id===value)));
    for (const estimate of [evidence.status==='I' ? evidence : null, evidence.inference].filter(Boolean)) {
      assert.equal(estimate.status,'I');assert.equal(estimate.confidence,.6);
      assert(estimate.rationale_localized.en && estimate.rationale_localized.ru && estimate.rationale_localized.he);
      assert(estimate.source_ids.length && estimate.source_ids.every(s=>data.sources[s]));
      assert((estimate.values || [estimate.value]).every(value=>question.dimensions.find(d=>d.id===id)?.values.some(v=>v.id===value)));
    }
    assert(evidence.source_ids.length && evidence.source_ids.every(s=>data.sources[s]));
  }
}
const answers=Object.fromEntries(data.questions.map(q=>[q.id,q.options[0].id]));
for (const form of ['short','long']) for (const history of [false,true]) for (const r of score(data,answers,form,history)) {
  assert(r.coverage>=0 && r.coverage<=1);
  assert(r.similarity===null || (r.similarity>=0 && r.similarity<=1));
  assert(r.similarity<=r.coverage+1e-10,'Confirmed agreement cannot exceed documented evidence');
}
// Similar policies earn graded credit even when component values differ.
const graded=structuredClone(fixture);
graded.questions[0].dimensions[1].similarity.matrix={x:{x:1,y:.75},y:{x:.75,y:1}};
assertClose(score(graded,{Q1:'two'})[0].similarity,.875);
delete graded.positions[0].dimensions.b;
assertClose(score(graded,{Q1:'two'})[0].similarity,.5);
const termLimits=data.questions.find(q=>q.id==='Q14');
assert(termLimits.options.some(a=>termLimits.options.some(b=>optionSimilarity(termLimits,a,b)===.875)));
const service=data.questions.find(q=>q.id==='Q2');
assert(service.options.some(a=>service.options.some(b=>optionSimilarity(service,a,b)===.75)));
// A universal core requirement partly overlaps with a funding-only requirement.
const schools=data.questions.find(q=>q.id==='Q9');
const schoolOption=id=>schools.options.find(o=>o.id===id);
assert.equal(optionSimilarity(schools,schoolOption('universal_core'),schoolOption('mixed_core')),.875);
assert.equal(optionSimilarity(schools,schoolOption('universal_core'),schoolOption('autonomous')),.5);
const schoolFixture={questions:[schools],parties:fixture.parties,positions:[position('Q9',{core_condition:known('yes')})]};
assertClose(score(schoolFixture,{Q9:'universal_core'})[0].similarity,.375);
assertClose(score(schoolFixture,{Q9:'universal_core'})[0].coverage,.5);
// The detailed Yashar plan supports a funding condition, not an entire answer package.
const yasharResult = (answers, estimates=true) => score(data,answers,'long',false,Object.keys(answers),{},estimates).find(r=>r.party.id==='yashar');
assertClose(yasharResult({Q9:'mixed_core'},false).similarity,.5);
assertClose(yasharResult({Q9:'universal_core'},false).similarity,.375);
assertClose(yasharResult({Q9:'autonomous'},false).similarity,0);
assertClose(yasharResult({Q9:'universal_core'},false).documentedCoverage,.5);
assertClose(yasharResult({Q2:'universal_military'},false).similarity,1);
// A direct transport statement replaces the local-discretion inference, without
// supplying an unknown service scale or double counting the earlier estimate.
assertClose(yasharResult({Q6:'local_limited'}).similarity,.5);
assertClose(yasharResult({Q6:'private_local'}).similarity,.5);
assertClose(yasharResult({Q6:'local_limited'},false).similarity,.5);
assertClose(yasharResult({Q6:'local_limited'}).documentedCoverage,.5);
const reviewedResult = (party, answers, history=false, estimates=true) =>
  score(data,answers,'long',history,Object.keys(answers),{},estimates).find(r=>r.party.id===party);
// The Reservists explicitly allow either eight years or two terms.
for (const option of ['two_terms','eight_years']) {
  assertClose(reviewedResult('reservists',{Q14:option}).similarity,1);
}
assertClose(reviewedResult('reservists',{Q14:'elections'}).similarity,0);
// Historical spending pledges do not become fully documented current positions.
assertClose(reviewedResult('balad',{Q7:'progressive_expansion'}).similarity,.3);
assertClose(reviewedResult('balad',{Q7:'progressive_expansion'},false,false).similarity,0);
assertClose(reviewedResult('balad',{Q7:'progressive_expansion'},true).similarity,1);
// The joint Hadash–Balad statement establishes opposition to compulsion only.
for (const party of ['hadash','balad']) {
  assertClose(reviewedResult(party,{Q19:'community_voluntary'},false,false).similarity,.5);
  assertClose(reviewedResult(party,{Q19:'universal_military'},false,false).similarity,0);
}
// An umbrella-list response must not fill another member's missing position.
assert.deepEqual(data.positions.find(p=>p.party_id==='raam' && p.question_id==='Q6').dimensions,{});
for (const party of ['raam','hadash','balad']) {
  const territory=data.positions.find(p=>p.party_id===party && p.question_id==='Q11');
  assert(!territory.dimensions.territorial_route);
  assert.equal(territory.dimensions.unilateral_sovereignty.value,'no');
  assert.equal(territory.withdrawn_evidence[0].previous_evidence.value,'withdraw');
}
const reviewedEntries = require('../coverage-review.json').positions;
assert.equal(new Set(reviewedEntries.map(e=>`${e.party_id}/${e.question_id}/${e.dimension_id}`)).size,reviewedEntries.length);
for (const entry of reviewedEntries) {
  const live=data.positions.find(p=>p.party_id===entry.party_id && p.question_id===entry.question_id).dimensions[entry.dimension_id];
  assert.equal(live.status,entry.status);
  assert.deepEqual(live.value || live.values,entry.value || entry.values);
  for (const lang of ['en','he','ru']) assert(live.rationale_localized[lang]);
}
assert.equal(data.positions.find(p=>p.party_id==='yashar' && p.question_id==='Q6').dimensions.authority.previous_evidence.status,'I');
// Explicit run IDs, including replacements, control both inclusion and weights.
assertClose(score(weighted,{Q1:'one',Q2:'one',Q3:'three'},'short',false,['Q2','Q3'])[0].similarity,.5);
assertClose(score(weighted,{Q1:'one',Q2:'one',Q3:'three'},'short',false,['Q3'])[0].similarity,0);
assert.throws(()=>score(weighted,{},'short',false,['Q1','Q1']),/Invalid question run/);
assert.throws(()=>score(weighted,{},'short',false,['missing']),/Invalid question run/);
// Reproducible random trials: two per domain, no duplicates, all topics reachable.
let seed=12345;
const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
const original=data.questions.map(q=>q.id), seen=new Set(), runs=new Set();
for(let i=0;i<100;i++){
  const run=createRun(data,'short',random);
  assert.equal(run.length,10);assert.equal(new Set(run).size,10);
  const counts={};
  run.forEach(id=>{seen.add(id);const domain=data.questions.find(q=>q.id===id).domain;counts[domain]=(counts[domain]||0)+1;});
  assert.equal(Object.keys(counts).length,5);assert(Object.values(counts).every(n=>n===2));
  runs.add(run.join(','));
}
assert.equal(seen.size,20);assert(runs.size>90);
assert.deepEqual([...createRun(data,'long',random)].sort(),[...original].sort());
assert.deepEqual(data.questions.map(q=>q.id),original);
assert(data.parties.every(p=>p.ru));
const current=score(data,answers,'long'), withHistory=score(data,answers,'long',true);
assert(current.find(r=>r.party.id==='balad').coverage>0);
assert(withHistory.find(r=>r.party.id==='balad').coverage>0);
assert(current.find(r=>r.party.id==='religious_zionism').matched>0);
assert(current.find(r=>r.party.id==='otzma').coverage>0);
assert(withHistory.find(r=>r.party.id==='otzma').coverage>0);
console.log(`Passed: confirmed agreement (2/10 = 20%), importance weights, graded credit, ranking and ties, unknowns, evidence filters, selected runs, skips, 100 randomized runs, translations and ${data.questions.reduce((n,q)=>n+q.options.length,0)} policy profiles.`);
// Broad inferred support for transport matches every operating-service choice, never a ban.
const transport=data.questions.find(q=>q.id==='Q6');
const baladTransport=data.positions.find(p=>p.party_id==='balad' && p.question_id==='Q6');
const transportFixture={questions:[transport],parties:[data.parties.find(p=>p.id==='balad')],positions:[baladTransport]};
for (const option of transport.options) {
  const result=score(transportFixture,{Q6:option.id})[0];
  assertClose(result.similarity,option.profile.service==='none' ? 0 : .3);
  assert.equal(result.documentedCoverage,0);
  assert.equal(result.confirmedSimilarity,0);
  assert.equal(result.inferredCount,1);
  assert.equal(result.items[0].components.find(c=>c.dimension.id==='authority').known,false);
  const disabled=score(transportFixture,{Q6:option.id},'short',false,null,{},false)[0];
  assert.equal(disabled.similarity,0);assert.equal(disabled.inferredCount,0);
}
// Reviewed secondary reports are enabled independently of the historical switch.
const reported=structuredClone(fixture);
reported.positions[0].dimensions.a.status='R';
assertClose(score(reported,{Q1:'one'})[0].similarity,1);
// Disabling estimates restores the documented score, preserving the denominator.
const inferred=structuredClone(fixture);
inferred.positions[0].dimensions.b={value:'x',status:'I',confidence:.6};
const enabled=score(inferred,{Q1:'one'})[0];
assertClose(enabled.similarity,.8);assertClose(enabled.confirmedSimilarity,.5);
assertClose(enabled.inferredSimilarity,.3);assertClose(enabled.documentedCoverage,.5);
assertClose(score(inferred,{Q1:'one'},'short',false,null,{},false)[0].similarity,.5);
// Historical facts can have a separately labeled inference fallback when archives are off.
inferred.positions[0].dimensions.b={value:'y',status:'H',inference:{value:'x',status:'I',confidence:.6}};
assertClose(score(inferred,{Q1:'one'})[0].similarity,.8);
assertClose(score(inferred,{Q1:'one'},'short',true)[0].similarity,.5);
assertClose(score(inferred,{Q1:'one'},'short',false,null,{},false)[0].similarity,.5);
for (const r of current) {
  assertClose(r.similarity,r.confirmedSimilarity+r.inferredSimilarity);
  assert(r.confirmedSimilarity<=r.documentedCoverage+1e-12);
  assertClose(score(data,answers,'long',false,null,{},false).find(x=>x.party.id===r.party.id).similarity,r.confirmedSimilarity);
}
console.log('Passed: secondary sources, broad transport support, discounted inferences, separate source coverage, archive precedence, estimate toggle, and unchanged unknown-answer denominator.');
