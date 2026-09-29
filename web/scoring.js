/* Explicit graded similarities; option order and language never carry a score. */
(function (root) {
  const importanceWeights = [1, 0.8, 0.5, 0.1];
  const defaultImportance = 0.8;
  function shuffle(items, random = Math.random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function createRun(data, form, random = Math.random) {
    if (form === 'long') return shuffle(data.questions.map(q => q.id), random);
    const domains = [...new Set(data.questions.map(q => q.domain))];
    return shuffle(domains.flatMap(domain => shuffle(data.questions.filter(q => q.domain === domain), random).slice(0,2).map(q=>q.id)), random);
  }
  function componentSimilarity(dimension, a, b) {
    const value = dimension.similarity?.matrix[a]?.[b];
    if (typeof value !== 'number' || value < 0 || value > 1) throw new Error(`Missing similarity rule: ${dimension.id}/${a}/${b}`);
    return value;
  }
  function optionSimilarity(question, a, b) {
    const total = question.dimensions.reduce((s,d)=>s+d.weight,0);
    return question.dimensions.reduce((s,d)=>s+d.weight*componentSimilarity(d,a.profile[d.id],b.profile[d.id]),0)/total;
  }
  function compareResults(a, b) {
    return (b.similarity ?? -1) - (a.similarity ?? -1)
      || b.coverage - a.coverage
      || a.party.id.localeCompare(b.party.id);
  }
  function score(data, answers, form = 'short', historical = false, questionIds = null, importance = {}) {
    // The UI always supplies the run. The fallback retains old reproducible research examples.
    const questions = questionIds ? questionIds.map(id => data.questions.find(q=>q.id===id)) : data.questions.filter(q => form === 'long' || q.short);
    if (questions.some(q=>!q) || new Set(questions.map(q=>q.id)).size !== questions.length) throw new Error('Invalid question run');
    const answered = questions.filter(q => q.options.some(o => o.id === answers[q.id]));
    // User importance supplies the question weight directly; domains add no hidden multiplier.
    const weight = q => importanceWeights.includes(importance[q.id]) ? importance[q.id] : defaultImportance;
    const answeredWeight = answered.reduce((s, q) => s + weight(q), 0);
    const allowed = historical ? ['P', 'S', 'H', 'R'] : ['P', 'S'];
    return data.parties.map(party => {
      const positions = new Map(data.positions.filter(p => p.party_id === party.id).map(p => [p.question_id, p]));
      let matchedWeight = 0, total = 0, excludedCount = 0;
      const items = answered.map(question => {
        const position = positions.get(question.id);
        const user = question.options.find(o => o.id === answers[question.id]);
        const dimensionWeight = question.dimensions.reduce((s, d) => s + d.weight, 0);
        const components = question.dimensions.map(dimension => {
          const evidence = position?.dimensions[dimension.id];
          const known = !!evidence && allowed.includes(evidence.status) && dimension.values.some(v => v.id === evidence.value);
          const similarity = known ? componentSimilarity(dimension, user.profile[dimension.id], evidence.value) : null;
          const w = weight(question) * dimension.weight / dimensionWeight;
          if (known) {
            matchedWeight += w;
            total += w * similarity;
          } else {
            if (evidence && !allowed.includes(evidence.status)) excludedCount++;
          }
          return { dimension, evidence, known, similarity, weight: w, userValue: user.profile[dimension.id] };
        });
        const knownComponents = components.filter(c => c.known);
        const itemWeight = knownComponents.reduce((s, c) => s + c.weight, 0);
        return {
          question, position, user, components, known: knownComponents.length > 0,
          complete: knownComponents.length === components.length,
          coverage: itemWeight / weight(question),
          // Unknown components stay in the denominator and earn no confirmed credit.
          similarity: knownComponents.reduce((s, c) => s + c.weight * c.similarity, 0) / weight(question)
        };
      });
      const matched = items.filter(i => i.known).length;
      const coverage = answeredWeight ? Math.min(1, matchedWeight / answeredWeight) : 0;
      return {
        party, items, matched, excludedCount, complete: items.filter(i => i.complete).length, answered: answered.length, coverage,
        similarity: answeredWeight ? Math.min(1, total / answeredWeight) : null,
        historicalCount: items.flatMap(i => i.components).filter(c => c.known && ['H', 'R'].includes(c.evidence.status)).length
      };
    });
  }
  root.CompassScoring = { score, compareResults, shuffle, createRun, componentSimilarity, optionSimilarity, importanceWeights, defaultImportance };
  if (typeof module !== 'undefined') module.exports = root.CompassScoring;
})(typeof globalThis !== 'undefined' ? globalThis : window);
