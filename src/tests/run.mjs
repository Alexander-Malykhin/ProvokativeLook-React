import { readdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const integration = process.argv.includes('--integration');
const env = { ...process.env };
if (integration) {
  const backend = env.SITE_BACKEND_ROOT;
  if (!backend || !existsSync(path.join(backend, 'Tests/Api/fixtures/PhoneAuthServer.php'))) {
    throw new Error('Set SITE_BACKEND_ROOT to the PHP local directory before running integration tests.');
  }
  env.PHP_TEST_ROUTER = path.join(backend, 'Tests/Api/fixtures/PhoneAuthServer.php');
  env.PHP_CATALOG_TEST_ROUTER = path.join(backend, 'Tests/Api/fixtures/CatalogServer.php');
  env.PHP_FEATURED_TEST_ROUTER = path.join(backend, 'Tests/Api/fixtures/FeaturedCatalogServer.php');
}
const files = readdirSync(path.join(root, 'src/tests'))
  .filter(
    (file) =>
      file.endsWith('.test.mjs') &&
      !['apiReadSmoke.test.mjs', 'serverRequests.test.mjs'].includes(file) &&
      file.includes('.integration.') === integration,
  )
  .map((file) => path.join(root, 'src/tests', file));
const result = spawnSync(process.execPath, ['--test', ...files], { cwd: root, env, stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
