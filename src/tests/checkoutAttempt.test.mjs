import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CheckoutAttempt } from '../components/blocks/Order/model/checkoutAttempt.ts';
test('manual checkout retry reuses identifier, edited order creates a new attempt', () => {
  let count = 0;
  const attempt = new CheckoutAttempt(() => String(++count));
  assert.equal(attempt.forPayload({ addressId: 1, payment: 'card' }), '1');
  assert.equal(attempt.forPayload({ addressId: 1, payment: 'card' }), '1');
  assert.equal(attempt.forPayload({ addressId: 2, payment: 'card' }), '2');
  assert.equal(attempt.forPayload({ addressId: 1, payment: 'card' }), '3');
});
