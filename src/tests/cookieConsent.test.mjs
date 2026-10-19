import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COOKIE_CONSENT_MAX_AGE,
  getCookiePolicyVersion,
  hasCurrentCookieConsent,
  readCookieConsent,
} from '../components/blocks/Footer/components/FooterCookie/cookieConsent.ts';
import { createSafeStorage } from '../helpers/browserStorage.ts';

const page = {
  id: 10,
  pageCode: 'cookie-policy',
  title: 'Файлы cookie',
  intro: 'Условия',
  content: '<p>Первая редакция</p>',
  updatedAt: '13.10.2026',
};
const version = getCookiePolicyVersion(page);
const now = 1_800_000_000_000;
const accepted = { choice: 'accepted', policyVersion: version, savedAt: now };

test('only explicit acceptance of the exact current revision hides the banner', () => {
  assert.equal(hasCurrentCookieConsent(null, version, now), false);
  assert.equal(hasCurrentCookieConsent({ ...accepted, choice: 'rejected' }, version, now), false);
  assert.equal(hasCurrentCookieConsent(accepted, version, now), true);
  assert.equal(hasCurrentCookieConsent(accepted, null, now), false);
  assert.equal(hasCurrentCookieConsent({ ...accepted, policyVersion: '2026-09-03' }, version, now), false);
});
test('admin text changes without changing the update date require a new acceptance', () => {
  for (const field of ['title', 'intro', 'content', 'updatedAt']) {
    const changed = getCookiePolicyVersion({ ...page, [field]: page[field] + ' новая редакция' });
    assert.notEqual(changed, version);
    assert.equal(hasCurrentCookieConsent(accepted, changed, now), false);
  }
  assert.equal(getCookiePolicyVersion({ ...page }), version);
});
test('broken, missing or unrelated policy cannot be accepted', () => {
  for (const data of [
    undefined,
    {},
    { ...page, content: '' },
    { ...page, title: '' },
    { ...page, pageCode: 'privacy-policy' },
  ]) {
    assert.equal(getCookiePolicyVersion(data), null);
  }
});
test('expired, future, invalid and old-format consent is not valid', () => {
  assert.equal(hasCurrentCookieConsent(accepted, version, now + COOKIE_CONSENT_MAX_AGE - 1), true);
  assert.equal(hasCurrentCookieConsent(accepted, version, now + COOKIE_CONSENT_MAX_AGE), false);
  assert.equal(hasCurrentCookieConsent(accepted, version, now - 1), false);
  for (const raw of [
    null,
    'accepted',
    'rejected',
    '{',
    '{}',
    '[]',
    '1',
    'null',
    JSON.stringify({ ...accepted, savedAt: 'today' }),
  ]) {
    assert.equal(readCookieConsent(raw), null);
  }
});
test('atomic saved consent survives reload and rejected consent still asks again', () => {
  const storage = new Map();

  const backing = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  };
  const writer = createSafeStorage(() => backing);
  writer.setItem('consent', JSON.stringify(accepted));
  const reloaded = createSafeStorage(() => backing);
  assert.equal(hasCurrentCookieConsent(readCookieConsent(reloaded.getItem('consent')), version, now), true);
  writer.setItem('consent', JSON.stringify({ ...accepted, choice: 'rejected' }));
  assert.equal(hasCurrentCookieConsent(readCookieConsent(reloaded.getItem('consent')), version, now), false);
});
test('blocked browser storage preserves explicit choice in memory without crashing', () => {
  const storage = createSafeStorage(() => {
    throw new Error('Storage blocked');
  });
  storage.setItem('consent', JSON.stringify(accepted));
  assert.equal(hasCurrentCookieConsent(readCookieConsent(storage.getItem('consent')), version, now), true);
  storage.removeItem('consent');
  assert.equal(hasCurrentCookieConsent(readCookieConsent(storage.getItem('consent')), version, now), false);
});
