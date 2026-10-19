import test from 'node:test';
import assert from 'node:assert/strict';
import { purchasableOffers } from '../store/api/catalog/purchasableOffers.ts';
test('unpriced, unavailable and fractional stock offers cannot be ordered', () => {
  const offers = [
    { id: 1, available: true, quantity: 3, price: 100 },
    { id: 2, available: true, quantity: 3, price: null },
    { id: 3, available: false, quantity: 3, price: 100 },
    { id: 4, available: true, quantity: 0.5, price: 100 },
    { id: 5, available: true, quantity: 3, price: 0 },
  ];
  assert.deepEqual(
    purchasableOffers({ offers }).map((o) => o.id),
    [1],
  );
});
test('simple product needs explicit stock and positive price; a SKU parent cannot be bought', () => {
  const p = {
    id: 100,
    name: 'Test',
    offers: [],
    price: 100,
    currency: 'RUB',
    quantity: 3,
    available: true,
    hasOffers: false,
  };
  assert.equal(purchasableOffers(p)[0].id, 100);
  for (const change of [
    { hasOffers: true },
    { available: false },
    { quantity: 0 },
    { price: null },
    { hasOffers: undefined },
  ])
    assert.deepEqual(purchasableOffers({ ...p, ...change }), []);
});
