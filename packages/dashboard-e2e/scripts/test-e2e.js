const concurrently = require('concurrently');
const { execSync } = require('child_process');
const { services } = require('./config');

execSync('WORLD_NAME=office node scripts/get-resources-location.js', { stdio: 'inherit' });
execSync('cd ../dashboard && node scripts/setup/get-icons.js', { stdio: 'inherit' });
execSync('npm --prefix ../dashboard run build', { stdio: 'inherit' });

// wrap in double quotes to support args with spaces
const wdioArgs = process.argv
  .slice(2)
  .map((arg) => `"${arg}"`)
  .join(' ');

concurrently([...services, `node scripts/auth-ready.js && wdio ${wdioArgs}`], {
  killOthers: ['success', 'failure'],
  successCondition: 'first',
}).catch((e) => {
  console.error(e);
  process.exitCode = -1;
});
