"""Recode sources and separately labeled inferences into policy components.

Archived agreement numbers never imply an entire answer package. New inference
records require a cited premise and retain their distinct evidence status.
"""
import csv
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
old = json.loads((root / 'archive/agreement-scale-v1/compass-data.json').read_text())
questions = json.loads((root / 'questions.json').read_text())
ru = json.loads((root / 'locales/ru.json').read_text())
rules = json.loads((root / 'similarity-rules.json').read_text())
help_text = json.loads((root / 'topic-help.json').read_text())
discussion = json.loads((root / 'topic-discussion.json').read_text())
for question in questions:
    translation = ru['questions'][question['id']]
    question['ru'] = translation['ru']
    question['note_ru'] = translation['note_ru']
    question['help'] = help_text[question['id']]
    question['help']['discussion'] = discussion[question['id']]
    for option in question['options']:
        option['ru'] = translation['options'][option['id']]
    for dimension in question['dimensions']:
        local = translation['dimensions'][dimension['id']]
        dimension['ru'] = local['ru']
        for value in dimension['values']:
            value['ru'] = local['values'][value['id']]
        dimension['similarity'] = rules['dimensions'][question['id']+'.'+dimension['id']]
lookup = {(p['party_id'], p['question_id']): p for p in old['positions']}
positions = []
for party in old['parties']:
    for q in questions:
        previous = lookup.get((party['id'], q['id']), {'value': None})
        row = dict(party_id=party['id'], question_id=q['id'], dimensions={},
                   checked_at='2026-09-29', review_state='editorial_draft')
        value = previous['value']
        component = None
        mapping = {
            'Q1': ('statehood', {2: 'yes', -2: 'no'}),
            'Q3': ('ordinary_override', {2: 'yes', -2: 'no'}),
            'Q4': ('equality', {2: 'constitutional'}),
            'Q5': ('civil_route', {2: 'marriage', 1: 'registration', -2: 'none'}),
            'Q6': ('service', {-2: 'none'}),
            'Q7': ('services', {2: 'expand', -2: 'reduce'}),
            'Q8': ('imports', {2: 'open'}),
            'Q9': ('core_condition', {2: 'yes', -2: 'no'}),
            'Q10': ('security_role', {2: 'yes'}),
            'Q11': ('unilateral_sovereignty', {2: 'yes', -2: 'no'}),
            'Q12': ('settlements', {2: 'yes', -2: 'no'}),
            'Q13': ('statutory', {2: 'yes'}),
            'Q14': ('binding_limit', {2: 'yes'}),
            'Q15': ('parent_status', {2: 'yes'}),
            'Q16': ('funding_model', {2: 'voucher'}),
            'Q17': ('public_stock', {2: 'yes'}),
            'Q18': ('bargaining', {2: 'collective'}),
            'Q19': ('compulsory', {2: 'yes', -2: 'no'}),
            'Q20': ('binding_targets', {2: 'yes'}),
        }

        def add(dimension, val, rationale=None, source=None):
            row['dimensions'][dimension] = {
                'value': val, 'status': previous['status'],
                'source_ids': source or previous['source_ids'],
                'rationale': rationale or previous['rationale'],
                'review_state': 'editorial_draft',
                'provenance': 'Component-level recoding of cited research; other components not inferred.'
            }

        if q['id'] in mapping:
            dimension, values = mapping[q['id']]
            if value in values:
                add(dimension, values[value])
        if q['id'] == 'Q2' and value is not None:
            add('obligation', 'universal' if value == 2 else 'voluntary' if party['id'] == 'zehut' else 'sector_exemption')
            if party['id'] == 'democrats':
                add('pathway', 'military_priority', 'The program prioritizes army needs, with civilian pathways for others.')
        if q['id'] == 'Q6' and value == 2:
            add('authority', 'local', 'The cited proposal assigns the decision on Shabbat transport to local authorities.')
            if party['id'] == 'democrats':
                add('service', 'limited', 'The agenda explicitly describes limited Shabbat service. Local authority alone does not establish the scale of service.')
        if q['id'] == 'Q8' and value == 2 and party['id'] in ['yashar', 'beyahad', 'beytenu', 'zehut']:
            add('consumer_tool', 'competition', 'Import reform is explicitly framed as a competition policy.')
        if q['id'] == 'Q9' and party['id'] == 'democrats':
            add('school_model', 'state', 'The agenda specifies a single publicly funded state framework.')
        if q['id'] == 'Q9' and party['id'] == 'zehut':
            add('school_model', 'voucher', 'The same program proposes parent-directed education vouchers.')
        if q['id'] == 'Q11' and party['id'] == 'zehut':
            add('territorial_route', 'all', 'The proposal explicitly covers the whole territory.')
        if q['id'] == 'Q13' and value == 2:
            add('appointment', 'judicial', 'The cited commitment is to a state commission, matching the court-president appointment route in the reviewed question.')
        if q['id'] == 'Q14' and party['id'] in ['yashar', 'beytenu']:
            add('mechanism', 'terms', 'The stated limit is two terms.')
        if q['id'] == 'Q14' and party['id'] in ['beyahad', 'blue_white']:
            add('mechanism', 'years', 'The stated limit is eight years.')
        if q['id'] == 'Q20' and party['id'] == 'beyahad':
            add('climate_tool', 'sector_budgets', 'The environment plan includes funded sectoral implementation.')
        positions.append(row)

