"""Generate the readable policy-choice specification from the live dataset."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
data = json.loads((root/'compass-data.json').read_text())
lines = ['''# Your Choice — Your Vote — policy choices and confirmed agreement (v0.4)

The browser contains **20 original questions, 91 substantive choices and 40 policy components**, in English, Hebrew and Russian. [Open the quiz](index.html) or [read the issue guide](issues.html). Each guide section introduces the dispute, presents competing approaches, poses open questions and links to further reading. The question-mark help and “About this issue” elements explain the issue itself; calculation details are separate.

[Zehut's compass](https://zehut.org.il/compass), inspected on 29 September 2026, informed the policy-choice format. These are newly authored questions; neither its question bank nor its party-specific weights are reused.

## Question selection

The quiz shows one question per step. A substantive answer, Skip or None receives a brief visual confirmation before advancing to the next question; the last choice opens results. Back restores earlier answers and importance; Next continues after an importance-only edit or when retaining a saved answer. Language changes preserve the current step. Replacement keeps the same step number, and restarting resets to step one.

Every new short run draws **two random questions from each of five domains**, then shuffles all ten. This balances topic coverage; it does not designate ten questions as the most important. The long run shuffles all twenty. Substantive answer choices are also shuffled once per run; revisiting a question or switching language preserves their order and answer IDs. Overlap tables use the same displayed order. Switching language preserves the run and answers; starting again creates a new run.

Importance appears immediately beneath the question text, before the answer options. **Change question** immediately draws an unused question, preferring a random question from the same domain when possible. The importance menu offers the same action. **Skip** is a separate unscored choice that retains the question in the run and moves forward, as does “None of these fits”. Back allows either choice to be revised. Selecting “Not important” additionally offers a manual replacement chooser.

Replaced questions stay retired for that run; after ten replacements in a short run there are no spares. The long form starts with all twenty questions, so it has no spares. The change action is disabled with an explanation when no unused questions remain; Skip remains available. Other answers and importance choices are preserved, and the replacement starts with default importance. Scores use the actual selected questions, including replacements.

## Scoring and evidence

Answer IDs and letters have no numerical order. Each answer describes a policy package with two separately evaluated components. Each component has an explicit, symmetric similarity matrix: identical policies receive 1, related approaches can receive .25, .5 or .75, and opposed or non-overlapping approaches receive 0. The complete rules and rationales are in [similarity-rules.json](similarity-rules.json). Question-level overlap tables are also visible in the quiz.

These similarities are **editorial estimates of policy overlap**, not measured probabilities or a validated ideological-distance scale. Different reasonable judgments could change the result. They should be reviewed alongside the wording and evidence before public release.

For example, universal service with military priority and universal service with free choice of military or civilian service share the obligation component (1), while their pathways receive .5 similarity: a fully evidenced question scores **75%**. A two-term limit and an eight-year limit share a binding limit (1); the terms/years mechanisms receive .75, producing **87.5%**. If the party's second component is unknown, it earns no credit: a full match on the one known component gives 50% confirmed agreement for that question and 50% documented positions.

Each question has four importance levels in this order (the interface shows only verbal labels; these are the internal weights): critical = **1.0**, important = **0.8** (default), not very important = **0.5**, not important = **0.1**. Change question appears after them as an action in the short form. Importance is the question weight; domains do not add another multiplier. The minimum is positive, so “not important” still contributes a small amount. A skipped or replaced question does not contribute.

For question i and component k:

```
question_weight_i = user_importance_i
component_weight_ik = question_weight_i / 2
component_similarity_ik = matrix_k[user_value][party_value]

confirmed_agreement = 100 * sum(known component_weight * component_similarity)
                           / sum(all component_weight for answered questions)
documented_positions = 100 * sum(known component_weight)
                 / sum(all component_weight for answered questions)
```

The denominator is the sum of chosen importance for substantive user answers. Skipped questions are excluded. The short run still samples two questions per domain, but only user importance controls scoring. A zero denominator returns no score. Parties are scored independently; percentages do not sum to 100 and the best party is not normalized to 100. Unknown party components remain in the denominator and add no confirmed agreement. They are labeled unknown, not claimed to be disagreement. With no usable party evidence the score is 0% confirmed agreement and the card explicitly says there is no usable evidence. With no substantive user answers there is no score.

Evidence status belongs to each component: **P** = published policy; **S** = attributable statement; **H** = historical document; **R** = secondary characterization. The default filter includes P/S. The optional historical/secondary mode includes H/R and is explicitly labeled. A live undated page is not proof of a newly issued election manifesto; dates and retrieval limitations remain visible in the source registry.

**Two full matches out of ten equally weighted answered questions give 20%**, even if the other eight party positions are unknown. If the two known questions have 50% similarity, the result is 10%. Scores cannot exceed the documented share. There is no extrapolation of agreement to unknown positions, and no hypothetical completion range is displayed.

For example, one fully matched critical question (weight 1) and one unknown, unimportant question (weight 0.1) produce 1 / 1.1 = 90.91%. Reversing the importance gives 0.1 / 1.1 = 9.09%. The denominator still includes the unknown position at its chosen weight.

Every party is ranked by confirmed agreement, highest first. Equal unrounded scores are ordered by documented share, then stable party ID. Results are no longer separated into a threshold-qualified ranking and unranked partial percentages. The old known-only normalization and coverage thresholds have been removed.

“Positions documented” (formerly “coverage”) describes the importance-weighted share of answered components backed by usable evidence. It is not a match percentage: it falls when source research is incomplete, a source does not address one of a question's two components, or dated sources are excluded. Both the score and the source completeness are shown, with an explanation above the result cards.

## Source coverage and limitations

The source-linked party key is [compass-data.json](compass-data.json), with a component-level export in [party-positions.csv](party-positions.csv). The older agreement-scale number was not mapped to an entire answer option: only propositions actually supported by the evidence were recoded. The [archived investigation](archive/agreement-scale-v1/compass-research.md) preserves the earlier source search; its questionnaire and scoring rules are superseded.

This revision adds evidence from Religious Zionism's official sovereignty page, dated 2021 program documents and its 2023–24 budget discussion. Balad's official 2017 program supplies additional constitutional and economic components. Dated programs remain historical evidence. A card with no usable evidence explains whether the filter excluded available evidence or whether the answered topics have a research gap; it offers the historical filter when applicable.

The evidence remains sparse. Otzma Yehudit’s 2020 principles, archived by the Knesset channel, now supply historical evidence on the sovereignty question. This does not establish its complete current program. Finding a party website or a program does not establish every component asked by this questionnaire. This prototype does not yet support a well-evidenced current all-party ranking. Russian covers the quiz, issue guide and policy labels; detailed party-evidence rationales retain their English research text, and external reading links identify the source language.

## Questions and policy packages

Stable IDs below identify topics, not their order in a run. All questions can appear in a short run. The two components beneath each question are its scoring dimensions.
''']
for q in data['questions']:
    lines += [f"\n### {q['id']} · {q['en']}\n", f"**{q['he']}**\n"]
    for i, option in enumerate(q['options']):
        lines += [f"- **{chr(65+i)}.** {option['en']}\n  \n  {option['he']}\n"]
    lines += ['\nComponents: ' + ' / '.join(d['en'] for d in q['dimensions']) + '.\n']
    lines += ['\n| Choice | ' + ' | '.join(d['en'] for d in q['dimensions']) + ' |\n', '|---|' + '---|'*len(q['dimensions']) + '\n']
    for i, option in enumerate(q['options']):
        labels = [next(v['en'] for v in dim['values'] if v['id'] == option['profile'][dim['id']]) for dim in q['dimensions']]
        lines += [f"| {chr(65+i)} | " + ' | '.join(labels) + ' |\n']
lines += ['\n## Source registry\n\nDates and retrieval limitations are preserved from the research. An undated live page is not proof of a newly issued 2026 manifesto.\n\n| ID | Source | Date | Note |\n|---|---|---|---|\n']
for key, source in data['sources'].items():
    lines += [f"| {key} | [{source['title']}]({source['url']}) | {source.get('date') or 'Undated'} | {source.get('note','')} |\n"]
(root/'compass-research.md').write_text(''.join(lines))
print('Updated compass-research.md for confirmed agreement.')

gaps = ['''# Где нужны источники партийных позиций

Это состояние нашей исследовательской базы, а не утверждение об отсутствии у партий программ.
В банке 20 вопросов по два компонента: максимум 40 известных компонентов на партию.
Числа ниже — количество компонентов во всём банке, а не процент совпадения или показатель полноты в конкретном прохождении.
В результатах полнота данных зависит от отвеченных вопросов, их важности и фильтра источников.

| Партия | Без архивов и вторичных источников (из 40) | С ними (из 40) |
|---|---:|---:|
''']
counts = []
for party in data['parties']:
    components = [c for p in data['positions'] if p['party_id'] == party['id'] for c in p['dimensions'].values()]
    current = sum(c['status'] in ['P', 'S'] for c in components)
    counts.append((current, len(components), party['ru']))
for current, total, name in sorted(counts):
    gaps.append(f'| {name} | {current} | {total} |\n')
gaps.append('''
## Чем можно помочь

Особенно полезны официальные программы, тематические документы и прямые заявления по конкретным вопросам для партий с небольшим числом заполненных компонентов. Приоритет: Ликуд, ШАС, Яхадут ха-Тора, РААМ, ХАДАШ, ТААЛ, БАЛАД, Оцма Йехудит и Религиозный сионизм.

Достаточно прислать ссылку, название партии и тему; если есть — дату публикации и нужный фрагмент. Старые документы тоже полезны, но будут отмечены как исторические. Общего идеологического описания недостаточно, чтобы приписать партии весь пакет ответа.

Темы и варианты сформулированы в [обзоре вопросов](issues.html?lang=ru). Уже закодированные позиции и источники — в [таблице компонентов](party-positions.csv) и [исследовательском отчёте](compass-research.md).
''')
(root/'source-gaps.md').write_text(''.join(gaps))
