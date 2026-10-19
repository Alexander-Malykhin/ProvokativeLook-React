import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer as createSocket } from 'node:net';
import { createServer } from 'vite';
import { createSiteBaseQuery } from '../store/api/requestPolicy.ts';

const router = process.env.PHP_FEATURED_TEST_ROUTER;
let php, vite, base, query;
const api = () => ({
  signal: new AbortController().signal,
  abort() {},
  dispatch() {},
  getState: () => ({}),
  endpoint: 'featured-test',
  type: 'query',
});
before(async () => {
  assert.ok(router, 'Set PHP_FEATURED_TEST_ROUTER to Tests/Api/fixtures/FeaturedCatalogServer.php');
  const socket = createSocket();
  await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  base = `http://127.0.0.1:${port}/?route=`;
  php = spawn('php', ['-S', `127.0.0.1:${port}`, router], { stdio: 'ignore' });
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(base + 'catalog')).ok) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  query = createSiteBaseQuery(base);
  vite = await createServer({
    server: { middlewareMode: true },
    define: {
      'import.meta.env.DEV': 'false',
      'import.meta.env.VITE_SITE_API_BASE_URL': JSON.stringify(base),
    },
  });
});
after(async () => {
  await vite?.close();
  php?.kill();
});

test(
  'real React components + RTK endpoint + PHP controller/service/repository + CRM contract',
  { timeout: 30000 },
  async () => {
    const { renderFeatured } = await vite.ssrLoadModule('/src/tests/featuredRender.tsx');
    const result = await renderFeatured();
    assert.equal(result.bestsellers.products.length, 10, 'first request contains only ten products');
    assert.equal(result.news.products.length, 10);
    assert.equal(result.bestsellers.pagination.hasMore, true);
    assert.equal(result.news.pagination.hasMore, true);
    const cards = result.html.match(/<article\b[\s\S]*?<\/article>/g) ?? [];
    assert.equal(
      (result.html.match(/data-carousel-index=/g) ?? []).length,
      20,
      'first paint contains one page per carousel',
    );
    assert.equal(cards.length, 20);
    for (const card of cards) {
      assert.equal((card.match(/<img /g) ?? []).length, 1);
      assert.match(card, /loading="lazy"/);
      assert.equal((card.match(/href="\/catalog\/aksessuary\/tovar-/g) ?? []).length, 2);
      assert.doesNotMatch(card, /В корзину|Цена не указана|₽|1 250|>M</);
    }
    assert.equal((result.html.match(/Перейти к слайду/g) ?? []).length, 14, 'bounded mobile dots');
    assert.ok(result.html.includes('Новинки') && result.html.includes('Бестселлеры'));
  },
);
test('API validates type and retains optional limits without returning inactive or unstocked products', async () => {
  const bad = await query({ url: 'catalog/featured', params: { type: 'unknown' } }, api(), {});
  assert.equal(bad.error.status, 400);
  const limited = await query({ url: 'catalog/featured', params: { type: 'new', limit: 12 } }, api(), {});
  assert.equal(limited.error, undefined);
  assert.equal(limited.data.products.length, 12);
  assert.deepEqual(
    limited.data.products.map((p) => p.id),
    [78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 60, 59],
  );
  assert.ok(limited.data.products.every((p) => p.available && p.image));
});
test('empty news does not substitute old or bestseller products', async () => {
  const { renderFeatured } = await vite.ssrLoadModule('/src/tests/featuredRender.tsx');
  const result = await renderFeatured(true);
  assert.deepEqual(result.news.products, []);
  assert.equal((result.html.match(/data-carousel-index=/g) ?? []).length, 10);
  assert.equal((result.html.match(/<article /g) ?? []).length, 10);
  assert.doesNotMatch(result.html, /Новинки/);
  assert.match(result.html, /Бестселлеры/);
});

test('cursor pages retain every eligible product, deduplicate concurrent fetches and stop at the end', async () => {
  const { loadFeaturedPages } = await vite.ssrLoadModule('/src/tests/featuredRender.tsx');
  const nativeFetch = globalThis.fetch;
  const urls = [];
  globalThis.fetch = async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : (input.url ?? input.toString()));
    if (url.searchParams.get('route') === 'catalog/featured') urls.push(url);
    return nativeFetch(input, init);
  };
  try {
    for (const type of ['new', 'bestsellers']) {
      const data = await loadFeaturedPages(type);
      const ids = data.pages.flatMap((page) => page.products.map((product) => product.id));
      assert.equal(ids.length, type === 'new' ? 71 : 74);
      assert.equal(new Set(ids).size, ids.length);
      assert.deepEqual(
        data.pages.map((page) => page.products.length),
        [10, 10, 10, 10, 10, 10, 10, type === 'new' ? 1 : 4],
      );
      assert.equal(data.pages.at(-1).pagination.hasMore, false);
      const calls = urls.filter((url) => url.searchParams.get('type') === type);
      assert.equal(calls.length, 8, 'rapid repeated requests share the same pending page');
      assert.ok(calls.every((url) => url.searchParams.get('limit') === '10'));
    }
  } finally {
    globalThis.fetch = nativeFetch;
  }
});

test('API rejects broken and cross-type continuation cursors', async () => {
  const first = await query({ url: 'catalog/featured', params: { type: 'new' } }, api(), {});
  assert.equal(first.data.products.length, 10);
  for (const cursor of ['!', 'a'.repeat(513), first.data.pagination.nextCursor]) {
    const result = await query({ url: 'catalog/featured', params: { type: 'bestsellers', cursor } }, api(), {});
    assert.equal(result.error.status, 400);
  }
});

test('failed next page keeps existing cards and retry continues from the same cursor', async () => {
  const { recoverFeaturedPage } = await vite.ssrLoadModule('/src/tests/featuredRender.tsx');
  const result = await recoverFeaturedPage();
  assert.equal(result.failed, true);
  assert.deepEqual(result.retained, result.first);
  assert.equal(result.recovered.pages.length, 2);
  assert.deepEqual(result.recovered.pages[0], result.first.pages[0]);
  assert.deepEqual(
    result.recovered.pages[1].products.map((product) => product.id),
    [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  );
});
