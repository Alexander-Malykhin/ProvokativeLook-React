import test from 'node:test';
import assert from 'node:assert/strict';
const enabled = process.env.RUN_API_SMOKE === '1';
const base = process.env.SITE_API_BASE_URL ?? 'https://24.provokativelook.ru/local/api/site/index.php?route=';
const cases = {
  user: 401,
  settings: 200,
  navigation: 200,
  home: 200,
  about: 200,
  contacts: 200,
  categories: 200,
  miniBanners: 200,
  mainBanners: 200,
  banners1x2: 200,
  banners1x3: 200,
  'delivery-payment-pages': 200,
  reviews: 200,
  'reviews/status': 200,
  catalog: 200,
  'catalog/products': 200,
  'catalog/featured': 200,
  cart: 200,
  favorites: 200,
  'recently-viewed': 200,
  orders: 401,
  addresses: 401,
  notifications: 401,
};
for (const [route, status] of Object.entries(cases))
  test('guest GET ' + route, { skip: !enabled, timeout: 25000 }, async () => {
    const start = Date.now();
    const response = await fetch(base + route, {
      headers: { Origin: 'http://localhost:5173' },
      signal: AbortSignal.timeout(20000),
    });
    const body = await response.text();
    assert.equal(response.status, status, 'unexpected HTTP status for ' + route);
    assert.match(response.headers.get('content-type') ?? '', /application\/json/);
    assert.doesNotThrow(() => JSON.parse(body), 'response must be complete JSON');
    console.log(`${route}: HTTP ${response.status}, ${Date.now() - start} ms`);
  });
