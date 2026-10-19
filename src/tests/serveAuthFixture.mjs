import { spawn } from 'node:child_process';
import { createServer } from 'vite';
if (!process.env.PHP_TEST_ROUTER) throw new Error('Set PHP_TEST_ROUTER to Tests/Api/fixtures/PhoneAuthServer.php');
const php = spawn('php', ['-S', '127.0.0.1:4176', process.env.PHP_TEST_ROUTER], {
  stdio: ['ignore', 'ignore', 'pipe'],
});
php.stderr.on('data', () => {});
const vite = await createServer({
  server: {
    host: '127.0.0.1',
    port: 4175,
    strictPort: true,
    proxy: {
      '/local/api': {
        target: 'http://127.0.0.1:4176',
        changeOrigin: true,
        configure(proxy) {
          proxy.on('proxyReq', (request) => request.setHeader('Origin', 'http://localhost:5173'));
        },
      },
    },
  },
});
const stop = async () => {
  php.kill();
  await vite.close();
  process.exit();
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
process.on('exit', () => php.kill());
await vite.listen();
console.log(
  `Local frontend + PHP fixture ready: http://127.0.0.1:4175/src/tests/fixtures/${process.env.TEST_FIXTURE_PAGE ?? 'auth'}.html`,
);
