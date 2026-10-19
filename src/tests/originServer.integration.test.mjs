import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
import path from 'node:path';

let server;
let url;
before(async () => {
  const backend = process.env.SITE_BACKEND_ROOT;
  assert.ok(backend, 'Set SITE_BACKEND_ROOT');
  const socket = createServer();
  await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  url = `http://127.0.0.1:${port}/?route=auth/logout`;
  server = spawn('php', ['-S', `127.0.0.1:${port}`, path.join(backend, 'api/site/index.php')], { stdio: 'ignore' });
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      if ((await fetch(url, { method: 'OPTIONS' })).status === 204) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error('API entry fixture failed to start');
});
after(() => server?.kill());

test('untrusted browser writes are rejected before Bitrix or session side effects', async () => {
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
    const response = await fetch(url, {
      method,
      headers: { Origin: 'https://untrusted.example', 'Content-Type': 'text/plain' },
      ...(method === 'OPTIONS' ? {} : { body: '{}' }),
    });
    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), { error: 'ORIGIN_NOT_ALLOWED' });
    assert.equal(response.headers.get('access-control-allow-origin'), null);
    assert.deepEqual(response.headers.getSetCookie(), []);
  }
});
test('trusted storefront and localhost preflights retain credentialed CORS', async () => {
  for (const origin of ['https://site.provokativelook.ru', 'http://localhost:5173', 'http://127.0.0.1:5173']) {
    const response = await fetch(url, { method: 'OPTIONS', headers: { Origin: origin } });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get('access-control-allow-origin'), origin);
    assert.equal(response.headers.get('access-control-allow-credentials'), 'true');
  }
});
