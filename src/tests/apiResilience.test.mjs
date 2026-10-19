import test from 'node:test';
import assert from 'node:assert/strict';
import { createSiteBaseQuery, parseApiResponse } from '../store/api/requestPolicy.ts';
import { getRequestErrorMessage } from '../store/api/getRequestErrorMessage.ts';
import { createSafeStorage } from '../helpers/browserStorage.ts';

const api = (signal = new AbortController().signal) => ({
  signal,
  abort() {},
  dispatch() {},
  getState() {
    return {};
  },
  extra: undefined,
  endpoint: 'test',
  type: 'query',
});
const noWait = async () => {};

test('reads recover once from network errors, gateway failures and truncated JSON', async () => {
  for (const error of [
    { status: 'FETCH_ERROR', error: 'offline' },
    { status: 'TIMEOUT_ERROR', error: 'timeout' },
    ...[500, 502, 503, 504].map((status) => ({ status, data: {} })),
    { status: 'PARSING_ERROR', originalStatus: 200, error: 'truncated', data: '{' },
  ]) {
    let calls = 0;
    const query = createSiteBaseQuery(
      'https://example.invalid/',
      async () => (++calls === 1 ? { error } : { data: { success: true } }),
      noWait,
    );
    assert.deepEqual((await query('user', api(), {})).data, { success: true });
    assert.equal(calls, 2);
  }
});

test('writes, authorization errors and rate limits never get an automatic transport retry', async () => {
  for (const [method, status] of [
    ['POST', 503],
    ['PUT', 502],
    ['DELETE', 'FETCH_ERROR'],
    ['GET', 401],
    ['GET', 403],
    ['GET', 429],
    ['GET', 404],
  ]) {
    let calls = 0;
    const query = createSiteBaseQuery(
      'https://example.invalid/',
      async () => {
        calls++;
        return { error: { status, data: {} } };
      },
      noWait,
    );
    await query({ url: 'test', method }, api(), {});
    assert.equal(calls, 1);
  }
});

test('permanent outage stops after two reads, and abort cancels backoff', async () => {
  let calls = 0;
  const request = async () => {
    calls++;
    return { error: { status: 503, data: {} } };
  };
  await createSiteBaseQuery('/', request, noWait)('user', api(), {});
  assert.equal(calls, 2);
  const controller = new AbortController();
  calls = 0;
  await createSiteBaseQuery('/', request, async () => controller.abort())('user', api(controller.signal), {});
  assert.equal(calls, 1);
});

test('all requests have a deadline, preserve cookies and respect endpoint overrides', async () => {
  const calls = [];
  const query = createSiteBaseQuery('https://example.invalid/?route=', async (request) => {
    calls.push(request);
    return { data: {} };
  });
  await query('user', api(), {});
  await query({ url: 'orders/create', method: 'POST' }, api(), {});
  await query({ url: 'delivery/quote', method: 'POST', timeout: 120000 }, api(), {});
  assert.deepEqual(
    calls.map((call) => call.timeout),
    [20000, 45000, 120000],
  );
  assert.ok(calls.every((call) => call.credentials === 'include' && call.cache === 'no-store'));
});

test('empty, warning-prefixed and HTML responses cannot masquerade as JSON success', async () => {
  for (const body of ['', '<h1>Bad Gateway</h1>', 'Warning: database failed\n{"success":true}', '{"success":']) {
    await assert.rejects(parseApiResponse(new Response(body)));
  }
  assert.deepEqual(await parseApiResponse(new Response('{"success":true}')), { success: true });
  assert.equal(await parseApiResponse(new Response(null, { status: 204 })), null);
  assert.ok(
    !getRequestErrorMessage({ status: 'PARSING_ERROR', data: '<secret>SQL/password</secret>' }).includes('SQL'),
  );
  assert.ok(!getRequestErrorMessage({ status: 500, data: { error: 'SQL/password' } }).includes('SQL'));
});

test('blocked storage and quota errors preserve navigation state in memory', () => {
  const blocked = createSafeStorage(() => {
    throw new Error('SecurityError');
  });
  blocked.setItem('payment.url', 'https://example.invalid/pay');
  assert.equal(blocked.getItem('payment.url'), 'https://example.invalid/pay');
  blocked.removeItem('payment.url');
  assert.equal(blocked.getItem('payment.url'), null);
  const quota = createSafeStorage(() => ({
    getItem: () => 'old',
    setItem() {
      throw new Error('QuotaExceededError');
    },
    removeItem() {
      throw new Error('blocked');
    },
  }));
  quota.setItem('city', 'new');
  assert.equal(quota.getItem('city'), 'new');
  quota.removeItem('city');
  assert.equal(quota.getItem('city'), null);
});
