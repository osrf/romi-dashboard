process.env.BUILD_PATH = process.env.BUILD_PATH || '../dashboard-e2e/build';
process.env.REACT_APP_AUTH_PROVIDER = process.env.REACT_APP_AUTH_PROVIDER || 'keycloak';
if (process.env.REACT_APP_AUTH_PROVIDER === 'keycloak') {
  process.env.REACT_APP_KEYCLOAK_CONFIG =
    process.env.REACT_APP_KEYCLOAK_CONFIG ||
    JSON.stringify({
      realm: 'master',
      clientId: 'rmf-dashboard',
      url: 'http://localhost:8088/auth',
    });
}
process.env.REACT_APP_TRAJECTORY_SERVER =
  process.env.REACT_APP_TRAJECTORY_SERVER || 'ws://localhost:8006';
process.env.REACT_APP_RMF_SERVER = process.env.REACT_APP_RMF_SERVER || 'http://localhost:8000';
process.env.E2E_USER = process.env.E2E_USER || 'admin';
process.env.E2E_PASSWORD = process.env.E2E_PASSWORD || 'admin';
process.env.E2E_DASHBOARD_URL = process.env.E2E_DASHBOARD_URL || 'http://localhost:5000';

const services = [];
// eslint-disable-next-line no-eval
if (!eval(process.env.E2E_NO_AUTH)) {
  switch (process.env.REACT_APP_AUTH_PROVIDER) {
    case 'keycloak':
      services.push('npm run start:keycloak');
      break;
    default:
      throw new Error('cannot start auth provider');
  }
}
// eslint-disable-next-line no-eval
if (!eval(process.env.E2E_NO_DASHBOARD)) {
  services.push('serve -c ../serve.json build');
}
// eslint-disable-next-line no-eval
if (!eval(process.env.E2E_NO_RMF_SERVER)) {
  services.push('npm run start:rmf-server');
}

module.exports = {
  services,
};
