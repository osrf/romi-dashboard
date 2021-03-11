const jsonSchemaToTs = require('json-schema-to-typescript');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('generate schemas:');
execSync(`python3 -m pipenv run python ${__dirname}/generate-schemas.py`, { stdio: 'inherit' });

const schemas = [
  'build/schema/door-health.json',
  'build/schema/door-state.json',
  'build/schema/door.json',
];

const modelsDir = path.join(__dirname, 'lib', 'models', 'generated');
fs.rmdirSync(modelsDir, { recursive: true, force: true });
fs.mkdirSync(modelsDir, { recursive: true });

console.log('generate models:');
(async () => {
  for (const f of schemas) {
    const ts = await jsonSchemaToTs.compileFromFile(f);
    const baseName = path.basename(f);
    const tsFileName = `${baseName.slice(0, baseName.lastIndexOf('.'))}.ts`;
    const tsFilePath = path.join(modelsDir, tsFileName);
    fs.writeFileSync(tsFilePath, ts);
    console.log(tsFilePath);
  }
  fs.writeFileSync(path.join(modelsDir, 'GENERATED'), 'THIS DIRECTORY IS GENERATED, DO NOT EDIT!!');
})();
