const { baseUrl, getToken, request, tryRequest } = require('./utils');

function authHeaders(token) {
  return { Authorization: `bearer ${token}` };
}

async function setClientScopeToClient(headers, clientId, clientScopeId) {
  // set client with client scope
  await request(
    `${baseUrl}/admin/realms/rmf-web/clients/${clientId}/default-client-scopes/${clientScopeId}`,
    {
      method: 'PUT',
      headers: headers,
    },
  );
}

async function createAudienceClientScope(headers, name, description, audience) {
  // set client with client scope
  return await request(
    `${baseUrl}/admin/realms/rmf-web/client-scopes`,
    {
      method: 'POST',
      headers: headers,
    },
    {
      name: name,
      protocol: 'openid-connect',
      description: description,
      protocolMappers: [
        {
          config: {
            'access.token.claim': 'true',
            'id.token.claim': 'false',
            'included.client.audience': audience,
          },
          name: 'rmf-audience',
          protocol: 'openid-connect',
          protocolMapper: 'oidc-audience-mapper',
        },
      ],
    },
  );
}

(async () => {
  try {
    const token = await getToken();
    let resp;

    // creates the rmf-web realm.
    await tryRequest(
      `${baseUrl}/admin/realms/`,
      {
        method: 'POST',
        headers: authHeaders(token),
      },
      {
        realm: 'rmf-web',
        enabled: true,
      },
    );

    // creates the dashboard client
    await tryRequest(
      `${baseUrl}/admin/realms/rmf-web/clients`,
      {
        method: 'POST',
        headers: authHeaders(token),
      },
      {
        clientId: 'dashboard',
        rootUrl: 'https://ntu.demo.open-rmf.org',
        redirectUris: ['https://ntu.demo.open-rmf.org/*'],
        webOrigins: ['https://ntu.demo.open-rmf.org'],
        publicClient: true,
      },
    );

    await tryRequest(
      `${baseUrl}/admin/realms/rmf-web/clients`,
      {
        method: 'POST',
        headers: authHeaders(token),
      },
      {
        clientId: 'reporting',
        rootUrl: 'https://ntu.demo.open-rmf.org',
        redirectUris: ['https://ntu.demo.open-rmf.org/*'],
        webOrigins: ['https://ntu.demo.open-rmf.org'],
        publicClient: true,
      },
    );

    // create example user
    await tryRequest(
      `${baseUrl}/admin/realms/rmf-web/users`,
      {
        method: 'POST',
        headers: authHeaders(token),
      },
      {
        username: 'example',
        enabled: true,
      },
    );

    // get the newly created user
    resp = await request(`${baseUrl}/admin/realms/rmf-web/users?username=example`, {
      method: 'GET',
      headers: authHeaders(token),
    });
    const user = JSON.parse(resp.body)[0];

    // set the password
    await request(
      `${baseUrl}/admin/realms/rmf-web/users/${user.id}/reset-password`,
      {
        method: 'PUT',
        headers: authHeaders(token),
      },
      {
        value: 'example',
        temporary: false,
      },
    );

    await tryRequest(
      `${baseUrl}/admin/realms/rmf-web/events/config`,
      {
        method: 'PUT',
        headers: authHeaders(token),
      },
      {
        eventsEnabled: true,
        eventsListeners: ['jsonlog_event_listener'],
      },
    );

    // create audience client scope
    await createAudienceClientScope(
      authHeaders(token),
      'dashboard',
      'dashboard scope',
      'dashboard',
    );

    await createAudienceClientScope(
      authHeaders(token),
      'reporting',
      'reporting scope',
      'reporting',
    );

    // get existing clients (dashboard and reporting)
    const clientsRaw = await request(`${baseUrl}/admin/realms/rmf-web/clients`, {
      method: 'GET',
      headers: authHeaders(token),
    });

    const clientArray = JSON.parse(clientsRaw.body);

    const dashboardId = clientArray.filter(function (item) {
      return item.clientId === 'dashboard';
    })[0].id;

    const reportingId = clientArray.filter(function (item) {
      return item.clientId === 'reporting';
    })[0].id;

    // get existing clients (dashboard and reporting)
    const clientsScopeRaw = await request(`${baseUrl}/admin/realms/rmf-web/client-scopes`, {
      method: 'GET',
      headers: authHeaders(token),
    });

    const clientScopesArray = JSON.parse(clientsScopeRaw.body);
    const clientScopeDashboardId = clientScopesArray.filter(function (item) {
      return item.name == 'dashboard';
    })[0].id;

    const clientScopeReportingId = clientScopesArray.filter(function (item) {
      return item.name == 'reporting';
    })[0].id;

    await setClientScopeToClient(authHeaders(token), dashboardId, clientScopeDashboardId);
    await setClientScopeToClient(authHeaders(token), reportingId, clientScopeReportingId);
  } catch (e) {
    process.exitCode = 1;
  }
})();
