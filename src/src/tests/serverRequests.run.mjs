import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import process from "node:process";

const host = "127.0.0.1";
const port = Number(process.env.VITE_TEST_PORT ?? 4174);
const origin = `http://${host}:${port}`;
const baseUrl = `${origin}/local/api/site/index.php?route=`;
const projectPath = fileURLToPath(new URL("../../", import.meta.url));
const vitePath = fileURLToPath(new URL("../../node_modules/vite/bin/vite.js", import.meta.url));
const testPath = fileURLToPath(new URL("./serverRequests.test.mjs", import.meta.url));
const writeEnabled = process.argv.includes("--write");

const vite = spawn(process.execPath, [vitePath, "--host", host, "--port", String(port), "--strictPort"], {
    cwd: projectPath,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
});

let viteOutput = "";

vite.stdout.on("data", (chunk) => {
    viteOutput += chunk.toString();
});

vite.stderr.on("data", (chunk) => {
    viteOutput += chunk.toString();
});

const waitForVite = async () => {
    const deadline = Date.now() + 30000;

    while (Date.now() < deadline) {
        if (vite.exitCode !== null) {
            throw new Error(viteOutput || `Vite завершился с кодом ${vite.exitCode}`);
        }

        try {
            await fetch(origin);
            return;
        }
        catch {
        }

        await new Promise((resolve) => setTimeout(resolve, 250));
    }

    throw new Error("Vite не запустился за 30 секунд");
};

const stopVite = () => {
    if (vite.exitCode === null) {
        vite.kill("SIGTERM");
    }
};

process.once("exit", stopVite);
process.once("SIGINT", () => {
    stopVite();
    process.exit(130);
});
process.once("SIGTERM", () => {
    stopVite();
    process.exit(143);
});

try {
    await waitForVite();

    const tests = spawn(process.execPath, ["--test", testPath], {
        cwd: projectPath,
        env: {
            ...process.env,
            RUN_SERVER_TESTS: "1",
            RUN_WRITE_TESTS: writeEnabled ? "1" : "0",
            SITE_API_BASE_URL: baseUrl,
        },
        stdio: "inherit",
    });

    const exitCode = await new Promise((resolve, reject) => {
        tests.once("error", reject);
        tests.once("exit", (code) => resolve(code ?? 1));
    });

    process.exitCode = exitCode;
}
finally {
    stopVite();
}
