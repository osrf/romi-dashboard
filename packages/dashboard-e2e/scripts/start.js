process.env.E2E_NO_DASHBOARD = 'true';

const { services } = require('./config');
const concurrently = require('concurrently');

concurrently(
  [
    ...services,
    `npm --prefix ../dashboard run start:react`,
    `npm --prefix ../dashboard run start:rmf`,
  ],
  {
    killOthers: ['success', 'failure'],
  },
);
