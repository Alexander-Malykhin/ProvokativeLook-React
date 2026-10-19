import { test } from 'node:test';
import assert from 'node:assert/strict';
import { carouselDotIndexes } from '../helpers/carouselDots.ts';

test('large carousels have bounded navigation, reachable ends and an active indicator', () => {
  for (const count of [2, 7, 8, 74, 451]) {
    for (let active = 0; active < count; active++) {
      const indexes = carouselDotIndexes(count, active, 7);
      assert.ok(indexes.length <= 7);
      assert.equal(indexes[0], 0);
      assert.equal(indexes.at(-1), count - 1);
      assert.ok(indexes.includes(active));
      assert.deepEqual(
        [...new Set(indexes)].sort((a, b) => a - b),
        indexes,
      );
    }
  }
});
test('empty/single carousels have no dots; other carousels retain their previous navigation', () => {
  assert.deepEqual(carouselDotIndexes(0, 0, 7), []);
  assert.deepEqual(carouselDotIndexes(1, 0, 7), []);
  assert.equal(carouselDotIndexes(20, 0).length, 20);
});
