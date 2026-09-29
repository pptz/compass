"""Generate the readable policy-choice specification from the live dataset."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
data = json.loads((root/'compass-data.json').read_text())
lines = ['''# Your Choice — Your Vote — policy choices, sources and reasoned estimates (v0.5)

The browser contains **22 original questions, 100 substantive choices and 44 policy components**, in English, Hebrew and Russian. Each question offers at most five substantive answers. [Open the quiz](index.html) or [read the issue guide](issues.html). Each guide section introduces the dispute, presents competing approaches, poses open questions and links to further reading. The question-mark help and “About this issue” elements explain the issue itself; calculation details are separate.

[Zehut's compass](https://zehut.org.il/compass), inspected on 29 September 2026, informed the policy-choice format. These are newly authored questions; neither its question bank nor its party-specific weights are reused.

## Question selection

The quiz shows one question per step. A substantive answer, Skip or None receives a brief visual confirmation before advancing to the next question; the last choice opens results. Back restores earlier answers and importance; Next continues after an importance-only edit or when retaining a saved answer. Language changes preserve the current step. Replacement keeps the same step number, and restarting resets to step one.

Every new short run draws **one question from each of six domains and a second question from four randomly selected domains**, then shuffles all ten. Every domain appears, with an equal chance of receiving the extra question; exact equality within ten questions is impossible with six domains. The long run shuffles all 22. The Status of Women domain contains Q21 (party representation) and Q22 (social equality and gender separation). Substantive answer choices are also shuffled once per run; revisiting a question or switching language preserves their order and answer IDs. Overlap tables use the same displayed order. Switching language preserves the run and answers; starting again creates a new run.

Importance appears immediately beneath the question text, before the answer options. **Change question** immediately draws an unused question, preferring a random question from the same domain when possible. The importance menu offers the same action. **Skip** is a separate unscored choice that retains the question in the run and moves forward, as does “None of these fits”. Back allows either choice to be revised. Selecting “Not important” additionally offers a manual replacement chooser.

Replaced questions stay retired for that run; after twelve replacements in a short run there are no spares. The long form starts with all 22 questions, so it has no spares. The change action is disabled with an explanation when no unused questions remain; Skip remains available. Other answers and importance choices are preserved, and the replacement starts with default importance. Scores use the actual selected questions, including replacements.

## Scoring and evidence

Each answer has two independently scored components. Importance is the only question multiplier: Critical = 1, Important = 0.8 (default), Not very important = 0.5, Not important = 0.1. The interface shows verbal importance labels. Each component receives half the question weight.

Specific party positions use the graded overlap matrices in [similarity-rules.json](similarity-rules.json). Related policies can partially match. Broad positions instead contain an explicit set of compatible values (`values`): each included alternative matches fully and alternatives outside the set receive zero. These sets express a shared policy direction, not uncertainty that the party endorses every detailed package.

For example, Balad's secular orientation supports an **inference** in favor of allowing Shabbat transport. `service = [limited, full]` matches both kinds of operating service equally and matches `none` at zero. The decision-making authority remains unknown. No national/local preference or timetable is invented. At the default inference factor of 0.6, this one known direction contributes 30% of the two-component question, not 100%. This is an editorial discount, not a measured probability.

Evidence categories:

- **P**: published party policy; included by default.
- **S**: attributable statement; included by default.
- **R**: reviewed secondary report or institutional party profile; now included by default. Undated profiles are identified as such, not called new election manifestos.
- **H**: historical source; included only with the historical switch.
- **I**: source-linked editorial inference, with a multilingual explanation. Included by default, discounted to 60%, and independently switchable. It does not increase documented coverage.
- **U**: unknown; contributes no credit but stays in the denominator.

A documented position takes precedence over an inference. Where an archived position has a separate inference fallback, the fallback can be used with archives off; switching archives on uses the historical position, without adding or averaging both. Corroborating entries and superseded evidence remain in the dataset for review; they are not double counted.

```
question_weight = selected_importance
component_weight = question_weight / 2
specific_similarity = matrix[user_value][party_value]
broad_similarity = 1 if user_value in compatible_values else 0
D = sum(question_weight for ALL substantive answered questions)

sourced_score = sum(component_weight * similarity for enabled P/S/R/H) / D
inferred_score = sum(component_weight * similarity * 0.6 for enabled I) / D
result = 100 * (sourced_score + inferred_score)
documented_share = 100 * sum(component_weight for enabled P/S/R/H) / D
```

Skipped and replaced questions do not contribute. Unanswered questions do not contribute. Remaining unknown party components stay in the denominator; two complete sourced matches and eight unknowns still give 20% at equal importance. No missing position is filled by the user's own answer, another party's answer, religion, ethnicity or coalition membership alone. Each party has an independent score; the best result is not normalized to 100%.

The result cards separate sourced and inferred contributions. Their documented percentage excludes all inferences. Total similarity can therefore exceed documented coverage, but cannot exceed documented coverage plus the discounted inferred component weight. With estimates off, it cannot exceed documented coverage. Sort by total similarity, then documented coverage, then total supported component weight and party ID.

The coefficient 0.6 and the graded matrices are editorial conventions, not statistically calibrated confidence measures. Historical sources and secondary-source dates remain visible. A report of one lawmaker's view is not automatically generalized to every party or every issue. Policy gaps and intra-party disagreements still require research.

## Source coverage and limitations

The [Status of Women review](women-review.md) documents the two added questions and their evidence, including the distinction between exclusion and quotas. The source-linked key is [compass-data.json](compass-data.json); [party-positions.csv](party-positions.csv) exports coarse values and inference metadata. [research-expansion.json](research-expansion.json) contains the earlier additional source review, with [a readable review table](research-expansion.md). The latest [targeted coverage review](coverage-review.md), including Arabic-language sources, records additions, replacements and withdrawn mappings from [coverage-review.json](coverage-review.json). [source-gaps.md](source-gaps.md) lists sourced components, inferences and remaining gaps separately. The [Yashar programme review](yashar-review.md) records the initial official-programme mapping across all 20 questions.

This expansion draws on Israel Democracy Institute party profiles, Times of Israel reporting, Associated Press coverage, and historical Ynet reports. Sources document particular policy components rather than entire answer packages. Dated profiles and secondary reports are not substitutes for a comprehensive current manifesto. The earlier source investigation remains in [the archive](archive/agreement-scale-v1/compass-research.md); its old scoring rules are superseded.

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
(root/'compass-research.md').write_text(''.join(lines).replace('\n  \n', '\n\n'))
print('Updated research report, evidence coverage and source review.')

component_count = sum(len(q['dimensions']) for q in data['questions'])
gaps = [f"# Источники и оставшиеся пробелы\n\nЧисло компонентов на партию: {component_count}. Это число заполненных компонентов, а не процент совпадения. Предположения приведены отдельно и не считаются документированными позициями. Архив может занимать тот же компонент, что и предположение.\n\n| Партия | Источники P/S/R | Предположения I | Архив H | Без источника и оценки |\n|---|---:|---:|---:|---:|\n"]
for party in data['parties']:
    components = [c for row in data['positions'] if row['party_id']==party['id'] for c in row['dimensions'].values()]
    sourced = sum(c['status'] in ['P','S','R'] for c in components)
    inferred = sum(c['status']=='I' or bool(c.get('inference')) for c in components)
    archived = sum(c['status']=='H' for c in components)
    gaps.append(f"| {party['ru']} | {sourced} | {inferred} | {archived} | {component_count-sourced-inferred} |\n")
gaps.append("\nПоследний столбец относится к режиму без архивов. Вторичные источники и оценки включены по умолчанию; оценки можно отключить. Значение оценки основано только на указанном принципе или действии партии, а не на предполагаемой позиции по всему вопросу.\n\nНужны прямые и актуальные материалы по конкретным вопросам, особенно для Ликуда, Оцма Йехудит, ТААЛ и Религиозного сионизма. Присылайте ссылку, партию, тему и дату. [Новая категория: положение женщины](women-review.md), [проверка арабских источников](coverage-review.md), [обоснования предыдущих дополнений](research-expansion.md), [компоненты](party-positions.csv), [вопросы](issues.html?lang=ru).\n")
(root/'source-gaps.md').write_text(''.join(gaps))
expansion = json.loads((root/'research-expansion.json').read_text())
review = ["# Дополнительные источники и выводы\n\nПроверено: 2026-09-29. R — вторичное описание позиции; H — исторический материал; I — редакционное предположение с коэффициентом 0,6, а не измеренной вероятностью. Записи, подтверждающие уже имеющуюся позицию, не дают дополнительных баллов.\n\n"]
review.append('Последующая [проверка охвата](coverage-review.md) заменяет часть приведённых ниже первоначальных записей. Актуальные позиции находятся в compass-data.json.\n\n')
for party in data['parties']:
    entries = [e for e in expansion['positions'] if e['party_id']==party['id']]
    if not entries: continue
    review.append(f"## {party['ru']}\n\n")
    for e in entries:
        rationale = e.get('rationale_localized',{}).get('ru',e['rationale'])
        values = e.get('value') or ' / '.join(e.get('values',[]))
        links = ', '.join(f"[{sid}]({data['sources'][sid]['url']})" for sid in e['source_ids'])
        review.append(f"- **{e['question_id']} · {e['dimension_id']} · {e['status']} · {values}** — {rationale} {links}\n")
    review.append('\n')
(root/'research-expansion.md').write_text(''.join(review))

targeted = json.loads((root/'coverage-review.json').read_text())
report = [f"# Targeted party-coverage review\n\nReviewed: {targeted['checked_at']}. Arabic-language research covers Hadash, Balad, Ta’al and Ra’am. Other additions focus on parties with sparse evidence. This report covers the original Q1–Q20 only; the subsequent [women’s-status additions](women-review.md) are separate. Counts below refer to documented policy components out of 40, **not match percentages**. Inferences are shown separately and discounted to 60%.\n\n"]
report.append('| Party | Documented before | Documented now | Inferences before | Inferences now |\n|---|---:|---:|---:|---:|\n')
for party in data['parties']:
    components = [c for row in data['positions'] if row['party_id']==party['id'] and row['question_id'] not in ['Q21','Q22'] for c in row['dimensions'].values()]
    sourced = sum(c['status'] in ['P','S','R'] for c in components)
    inferred = sum(c['status']=='I' or bool(c.get('inference')) for c in components)
    before = targeted['baseline'][party['id']]
    if (sourced, inferred) != (before['documented'], before['inferred']):
        report.append(f"| {party['en']} | {before['documented']} | {sourced} | {before['inferred']} | {inferred} |\n")
report.append('\n## Mappings and sources\n\nP = official policy; S = attributable statement; H = historical evidence, disabled by default. Nested I entries are separately labelled continuity assumptions. Replaced evidence is retained as `previous_evidence` in the generated dataset; it does not earn extra credit.\n\n')
for party in data['parties']:
    entries = [e for e in targeted['positions'] if e['party_id']==party['id']]
    if not entries: continue
    report.append(f"### {party['en']}\n\n")
    for entry in entries:
        values = entry.get('value') or ' / '.join(entry['values'])
        links = ', '.join(f"[{sid}]({data['sources'][sid]['url']})" for sid in entry['source_ids'])
        report.append(f"- **{entry['question_id']} · {entry['dimension_id']} · {entry['status']} · {values}** — {entry['rationale']} {links}\n")
        if entry.get('inference'):
            report.append(f"  Continuity inference (I, 0.6): {entry['inference']['rationale']}\n")
    report.append('\n')
report.append('## Withdrawn mappings\n\nThese details now remain unknown. Original records and removal reasons are preserved in `withdrawn_evidence`; opposition to annexation remains scored.\n\n')
for entry in targeted.get('withdrawn_mappings', []):
    report.append(f"- **{entry['party_id']} · {entry['question_id']} · {entry['dimension_id']}** — {entry['reason']}\n")
report.append('\n## Limits and unresolved questions\n\n')
report.extend(f"- {note}\n" for note in targeted['limitations'])
report.append('\n## Sources reviewed\n\n| Source | Date | Language | Retrieval and attribution notes |\n|---|---|---|---|\n')
for sid, source in targeted['sources'].items():
    report.append(f"| [{source['title']}]({source['url']}) ({sid}) | {source.get('date') or 'Undated'} | {source.get('language', 'he')} | {source.get('note','')} |\n")
report.append('\nAuthored records: [coverage-review.json](coverage-review.json). Full current coverage: [source-gaps.md](source-gaps.md). Each new mapping has an explanation in English, Hebrew and Russian in the application.\n')
(root/'coverage-review.md').write_text(''.join(report))


women = json.loads((root/'women-evidence.json').read_text())
women_lines = ["# Status of Women · מעמד האישה · Положение Женщины\n\nReviewed: 2026-09-29. Q21 concerns access to party candidacy and representation mechanisms. Q22 concerns equality policy in work, education and public life, separately from gender-separated provision. Each question has five choices, two scored components, translations and an issue-guide section.\n\nThe short quiz remains ten questions: one from each of six categories, then one more from four random categories. The full quiz contains 22 questions. The question bank now has 44 components per party. Category selection adds no hidden score weight.\n\n"]
women_lines.append('## Evidence and boundaries\n\n')
for party in data['parties']:
    entries = [e for e in women['positions'] if e['party_id']==party['id']]
    if not entries: continue
    women_lines.append(f"### {party['en']}\n\n")
    for entry in entries:
        values = entry.get('value') or ' / '.join(entry['values'])
        links = ', '.join(f"[{sid}]({data['sources'][sid]['url']})" for sid in entry['source_ids'])
        women_lines.append(f"- **{entry['question_id']} · {entry['dimension_id']} · {entry['status']} · {values}** — {entry['rationale']} {links}\n")
        if entry.get('inference'):
            women_lines.append(f"  Discounted continuity estimate (I, 0.6): {entry['inference']['rationale']}\n")
    women_lines.append('\n')
women_lines.append('## Limitations\n\n')
women_lines.extend(f"- {note}\n" for note in women['limitations'])
women_lines.append('\nSources and multilingual rationales: [women-evidence.json](women-evidence.json). Unknown components still earn zero points and remain in the denominator. Historical evidence and inferences retain separate switches.\n')
(root/'women-review.md').write_text(''.join(women_lines))
