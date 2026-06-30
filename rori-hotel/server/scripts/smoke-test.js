const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:5000';
const email = process.env.SMOKE_LOGIN_EMAIL;
const password = process.env.SMOKE_LOGIN_PASSWORD;

const check = async (name, run) => {
  try {
    await run();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}: ${error.message}`);
    process.exitCode = 1;
  }
};

const expectStatus = async (name, url, options, expectedStatus) => {
  await check(name, async () => {
    const response = await fetch(url, options);
    if (response.status !== expectedStatus) {
      throw new Error(`expected ${expectedStatus}, received ${response.status}`);
    }
  });
};

(async () => {
  await expectStatus('health endpoint', `${baseUrl}/health`, {}, 200);
  await expectStatus('protected route rejects anonymous request', `${baseUrl}/api/notifications`, {}, 401);

  if (email && password) {
    await expectStatus(
      'configured login succeeds',
      `${baseUrl}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      },
      200
    );
  } else {
    console.log('SKIP configured login succeeds: SMOKE_LOGIN_EMAIL and SMOKE_LOGIN_PASSWORD are not set');
  }

  await expectStatus(
    'bad login fails',
    `${baseUrl}/api/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'missing@example.com', password: 'wrong-password' })
    },
    401
  );
})();
