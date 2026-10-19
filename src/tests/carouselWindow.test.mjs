import { test } from 'node:test';
import assert from 'node:assert/strict';
import { carouselWindow } from '../helpers/carouselWindow.ts';

test('500 products keep visible and nearby cards mounted without mounting the whole catalogue', () => {
  for (const [viewport, step] of [
    [1014, 346],
    [355, 278],
    [1800, 346],
  ]) {
    const count = 500;
    for (let left = 0; left <= count * step - viewport; left += 137) {
      const { start, end } = carouselWindow(count, left, viewport, step);
      assert.ok(start <= Math.floor(left / step));
      assert.ok(end >= Math.min(count, Math.ceil((left + viewport) / step)));
      assert.ok(end - start <= Math.ceil(viewport / step) + 12);
      assert.ok(start >= 0 && end <= count);
    }
  }
});
test('short lists, empty results, first paint and overscroll remain bounded', () => {
  assert.deepEqual(carouselWindow(0, 0, 1000, 346), { start: 0, end: 0 });
  assert.deepEqual(carouselWindow(2, 0, 1000, 346), { start: 0, end: 2 });
  assert.deepEqual(carouselWindow(500, 0, 0, 0), { start: 0, end: 12 });
  assert.equal(carouselWindow(500, 1e8, 355, 278).end, 500);
  assert.equal(carouselWindow(500, -100, 355, 278).start, 0);
});
