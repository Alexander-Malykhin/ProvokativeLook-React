import test from 'node:test';
import assert from 'node:assert/strict';

const baseUrl = (
  process.env.SITE_API_BASE_URL ?? 'https://24.provokativelook.ru/local/api/site/index.php?route='
).replace(/\s+$/, '');
const authCookie = process.env.SITE_AUTH_COOKIE ?? '';
const serverTestsEnabled = process.env.RUN_SERVER_TESTS === '1';
const writeTestsEnabled = process.env.RUN_WRITE_TESTS === '1';

const request = async (route, options = {}) => {
  const headers = new Headers(options.headers ?? {});
  if (authCookie) headers.set('Cookie', authCookie);
  const response = await fetch(`${baseUrl}${route}`, { ...options, headers });
  const text = await response.text();
  let body = null;
  if (text.trim()) body = JSON.parse(text);
  return { response, body };
};

test('reviews status returns forum state', { skip: !serverTestsEnabled }, async () => {
  const { response, body } = await request('reviews/status');
  assert.equal(response.status, 200);
  assert.equal(typeof body.forumModule, 'boolean');
  assert.equal(typeof body.canCreate, 'boolean');
});

test('reviews list returns items', { skip: !serverTestsEnabled }, async () => {
  const { response, body } = await request('reviews');
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(body.items));
  assert.equal(typeof body.canCreate, 'boolean');
});

test('review creation without authorization is rejected', { skip: !serverTestsEnabled }, async () => {
  const response = await fetch(`${baseUrl}reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Тестовый отзыв без авторизации' }),
  });
  const body = await response.json();
  assert.equal(response.status, 401);
  assert.equal(body.error, 'AUTH_REQUIRED');
});

test(
  'authorized user can create a review',
  { skip: !serverTestsEnabled || !authCookie || !writeTestsEnabled },
  async () => {
    const text = `Тест запроса ${Date.now()}`;
    const { response, body } = await request('reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    assert.equal(response.status, 201);
    assert.equal(body.success, true);
    assert.equal(body.review.text, text);
    assert.equal(typeof body.review.id, 'number');
  },
);
