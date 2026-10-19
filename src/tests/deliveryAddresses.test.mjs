import test from 'node:test';
import assert from 'node:assert/strict';
import {
  courierAddress,
  addressesForDelivery,
} from '../components/blocks/Profile/subpages/ProfileAddresses/model/deliveryAddresses.ts';

test('saved delivery addresses stay separated by carrier and pickup/home mode', () => {
  const postalHome = courierAddress('mail', {
    id: 1,
    formattedAddress: 'Ростов-на-Дону, Садовая, 1',
    postalCode: '344000',
  });
  const cdekHome = courierAddress('cdek', { ...postalHome, id: 2 });
  const postalOffice = { ...postalHome, id: 3, pickupCode: '344001', pickupName: 'Почта России' };
  const cdekOffice = { ...cdekHome, id: 4, pickupCode: 'RND1', pickupName: 'СДЭК' };
  const addresses = [postalHome, cdekHome, postalOffice, cdekOffice];
  assert.deepEqual(
    addressesForDelivery(addresses, 'mail', false).map((a) => a.id),
    [1],
  );
  assert.deepEqual(
    addressesForDelivery(addresses, 'cdek', false).map((a) => a.id),
    [2],
  );
  assert.deepEqual(
    addressesForDelivery(addresses, 'mail', true).map((a) => a.id),
    [3],
  );
  assert.deepEqual(
    addressesForDelivery(addresses, 'cdek', true).map((a) => a.id),
    [4],
  );
  const changed = courierAddress('mail', cdekOffice);
  assert.equal(changed.deliveryProvider, 'mail');
  assert.equal(changed.pickupCode, '');
  assert.equal(changed.pickupName, '');
});
