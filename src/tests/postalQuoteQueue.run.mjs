import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../components/blocks/Order/components/PostalDelivery/quoteQueue.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { enqueuePostalQuote } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
let selected = 0;
const sent = [];
const select = (id) => {
    selected = id;
    return enqueuePostalQuote(() => selected === id, async () => {
        sent.push({ id, at: Date.now() });
        return id;
    });
};
const results = await Promise.all([select(1), select(2), select(3)]);
assert.deepEqual(results, [undefined, undefined, 3]);
const skipped = select(4);
await Promise.resolve();
const latest = select(5);
assert.equal(await skipped, undefined);
assert.equal(await latest, 5);
assert.deepEqual(sent.map(({ id }) => id), [3, 5]);
assert.ok(sent[1].at - sent[0].at >= 5150, 'Requests exceeded server rate limit');
const unmounted = select(6);
selected = 7;
assert.equal(await unmounted, undefined);
assert.equal(sent.length, 2);
console.log('PASS: rapid switches send only latest selection, respect cooldown and ignore unmounted work');
