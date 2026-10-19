import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createSiteBaseQuery } from '../store/api/requestPolicy.ts';

const router = process.env.PHP_TEST_ROUTER;
let server, base, query;
const cookies = new Map();
const api = () => ({
  signal: new AbortController().signal,
  abort() {},
  dispatch() {},
  getState: () => ({}),
  endpoint: 'passwordReset',
  type: 'mutation',
});
const call = (route, body) => query({ url: route, ...(body === undefined ? {} : { method: 'POST', body }) }, api(), {});
before(async () => {
  if (!router) return;
  const socket = createServer();
  await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  base = `http://127.0.0.1:${port}/?route=`;
  server = spawn('php', ['-S', `127.0.0.1:${port}`, router], { stdio: 'ignore' });
  query = createSiteBaseQuery(
    base,
    fetchBaseQuery({
      fetchFn: async (request) => {
        const headers = new Headers(request.headers);
        headers.set('Cookie', [...cookies].map(([k, v]) => `${k}=${v}`).join('; '));
        const response = await fetch(new Request(request, { headers }));
        for (const cookie of response.headers.getSetCookie()) {
          const [key, ...value] = cookie.split(';')[0].split('=');
          cookies.set(key, value.join('='));
        }
        return response;
      },
    }),
  );
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(base + '__test/health')).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error('PHP fixture did not start');
});
after(() => server?.kill());

const email = 'recovery@example.com';
const password = 'NewPass!123';
const confirm = (code) => call('auth/password/confirm', { email, code, password, confirmPassword: password });
async function setup(emailAccount = false) {
  await call('__test/reset', {});
  await call('__test/password-account', { emailAccount });
}
test(
  'password recovery through frontend transport and real PHP controller/mail service',
  { skip: !router },
  async (t) => {
    await t.test('phone-registered account receives an email code and can log in with the new password', async () => {
      await setup();
      assert.equal((await call('auth/password/request', { email: ' RECOVERY@EXAMPLE.COM ' })).data.success, true);
      const mail = (await call('__test/mail')).data;
      assert.match(mail.code ?? '', /^\d{6}$/);
      assert.equal(mail.to, email);
      assert.equal((await confirm('000000')).error.status, 400);
      assert.equal((await confirm(mail.code)).data.success, true);
      assert.equal((await confirm(mail.code)).error.status, 400);
      assert.equal((await call('auth/login', { email, password: 'OldPass!123' })).error.status, 401);
      assert.equal((await call('auth/login', { email, password })).data.userId, 7);
    });
    await t.test('email-registered account is still supported; expired codes cannot change its password', async () => {
      await setup(true);
      assert.equal((await call('auth/password/request', { email })).data.success, true);
      const code = (await call('__test/mail')).data.code;
      await call('__test/expire-code', {});
      assert.equal((await confirm(code)).error.status, 400);
      assert.equal((await call('auth/login', { email, password: 'OldPass!123' })).data.userId, 7);
    });
    await t.test(
      'mail failures never report success; retry works and failed resend retains the previous code',
      async () => {
        await setup();
        await call('auth/password/request', { email });
        const code = (await call('__test/mail')).data.code;
        for (const mailResult of ['F', 'N', '0', 'P', false]) {
          await call('__test/fault', { mailResult });
          assert.equal((await call('auth/password/request', { email })).error?.status, 503);
        }
        await call('__test/fault', {});
        assert.equal((await confirm(code)).data.success, true);
        assert.equal((await call('auth/password/request', { email })).data.success, true);
        assert.match((await call('__test/mail')).data.code, /^\d{6}$/);
      },
    );
    await t.test(
      'failed code persistence does not send unusable mail, and failed password update can be retried',
      async () => {
        await setup();
        await call('__test/fault', { failUserUpdate: true });
        assert.equal((await call('auth/password/request', { email })).error?.status, 503);
        assert.equal((await call('__test/mail')).data.attempts, 0);
        await call('__test/fault', {});
        await call('auth/password/request', { email });
        const code = (await call('__test/mail')).data.code;
        await call('__test/fault', { failUserUpdate: true });
        assert.equal((await confirm(code)).error.status, 500);
        await call('__test/fault', {});
        assert.equal((await confirm(code)).data.success, true);
      },
    );
    await t.test('unknown address does not disclose whether an account exists or send mail', async () => {
      await setup();
      const unknown = await call('auth/password/request', { email: 'missing@example.com' });
      assert.equal(unknown.data.success, true);
      assert.equal((await call('__test/mail')).data.attempts, 0);
      const known = await call('auth/password/request', { email });
      assert.equal(unknown.data.message, known.data.message);
    });
  },
);
