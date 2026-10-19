import test from 'node:test';
import assert from 'node:assert/strict';
import { PhoneCheckQueue, getPhoneRetryAfter, isPhoneCheckResult } from '../components/auth/phoneCheck.ts';

const input = { challenge: 'same-challenge', code: '1234' };
const result = (state) => ({ success: true, state });
const options = () => ({ signal: new AbortController().signal, onRetry() {}, wait: async () => {} });

test('malformed success bodies cannot advance the phone form', () => {
  for (const value of [
    null,
    {},
    { success: true },
    { success: true, state: 'unknown' },
    { success: false, state: 'done' },
  ])
    assert.equal(isPhoneCheckResult(value), false);
  assert.equal(isPhoneCheckResult({ success: true, state: 'code' }), true);
});

test('rate limit countdown uses the server delay only for valid 429 responses', () => {
  assert.equal(getPhoneRetryAfter({ status: 429, data: { retryAfter: 57 } }), 57);
  assert.equal(getPhoneRetryAfter({ status: 429, data: { retryAfter: 1.2 } }), 2);
  for (const failure of [null, {}, { status: 400, data: { retryAfter: 300 } }, { status: 429, data: null }]) {
    assert.equal(getPhoneRetryAfter(failure), null);
  }
  for (const retryAfter of [0, -1, NaN, Infinity, '60', undefined]) {
    assert.equal(getPhoneRetryAfter({ status: 429, data: { retryAfter } }), null);
  }
});

test('a single submission retries transient failures with the same challenge and code', async () => {
  for (const status of [500, 502, 503, 504, 'FETCH_ERROR', 'TIMEOUT_ERROR']) {
    const calls = [];
    const delays = [];
    const response = await new PhoneCheckQueue().submit(
      async (body) => {
        calls.push(body);
        if (calls.length === 1) throw { status };
        return result('processing');
      },
      input,
      {
        ...options(),
        wait: async (ms) => {
          delays.push(ms);
        },
      },
    );
    assert.equal(response.state, 'processing');
    assert.deepEqual(calls, [input, input]);
    assert.deepEqual(delays, [1500]);
  }
});

test('wrong OTP and other permanent errors are returned without retrying', async () => {
  for (const status of [400, 401, 403, 404, 429]) {
    let calls = 0;
    await assert.rejects(
      new PhoneCheckQueue().submit(
        async () => {
          calls++;
          throw { status };
        },
        input,
        options(),
      ),
      (error) => error.status === status,
    );
    assert.equal(calls, 1);
  }
});

test('an outage has a bounded retry budget and releases the queue', async () => {
  const queue = new PhoneCheckQueue();
  let calls = 0;
  const delays = [];
  await assert.rejects(
    queue.submit(
      async () => {
        calls++;
        throw { status: 503 };
      },
      input,
      {
        ...options(),
        wait: async (ms) => {
          delays.push(ms);
        },
      },
    ),
    (error) => error.status === 503,
  );
  assert.equal(calls, 4);
  assert.deepEqual(delays, [1500, 3000, 5000]);
  assert.equal((await queue.poll(async () => result('code'), input)).state, 'code');
});

test('clicking during a poll queues the code instead of discarding the click', async () => {
  const queue = new PhoneCheckQueue();
  const poll = Promise.withResolvers();
  const requests = [];
  queue.poll(() => poll.promise, { challenge: input.challenge });
  const submission = queue.submit(
    async (body) => {
      requests.push(body);
      return result('email');
    },
    input,
    options(),
  );
  assert.equal(requests.length, 0);
  assert.equal(
    queue.poll(async () => result('code'), input),
    null,
  );
  poll.resolve(result('code'));
  assert.equal((await submission).state, 'email');
  assert.deepEqual(requests, [input]);
});

test('completed SIM-PUSH during a poll is reused without submitting an obsolete code', async () => {
  for (const state of ['done', 'email']) {
    const queue = new PhoneCheckQueue();
    const poll = Promise.withResolvers();
    queue.poll(() => poll.promise, { challenge: input.challenge });
    let calls = 0;
    const submission = queue.submit(
      async () => {
        calls++;
        return result('code');
      },
      input,
      options(),
    );
    poll.resolve(result(state));
    assert.equal((await submission).state, state);
    assert.equal(calls, 0);
  }
});

test('polling stays suspended throughout retry backoff', async () => {
  const queue = new PhoneCheckQueue();
  let calls = 0;
  await queue.submit(
    async () => {
      if (++calls === 1) throw { status: 503 };
      return result('done');
    },
    input,
    {
      ...options(),
      wait: async () =>
        assert.equal(
          queue.poll(async () => result('code'), input),
          null,
        ),
    },
  );
  assert.equal(calls, 2);
});

test('closing or resetting the form aborts retries and queued submissions', async () => {
  const controller = new AbortController();
  let calls = 0;
  await assert.rejects(
    new PhoneCheckQueue().submit(
      async () => {
        calls++;
        throw { status: 503 };
      },
      input,
      {
        ...options(),
        signal: controller.signal,
        wait: async () => controller.abort(),
      },
    ),
    { name: 'AbortError' },
  );
  assert.equal(calls, 1);

  const queue = new PhoneCheckQueue();
  const poll = Promise.withResolvers();
  queue.poll(() => poll.promise, input);
  const queued = queue.submit(
    async () => {
      calls++;
      return result('done');
    },
    input,
    { ...options(), signal: controller.signal },
  );
  poll.resolve(result('code'));
  await assert.rejects(queued, { name: 'AbortError' });
  assert.equal(calls, 1);
});

test('email submission is not automatically repeated', async () => {
  let calls = 0;
  await assert.rejects(
    new PhoneCheckQueue().submit(
      async () => {
        calls++;
        throw { status: 503 };
      },
      {
        challenge: input.challenge,
        email: 'test@example.com',
      },
      options(),
    ),
    (error) => error.status === 503,
  );
  assert.equal(calls, 1);
});
