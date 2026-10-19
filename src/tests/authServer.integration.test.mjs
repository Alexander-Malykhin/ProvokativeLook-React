import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createSiteBaseQuery } from '../store/api/requestPolicy.ts';
import { PhoneCheckQueue } from '../components/auth/phoneCheck.ts';

const router = process.env.PHP_TEST_ROUTER;
let server, base, query;
const jar = new Map();
const api = () => ({
  signal: new AbortController().signal,
  abort() {},
  dispatch() {},
  getState: () => ({}),
  extra: undefined,
  endpoint: 'integration',
  type: 'query',
});
const cookieFetch = async (request) => {
  const headers = new Headers(request.headers);
  headers.set('Cookie', [...jar].map(([key, value]) => `${key}=${value}`).join('; '));
  const response = await fetch(new Request(request, { headers }));
  for (const cookie of response.headers.getSetCookie()) {
    const [name, ...value] = cookie.split(';')[0].split('=');
    jar.set(name, value.join('='));
  }
  return response;
};
const call = (route, body) =>
  query({ url: route, timeout: 1500, ...(body === undefined ? {} : { method: 'POST', body }) }, api(), {});
before(async () => {
  if (!router) return;
  const socket = createServer();
  await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  base = `http://127.0.0.1:${port}/?route=`;
  server = spawn('php', ['-S', `127.0.0.1:${port}`, router], { stdio: ['ignore', 'ignore', 'ignore'] });
  query = createSiteBaseQuery(base, fetchBaseQuery({ fetchFn: cookieFetch }), async () => {});
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(base + '__test/health')).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error('Local PHP fixture did not start');
});
after(() => server?.kill());

test(
  'frontend API transport + real PHP controllers: gateway recovery, OTP, session failure, retry and logout',
  { skip: !router, timeout: 20000 },
  async () => {
    assert.equal((await call('__test/reset', {})).data.success, true);
    await call('__test/fault', { userFailures: 1 });
    assert.equal((await call('user')).error.status, 401);
    assert.equal((await call('__test/metrics')).data.userRequests, 2);

    const sent = await call('auth/phone/send', { phone: '+79990000000', purpose: 'register' });
    assert.equal(sent.data.state, 'pending');
    const challenge = sent.data.challenge;
    const resumed = await call('auth/phone/send', { phone: '+79990000000', purpose: 'register' });
    assert.equal(resumed.data.challenge, challenge);
    assert.equal(resumed.data.retryAfter, 0);
    const check = async (body) => {
      const response = await call('auth/phone/check', body);
      if (response.error) throw response.error;
      return response.data;
    };
    const queue = new PhoneCheckQueue();
    const verified = await queue.submit(
      check,
      { challenge, code: '1234' },
      { signal: new AbortController().signal, onRetry() {}, wait: async () => {} },
    );
    assert.equal(verified.state, 'email');
    assert.equal(verified.requiresPassword, true);
    assert.equal((await call('auth/phone/check', { challenge, email: 'test@example.com' })).error.status, 400);
    const registration = {
      challenge,
      email: 'test@example.com',
      password: 'TestPass!123',
      confirmPassword: 'TestPass!123',
    };
    await call('__test/fault', { failSession: true });
    assert.equal((await call('auth/phone/check', registration)).error.status, 503);
    assert.equal((await call('auth/phone/check', registration)).data.state, 'done');
    assert.equal((await call('user')).data.user.id, 7);
    assert.equal((await call('auth/phone/check', { challenge, email: 'test@example.com' })).data.state, 'done');
    const metrics = (await call('__test/metrics')).data;
    assert.equal(metrics.sends, 1);
    assert.equal(metrics.verifies, 2);
    assert.equal(metrics.authorizations, 1);
    await call('auth/logout', {});
    assert.equal((await call('user')).error.status, 401);
    assert.equal((await call('auth/phone/check', { challenge })).error.status, 400);
    assert.equal(
      (await call('auth/login', { email: 'test@example.com', password: 'WrongPass!123' })).error.status,
      401,
    );
    assert.equal((await call('auth/login', { email: 'test@example.com', password: 'TestPass!123' })).data.userId, 7);
    await call('auth/logout', {});
    const phoneLogin = (await call('auth/phone/send', { phone: '+79990000000', purpose: 'login' })).data;
    assert.equal(
      (await call('auth/phone/check', { challenge: phoneLogin.challenge, code: '1234' })).data.state,
      'done',
    );
    assert.equal((await call('user')).data.user.id, 7);
  },
);
