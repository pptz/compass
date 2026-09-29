"""Build a self-contained preview that also works when opened directly from disk."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
template = (root / 'web/index.template.html').read_text()
data = json.dumps(json.loads((root / 'compass-data.json').read_text()), ensure_ascii=False)
parts = {
    'STYLES': (root / 'web/styles.css').read_text() + '\n' + (root / 'web/policy-choices.css').read_text(),
    'DATA': data.replace('<', '\\u003c'),
    'SCORING': (root / 'web/scoring.js').read_text(),
    'APP': (root / 'web/language.js').read_text() + '\n' + (root / 'web/app.js').read_text(),
}
for key, value in parts.items():
    template = template.replace('/* ' + key + ' */', value)
(root / 'index.html').write_text(template)
guide = (root / 'web/issues.template.html').read_text()
guide_data = {'questions': json.loads((root / 'compass-data.json').read_text())['questions']}
for key, value in {'STYLES':parts['STYLES'], 'DATA':json.dumps(guide_data,ensure_ascii=False).replace('<','\\u003c'), 'ISSUES_APP':(root/'web/language.js').read_text()+'\n'+(root/'web/issues.js').read_text()}.items():
    guide = guide.replace('/* '+key+' */',value)
(root/'issues.html').write_text(guide)
print('Built index.html and issues.html — both also work directly from disk.')