# This new component was read directly from the public compass during the
# format review. It says nothing by itself about an ordinary-majority override.
next(p for p in positions if p['party_id'] == 'zehut' and p['question_id'] == 'Q3')['dimensions']['appointments'] = {
    'value': 'direct', 'status': 'P', 'source_ids': ['ZC'],
    'rationale': 'The public compass explicitly proposes direct public election of Supreme Court judges for fixed terms.',
    'review_state': 'editorial_draft', 'provenance': 'Public compass reviewed on 2026-09-29.'
}

data = {k: old[k] for k in ['parties', 'sources', 'status_legend']}
additions = json.loads((root/'evidence-additions.json').read_text())
data['sources'].update(additions['sources'])
data['sources']['RD']['note'] = 'Official index retrieved directly on 2026-09-29. It links dated 2021–22 platform PDFs; those are labeled historical.'
for entry in additions['positions']:
    target = next(p for p in positions if p['party_id']==entry['party_id'] and p['question_id']==entry['question_id'])
    target['dimensions'][entry['dimension_id']] = {k:v for k,v in entry.items() if k not in ['party_id','question_id','dimension_id']}
expansion = json.loads((root/'research-expansion.json').read_text())
data['sources'].update(expansion['sources'])
for entry in expansion['positions']:
    target = next(p for p in positions if p['party_id']==entry['party_id'] and p['question_id']==entry['question_id'])['dimensions']
    key = entry['dimension_id']
    evidence = {k:v for k,v in entry.items() if k not in ['party_id','question_id','dimension_id']}
    previous = target.get(key)
    if previous and (previous['status'] in ['P', 'S', 'R'] or previous['status']=='H' and evidence['status']=='H'):
        previous.setdefault('additional_evidence', []).append(evidence)
    elif previous and previous['status']=='H' and evidence['status']=='I':
        # Preserve the archive; an explicit inference can be used with archives off.
        previous['inference'] = evidence
    else:
        if previous:
            evidence['previous_evidence'] = previous
        target[key] = evidence
# Explicitly reviewed replacements can supersede earlier mappings, including
# an inference now supported by a direct statement. Retain the audit trail.
coverage_review = json.loads((root/'coverage-review.json').read_text())
data['sources'].update(coverage_review['sources'])
for entry in coverage_review.get('withdrawn_mappings', []):
    row = next(p for p in positions if p['party_id']==entry['party_id'] and p['question_id']==entry['question_id'])
    previous = row['dimensions'].pop(entry['dimension_id'])
    row.setdefault('withdrawn_evidence', []).append({**entry, 'previous_evidence': previous})
for entry in coverage_review['positions']:
    target = next(p for p in positions if p['party_id']==entry['party_id'] and p['question_id']==entry['question_id'])['dimensions']
    key = entry['dimension_id']
    evidence = {k:v for k,v in entry.items() if k not in ['party_id','question_id','dimension_id']}
    if key in target:
        evidence['previous_evidence'] = target[key]
    target[key] = evidence
women_review = json.loads((root/'women-evidence.json').read_text())
data['sources'].update(women_review['sources'])
for entry in women_review['positions']:
    target = next(p for p in positions if p['party_id']==entry['party_id'] and p['question_id']==entry['question_id'])['dimensions']
    target[entry['dimension_id']] = {k:v for k,v in entry.items() if k not in ['party_id','question_id','dimension_id']}
data['status_legend']['R'] = 'Reviewed secondary report or institutional profile; included by default; dates remain visible.'
data['status_legend']['I'] = 'Explicit editorial inference from cited principles or conduct; discounted to 60% and separately switchable.'
for party in data['parties']:
    party['ru'] = ru['parties'][party['id']]
data.update(version='0.5-sourced-estimates', checked_at='2026-09-29', publication_ready=False,
            description='Multilingual policy comparisons with reviewed secondary sources, bounded and discounted inferences, separate documented coverage, and randomized questionnaire runs.',
            questions=questions, positions=positions,
            skipped_choices=[{'id':'__skip','en':"Skip",'he':'דילוג','ru':'Пропустить'},
                             {'id':'__none','en':'None of these fits my view — leave unscored','he':'אף חלופה אינה מתאימה לעמדתי — ללא ניקוד','ru':'Ни один вариант не подходит — не учитывать'}])
(root / 'compass-data.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
with (root / 'party-positions.csv').open('w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['party_id','question_id','dimension_id','value','status','source_ids','inference_values','inference_confidence','inference_source_ids'])
    for row in positions:
        q = next(q for q in questions if q['id'] == row['question_id'])
        for dim in q['dimensions']:
            evidence = row['dimensions'].get(dim['id'], {})
            inference = evidence if evidence.get('status')=='I' else evidence.get('inference', {})
            writer.writerow([row['party_id'], row['question_id'], dim['id'], evidence.get('value','') or '|'.join(evidence.get('values',[])), evidence.get('status','U'), ';'.join(evidence.get('source_ids',[])), inference.get('value','') or '|'.join(inference.get('values',[])), inference.get('confidence',''), ';'.join(inference.get('source_ids',[]))])
print(f"Built {len(questions)} questions, {sum(len(q['options']) for q in questions)} substantive choices, {sum(len(p['dimensions']) for p in positions)} evidenced components.")
