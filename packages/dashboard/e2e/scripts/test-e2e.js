const concurrently = require('concurrently');
const { execSync } = require('child_process');

function dockert(cmd) {
  return `${__dirname}/../../scripts/dockert ${cmd}`;
}

// only create rmf-web network if it doesn't exist, `rmf-web_default` is the default network
// used  by docker-compose.
if (!execSync(dockert("docker network ls -f=name='^rmf-web_default$'").toString())) {
  execSync(dockert('docker network create rmf-web_default', { stdio: 'inherit' }));
  console.log('created new docker "rmf-web_default"');
}

const gatewayIp = execSync(
  dockert("docker network inspect -f='{{(index .IPAM.Config 0).Gateway}}' rmf-web_default"),
)
  .toString()
  .trim();

const authConfig = {
  realm: 'master',
  clientId: 'romi-dashboard',
  url: `http://${gatewayIp}:8088/auth`,
};

process.env.REACT_APP_TRAJECTORY_SERVER = 'ws://localhost:8006';
process.env.REACT_APP_ROS2_BRIDGE_SERVER = 'ws://localhost:50002';
process.env.REACT_APP_AUTH_CONFIG = JSON.stringify(authConfig);
process.env.ROMI_DASHBOARD_PORT = '5000';

execSync('WORLD_NAME=office node scripts/get-resources-location.js', { stdio: 'inherit' });
execSync('cd .. && node ./scripts/setup/get-icons.js', { stdio: 'inherit' });
execSync('npm --prefix .. run build', { stdio: 'inherit' });

// wrap in double quotes to support args with spaces
const wdioArgs = process.argv
  .slice(2)
  .map((arg) => `"${arg}"`)
  .join(' ');

concurrently(
  [
    'npm --prefix .. run start:ros2-bridge',
    'npm --prefix .. run start:keycloak',
    'serve -c ../e2e/serve.json ../build',
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
