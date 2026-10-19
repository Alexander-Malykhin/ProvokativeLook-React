import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { createSiteBaseQuery } from '../store/api/requestPolicy.ts';

const router = process.env.PHP_CATALOG_TEST_ROUTER;
let server, base, query;
const api = () => ({
  signal: new AbortController().signal,
  abort() {},
  dispatch() {},
  getState: () => ({}),
  extra: undefined,
  endpoint: 'catalog-test',
  type: 'query',
});
const read = async (route, params = {}) => {
  const response = await query({ url: route, params, timeout: 2000 }, api(), {});
  assert.equal(response.error, undefined);
  assert.equal(response.data.success, true);
  return response.data;
};
before(async () => {
  if (!router) return;
  const socket = createServer();
  await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  base = `http://127.0.0.1:${port}/?route=`;
  server = spawn('php', ['-S', `127.0.0.1:${port}`, router], { stdio: 'ignore' });
  query = createSiteBaseQuery(base);
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(base + 'catalog')).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error('Local catalog PHP server did not start');
});
after(() => server?.kill());

test(
  'frontend transport + PHP catalogue: visible stock fills pages and counts, search and featured',
  { skip: !router, timeout: 15000 },
  async () => {
    const pages = [];
    for (const offset of [0, 18, 36]) {
      const data = await read('catalog/products', { sectionIds: '129', limit: 18, offset });
      assert.equal(data.pagination.total, 37);
      assert.equal(data.pagination.offset, offset);
      assert.ok(data.products.every((product) => product.available === true && product.image.trim()));
      pages.push(data.products);
    }
    assert.deepEqual(
      pages.map((products) => products.length),
      [18, 18, 1],
    );
    assert.deepEqual(
      pages.flat().map((product) => product.id),
      Array.from({ length: 37 }, (_, i) => i + 25),
    );
    const filtered = await read('catalog/products', { sectionIds: '129', sizes: 'XL' });
    assert.equal(filtered.pagination.total, 0);
    assert.deepEqual(filtered.products, []);
    for (const route of ['catalog/featured', 'catalog/search']) {
      const data = await read(route, { q: 'товар', limit: 5 });
      assert.deepEqual(
        data.products.map((product) => product.id),
        [25, 26, 27, 28, 29],
      );
    }
  },
);
