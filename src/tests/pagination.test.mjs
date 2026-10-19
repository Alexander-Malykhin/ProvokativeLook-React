import test from 'node:test';
import assert from 'node:assert/strict';
import { paginationItems } from '../helpers/pagination.ts';

test('catalog pagination stays bounded and retains first, last and current pages', () => {
  for (const total of [1, 5, 6, 26, 500, 10000]) {
    for (const page of [...new Set([1, 2, 3, Math.ceil(total / 2), total - 2, total - 1, total])].filter(
      (p) => p > 0 && p <= total,
    )) {
      const items = paginationItems(page, total);
      const numbers = items.filter((item) => typeof item === 'number');
      assert.ok(items.length <= 5);
      assert.ok(numbers.includes(1) && numbers.includes(total) && numbers.includes(page));
      assert.equal(new Set(numbers).size, numbers.length);
      assert.deepEqual(
        numbers,
        [...numbers].sort((a, b) => a - b),
      );
      assert.ok(numbers.every((number) => number >= 1 && number <= total));
    }
  }
});

test('short catalogs show every page and out-of-range positions clamp safely', () => {
  assert.deepEqual(paginationItems(3, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(paginationItems(0, 26), paginationItems(1, 26));
  assert.deepEqual(paginationItems(40, 26), paginationItems(26, 26));
  assert.deepEqual(paginationItems(1, 0), []);
  assert.deepEqual(paginationItems(1, Infinity), []);
});
