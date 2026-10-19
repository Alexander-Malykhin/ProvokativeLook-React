import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
const router = process.env.PHP_TEST_ROUTER;
let server, base;
const cookies = new Map();
async function call(route, body) {
  const response = await fetch(base + route, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join('; ') },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(5000),
  });
  for (const c of response.headers.getSetCookie()) {
    const [k, ...v] = c.split(';')[0].split('=');
    cookies.set(k, v.join('='));
  }
  return { status: response.status, data: await response.json() };
}
before(async () => {
  if (!router) return;
  const s = createServer();
  await new Promise((r) => s.listen(0, '127.0.0.1', r));
  const p = s.address().port;
  await new Promise((r) => s.close(r));
  base = `http://127.0.0.1:${p}/?route=`;
  server = spawn('php', ['-S', `127.0.0.1:${p}`, router], { stdio: 'ignore' });
  for (let i = 0; i < 80; i++) {
    try {
      if ((await call('__test/health')).status === 200) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 50));
  }
  throw Error('PHP fixture not ready');
});
after(() => server?.kill());
test(
  'HTTP checkout and cart contracts with real PHP validation and isolated dependencies',
  { skip: !router },
  async (t) => {
    await call('__test/reset', {});
    await t.test('malformed quantity does not remove basket lines', async () => {
      for (const quantity of [null, -1, 1.5, {}, true, 'bad']) {
        assert.equal((await call('cart/update', { id: 1, quantity })).status, 400);
        assert.equal((await call('cart')).data.cart.count, 1);
      }
      assert.equal((await call('cart/update', { id: 1 })).status, 400);
      assert.equal((await call('cart/update', { id: 1, quantity: 2 })).data.cart.quantity, 2);
      assert.equal((await call('cart/update', { id: 1, quantity: 5 })).status, 400);
    });
    await t.test('guest cannot order', async () => assert.equal((await call('orders/create', {})).status, 401));
    const sent = (await call('auth/phone/send', { phone: '+79990000000', purpose: 'register' })).data;
    await call('auth/phone/check', { challenge: sent.challenge, code: '1234' });
    assert.equal((await call('auth/phone/check', { challenge: sent.challenge, code: '1234' })).data.state, 'email');
    assert.equal(
      (
        await call('auth/phone/check', {
          challenge: sent.challenge,
          email: 'test@example.com',
          password: 'TestPass!123',
          confirmPassword: 'TestPass!123',
        })
      ).data.state,
      'done',
    );
    const payload = {
      recipient: { firstName: 'Тест', lastName: 'Проверка', phone: '+79990000000', email: 'test@example.com' },
      privacy: true,
      payment: 'card',
      delivery: 'pickup',
      addressId: 12,
    };
    await t.test('CDEK pickup retains carrier and point; dimensions use selected SKU and quantity', async () => {
      assert.equal((await call('orders/create', payload)).status, 200);
      const saved = (await call('__test/checkout')).data;
      assert.equal(saved.address.deliveryProvider, 'cdek');
      assert.equal(saved.address.pickupCode, 'RND1');
      assert.equal(saved.package.weight, 3000);
      assert.equal(saved.package.height, 2);
    });
    await t.test('retry after a lost response returns the same order without creating another', async () => {
      const before = (await call('__test/metrics')).data.orders;
      const retryPayload = { ...payload, requestId: 'checkout-http-repeat-01' };
      assert.equal((await call('orders/create', retryPayload)).status, 200);
      assert.equal((await call('orders/create', retryPayload)).status, 200);
      assert.equal((await call('__test/metrics')).data.orders, before + 1);
      assert.equal((await call('orders/create', { ...retryPayload, addressId: 11 })).status, 400);
    });
    await t.test('postal pickup requires matching office quote', async () => {
      assert.equal((await call('orders/create', { ...payload, addressId: 11 })).status, 400);
      const quote = (await call('delivery/quote', { mode: 'office', addressId: 11 })).data.quote;
      const order = await call('orders/create', { ...payload, addressId: 11, shippingQuoteId: quote.id });
      assert.equal(order.status, 200);
      assert.equal(order.data.order.delivery.code, 'mail');
      assert.equal(order.data.order.delivery.pointCode, '344000');
      assert.equal(
        (await call('orders/create', { ...payload, addressId: 11, delivery: 'delivery', shippingQuoteId: quote.id }))
          .status,
        400,
      );
      await call('cart/update', { id: 1, quantity: 1 });
      assert.equal((await call('orders/create', { ...payload, addressId: 11, shippingQuoteId: quote.id })).status, 400);
    });
    await t.test('courier quote uses address normalization', async () => {
      const quote = (
        await call('delivery/quote', { mode: 'door', address: 'Россия, Ростов-на-Дону, Большая Садовая, 10' })
      ).data.quote;
      assert.equal(quote.address.postalCode, '344001');
      assert.equal(
        (
          await call('orders/create', {
            ...payload,
            addressId: undefined,
            delivery: 'delivery',
            shippingQuoteId: quote.id,
          })
        ).status,
        200,
      );
    });
    await t.test('invalid recipient, missing consent, wrong payment and home as pickup rejected', async () => {
      for (const patch of [
        { privacy: false },
        { payment: 'cash' },
        { addressId: 13 },
        { recipient: { ...payload.recipient, email: 'invalid' } },
      ])
        assert.equal((await call('orders/create', { ...payload, ...patch })).status, 400);
    });
    await t.test('explicit zero removes an item and empty cart is represented correctly', async () => {
      const cart = (await call('cart/update', { id: 1, quantity: 0 })).data.cart;
      assert.equal(cart.count, 0);
      assert.equal(cart.total, 0);
      assert.equal((await call('orders/create', payload)).status, 400);
    });
  },
);
