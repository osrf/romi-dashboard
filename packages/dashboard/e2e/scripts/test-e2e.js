const concurrently = require('concurrently');
const { execSync } = require('child_process');

if (execSync('docker network ls').toString().includes('romi_dashboard_e2e_network')) {
  execSync('docker network rm romi_dashboard_e2e_network', { stdio: 'inherit' });
}

// create external network for auth container
execSync('docker network create romi_dashboard_e2e_network', { stdio: 'inherit' });
const defaultAuthGatewayIp = execSync(
  "docker network inspect -f '{{range .IPAM.Config}}{{.Gateway}}{{end}}' romi_dashboard_e2e_network",
)
  .toString()
  .trim();
process.env.AUTH_GATEWAY_IP = defaultAuthGatewayIp;

// set REACT_APP_CONFIG
const authConfig = {
  realm: 'master',
  clientId: 'romi-dashboard',
  url: `http://${defaultAuthGatewayIp ? defaultAuthGatewayIp : 'localhost'}:8088/auth`,
};
process.env.REACT_APP_AUTH_CONFIG = JSON.stringify(authConfig);

execSync('cd .. && node ./scripts/setup/get-icons.js', { stdio: 'inherit' });

execSync('npm run build', { stdio: 'inherit' });
// wrap in double quotes to support args with spaces
const wdioArgs = process.argv
  .slice(2)
  .map((arg) => `"${arg}"`)
  .join(' ');

concurrently(
  [
    'cd .. && npm run start:ros2-bridge',
    'cd .. && npm run start:auth',
    'npm:start:react',
    `node scripts/auth-ready.js && wdio ${wdioArgs}`,
  ],
  {
    killOthers: ['success', 'failure'],
    successCondition: 'first',
  },
).catch((e) => {
  console.error(e);
  process.exitCode = -1;
});
