/**
 * pipenv has a bug? where you get ".project" file not found when running with "--site-packages"
 * multiple times, it also cleans up the existing venv, removing the .gitignore file.
 */
const fs = require('fs');
const { execSync } = require('child_process');

try {
  fs.accessSync(`${__dirname}/../.venv/lib`);
  execSync('python3 -m pipenv install -d', { stdio: 'inherit' });
} catch (e) {
  execSync('python3 -m pipenv install -d --site-packages', { stdio: 'inherit' });
}
