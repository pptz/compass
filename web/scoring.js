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
    // Deal questions in rounds across shuffled domains. With six domains and
    // ten places, all six appear once and four random domains appear twice.
    const domains = [...new Set(data.questions.map(q => q.domain))];
    const pools = new Map(domains.map(domain => [domain, shuffle(data.questions.filter(q => q.domain === domain), random)]));
    const selected = [], target = Math.min(10, data.questions.length);
    while (selected.length < target) {
      for (const domain of shuffle(domains, random)) {
        const question = pools.get(domain).pop();
        if (question) selected.push(question.id);
        if (selected.length === target) break;
      }
    }
    return shuffle(selected, random);
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
      || (b.documentedCoverage ?? b.coverage) - (a.documentedCoverage ?? a.coverage)
      || b.coverage - a.coverage
      || a.party.id.localeCompare(b.party.id);
  }
  function evidenceValues(evidence) {
    return evidence?.values || (evidence?.value ? [evidence.value] : []);
  }
  function score(data, answers, form = 'short', historical = false, questionIds = null, importance = {}, estimates = true) {
    // The UI always supplies the run. The fallback retains old reproducible research examples.
    const questions = questionIds ? questionIds.map(id => data.questions.find(q=>q.id===id)) : data.questions.filter(q => form === 'long' || q.short);
    if (questions.some(q=>!q) || new Set(questions.map(q=>q.id)).size !== questions.length) throw new Error('Invalid question run');
    const answered = questions.filter(q => q.options.some(o => o.id === answers[q.id]));
    // User importance supplies the question weight directly; domains add no hidden multiplier.
    const weight = q => importanceWeights.includes(importance[q.id]) ? importance[q.id] : defaultImportance;
    const answeredWeight = answered.reduce((s, q) => s + weight(q), 0);
    const allowed = ['P', 'S', 'R', ...(historical ? ['H'] : []), ...(estimates ? ['I'] : [])];
    return data.parties.map(party => {
      const positions = new Map(data.positions.filter(p => p.party_id === party.id).map(p => [p.question_id, p]));
      let matchedWeight = 0, documentedWeight = 0, total = 0, confirmedTotal = 0, excludedCount = 0;
      const items = answered.map(question => {
        const position = positions.get(question.id);
        const user = question.options.find(o => o.id === answers[question.id]);
        const dimensionWeight = question.dimensions.reduce((s, d) => s + d.weight, 0);
        const components = question.dimensions.map(dimension => {
          const stored = position?.dimensions[dimension.id];
          const evidence = stored?.status === 'H' && !historical && estimates && stored.inference ? stored.inference : stored;
          const values = evidenceValues(evidence);
          const inferred = evidence?.status === 'I';
          const confidence = inferred ? evidence.confidence : 1;
          const known = !!evidence && allowed.includes(evidence.status) && values.length > 0
            && values.every(value => dimension.values.some(v => v.id === value))
            && Number.isFinite(confidence) && confidence > 0 && confidence <= 1;
          // A coarse position covers its named alternatives equally, without inventing specificity.
          const similarity = known ? (evidence.values ? Number(values.includes(user.profile[dimension.id])) : componentSimilarity(dimension, user.profile[dimension.id], evidence.value)) : null;
          const w = weight(question) * dimension.weight / dimensionWeight;
          if (known) {
            matchedWeight += w * confidence;
            total += w * similarity * confidence;
            if (!inferred) { documentedWeight += w; confirmedTotal += w * similarity; }
          } else {
            if (stored?.status === 'H' && !historical) excludedCount++;
          }
          return { dimension, evidence, known, inferred, confidence, similarity, weight: w, userValue: user.profile[dimension.id] };
        });
        const knownComponents = components.filter(c => c.known);
        const itemWeight = knownComponents.reduce((s, c) => s + c.weight * c.confidence, 0);
        return {
          question, position, user, components, known: knownComponents.length > 0,
          complete: knownComponents.length === components.length && knownComponents.every(c=>!c.inferred),
          coverage: itemWeight / weight(question),
          documentedCoverage: knownComponents.filter(c=>!c.inferred).reduce((s,c)=>s+c.weight,0) / weight(question),
          // Unknown components stay in the denominator and earn no confirmed credit.
          similarity: knownComponents.reduce((s, c) => s + c.weight * c.similarity * c.confidence, 0) / weight(question)
        };
      });
      const matched = items.filter(i => i.known).length;
      const coverage = answeredWeight ? Math.min(1, matchedWeight / answeredWeight) : 0;
      return {
        party, items, matched, excludedCount, complete: items.filter(i => i.complete).length, answered: answered.length, coverage,
        similarity: answeredWeight ? Math.min(1, total / answeredWeight) : null,
        confirmedSimilarity: answeredWeight ? Math.min(1, confirmedTotal / answeredWeight) : null,
        inferredSimilarity: answeredWeight ? Math.max(0, (total-confirmedTotal) / answeredWeight) : null,
        documentedCoverage: answeredWeight ? Math.min(1, documentedWeight / answeredWeight) : 0,
        inferredCount: items.flatMap(i=>i.components).filter(c=>c.known && c.inferred).length,
        historicalCount: items.flatMap(i => i.components).filter(c => c.known && c.evidence.status === 'H').length
      };
    });
  }
  root.CompassScoring = { score, compareResults, shuffle, createRun, componentSimilarity, optionSimilarity, evidenceValues, importanceWeights, defaultImportance };
  if (typeof module !== 'undefined') module.exports = root.CompassScoring;
})(typeof globalThis !== 'undefined' ? globalThis : window);
