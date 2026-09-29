"""Rebuild, check, and package the static GitHub Pages site using local tools."""
import shutil
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
for script in ('recode_multichoice.py', 'write_research.py', 'build_preview.py'):
    subprocess.run([sys.executable, str(root / 'scripts' / script)], cwd=root, check=True)
for script in sorted((root / 'web').glob('*.js')):
    subprocess.run(['node', '--check', str(script)], cwd=root, check=True)
subprocess.run(['node', 'tests/scoring.test.cjs'], cwd=root, check=True)

output = root / '_site'
if output.exists():
    shutil.rmtree(output)
output.mkdir()
for name in ('index.html', 'issues.html'):
    shutil.copyfile(root / name, output / name)
(output / '.nojekyll').touch()
print('GitHub Pages artifact ready in _site/.')
