const http = require('http');
const https = require('https');

async function request(url, options, body) {
  options = {
    rejectUnauthorized: false,
    ...options,
  };

  const headers = {};
  if (typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
  }
  options.headers = {
    ...headers,
    ...options.headers,
  };

  const p = new Promise((res, rej) => {
    const req = https.request(url, options, (resp) => {
      resp.body = '';
      resp.on('end', () => {
        if (resp.statusCode < 200 || resp.statusCode >= 300) {
          rej(resp);
        }
        res(resp);
      });
      resp.on('data', (data) => (resp.body += data.toString()));
    });
    if (body) {
      if (typeof body === 'object') {
        req.write(JSON.stringify(body));
      } else {
        req.write(body);
      }
    }
    req.end();
  });
  return p;
}

async function tryRequest(url, options, body) {
  try {
    return await request(url, options, body);
  } catch (e) {
    if (e instanceof http.IncomingMessage) {
      console.error(e.body);
    } else {
      throw e;
    }
  }
}

async function post(url, data) {
  const postData = new URLSearchParams(data);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  return request(url, options, postData.toString());
}

const baseUrl = 'https://ntu.demo.open-rmf.org/auth';
const masterTokenUrl = `${baseUrl}/realms/master/protocol/openid-connect/token`;
const user = 'admin';
const password = 'admin';

async function getToken() {
  const resp = await post(masterTokenUrl, {
    username: user,
    password: password,
    grant_type: 'password',
    client_id: 'admin-cli',
  });
  return JSON.parse(resp.body).access_token;
}

module.exports = {
  request,
  tryRequest,
  post,
  getToken,
  baseUrl,
};
