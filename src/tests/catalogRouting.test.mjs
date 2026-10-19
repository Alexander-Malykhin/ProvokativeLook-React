import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveCatalogSectionIds } from '../helpers/catalog.ts';
const sections = [
  { id: 129, code: 'aksessuary', name: 'Аксессуары' },
  { id: 172, code: 'obuv', name: 'Обувь' },
  { id: 140, code: 'kostyumy', name: 'Костюмы' },
];
test('legacy and current category links resolve to the same filtered catalogue', () => {
  assert.deepEqual(resolveCatalogSectionIds('accessories', sections), [129]);
  assert.deepEqual(resolveCatalogSectionIds('aksessuary', sections), [129]);
  assert.deepEqual(resolveCatalogSectionIds('shoes', sections), [172]);
  assert.deepEqual(resolveCatalogSectionIds('costumes', sections), [140]);
});
test('unknown category never silently displays all products', () => {
  assert.equal(resolveCatalogSectionIds('does-not-exist', sections), null);
  assert.equal(resolveCatalogSectionIds('shoes', []), null);
  assert.deepEqual(resolveCatalogSectionIds('all', sections), []);
});
