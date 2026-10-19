import test from 'node:test';
import assert from 'node:assert/strict';

test('a failed map script can be retried and concurrent callers share one load', async () => {
  const previousWindow = globalThis.window,
    previousDocument = globalThis.document;
  const scripts = new Map();
  let added = 0;
  class Script extends EventTarget {
    remove() {
      scripts.delete(this.id);
    }
  }
  globalThis.window = {};
  globalThis.document = {
    getElementById: (id) => scripts.get(id),
    createElement: () => new Script(),
    head: {
      appendChild(script) {
        added++;
        scripts.set(script.id, script);
      },
    },
  };
  try {
    const { loadYandexMaps } = await import('../components/blocks/Profile/subpages/ProfileAddresses/lib/yandexMaps.ts');
    const first = loadYandexMaps('fixture-key');
    assert.equal(loadYandexMaps('fixture-key'), first);
    const rejected = assert.rejects(first, /Карта временно недоступна/);
    scripts.get('yandex-maps-api').dispatchEvent(new Event('error'));
    await rejected;
    assert.equal(scripts.size, 0);
    const retry = loadYandexMaps('fixture-key');
    assert.equal(added, 2);
    const api = { ready: (callback) => callback() };
    globalThis.window.ymaps = api;
    scripts.get('yandex-maps-api').dispatchEvent(new Event('load'));
    assert.equal(await retry, api);
  } finally {
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
  }
});

test('a stalled map load has a deadline instead of an infinite loading screen', async (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const previousWindow = globalThis.window,
    previousDocument = globalThis.document;
  let removed = false;
  const script = new EventTarget();
  script.remove = () => {
    removed = true;
  };
  globalThis.window = {};
  globalThis.document = { getElementById: () => null, createElement: () => script, head: { appendChild() {} } };
  try {
    const { loadYandexMaps } =
      await import('../components/blocks/Profile/subpages/ProfileAddresses/lib/yandexMaps.ts?deadline');
    const result = loadYandexMaps('fixture-key');
    const rejected = assert.rejects(result, /Карта временно недоступна/);
    context.mock.timers.tick(12000);
    await rejected;
    assert.equal(removed, true);
  } finally {
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
    context.mock.timers.reset();
  }
});
