import { spawn } from 'node:child_process';
import { createServer } from 'vite';
if (!process.env.PHP_FEATURED_TEST_ROUTER) throw new Error('Set PHP_FEATURED_TEST_ROUTER');
const php = spawn('php', ['-S', '127.0.0.1:4178', process.env.PHP_FEATURED_TEST_ROUTER], { stdio: 'ignore' });
const vite = await createServer({
  server: {
    host: '127.0.0.1',
    port: 4177,
    strictPort: true,
    proxy: {
      '/local/api': { target: 'http://127.0.0.1:4178', changeOrigin: true },
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
console.log('Featured browser fixture: http://127.0.0.1:4177/src/tests/featured.html');
