import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const base = 'https://24.provokativelook.ru/local/api/site/index.php?route=';
const report = {
  time: new Date().toISOString(),
  pages: [],
  products: 0,
  images: 0,
  brokenImages: [],
  transientImageFailures: [],
  unpriced: [],
  checks: [],
};
async function get(route) {
  const start = Date.now();
  const r = await fetch(base + route, { signal: AbortSignal.timeout(30000) });
  assert.equal(r.status, 200, route);
  const data = await r.json();
  assert.equal(data.success, true, route);
  return { data, ms: Date.now() - start };
}
const products = [];
for (let offset = 0, total = 1; offset < total; offset += 100) {
  const { data, ms } = await get('catalog/products&limit=100&offset=' + offset);
  total = data.pagination.total;
  assert.ok(total < 10000);
  assert.equal(data.products.length, Math.min(100, total - offset));
  for (const p of data.products) {
    assert.equal(p.available, true);
    assert.ok(p.image?.trim());
    assert.ok(p.slug && p.sectionSlug);
    if (!(p.price > 0)) report.unpriced.push({ id: p.id, name: p.name });
  }
  products.push(...data.products);
  report.pages.push({ offset, count: data.products.length, total, ms });
}
assert.equal(new Set(products.map((p) => p.id)).size, products.length, 'duplicate products across pages');
report.products = products.length;
const images = [...new Set(products.map((p) => p.image))];
report.images = images.length;
let cursor = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (cursor < images.length) {
      const url = images[cursor++];
      try {
        const r = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(12000) });
        if (!r.ok || !(r.headers.get('content-type') ?? '').startsWith('image/'))
          report.brokenImages.push({ url, status: r.status });
      } catch (e) {
        report.brokenImages.push({ url, error: e.name });
      }
    }
  }),
);
const item = products[0];
const product = (
  await get(
    'catalog/product&slug=' + encodeURIComponent(item.slug) + '&section=' + encodeURIComponent(item.sectionSlug),
  )
).data;
const firstFailures = report.brokenImages;
report.brokenImages = [];
for (const failure of firstFailures) {
  try {
    const r = await fetch(failure.url, { method: 'HEAD', signal: AbortSignal.timeout(12000) });
    if (r.ok && (r.headers.get('content-type') ?? '').startsWith('image/'))
      report.transientImageFailures.push({ ...failure, retryStatus: r.status });
    else report.brokenImages.push({ ...failure, retryStatus: r.status });
  } catch {
    report.brokenImages.push(failure);
  }
}
assert.equal(product.product.id, item.id);
report.checks.push('product detail matches catalogue');
const search = (await get('catalog/search&q=' + encodeURIComponent(item.name) + '&limit=20')).data;
assert.ok(search.products.some((p) => p.id === item.id));
report.checks.push('search returns matching item');
const empty = (await get('catalog/products&sizes=__nonexistent_test_size__')).data;
assert.equal(empty.products.length, 0);
assert.equal(empty.pagination.total, 0);
report.checks.push('empty filter has zero products and total');
await writeFile('catalog-audit.json', JSON.stringify(report, null, 2));
console.log(
  JSON.stringify({ ...report, unpriced: report.unpriced.length, brokenImages: report.brokenImages.length }, null, 2),
);
assert.equal(report.brokenImages.length, 0, 'unreachable product photos; see catalog-audit.json');
