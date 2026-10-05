// Shared across unmounts when switching between carriers. Only the latest selection
// of a mounted form may send a request; the server's five-second limit is retained.
let tail: Promise<unknown> = Promise.resolve();
let availableAt = 0;
export function deferPostalQuote(milliseconds: number) {
    availableAt = Math.max(availableAt, Date.now() + milliseconds);
}
export function enqueuePostalQuote<T>(current: () => boolean, send: () => Promise<T>): Promise<T | undefined> {
    const job = tail.then(async () => {
        if (!current()) return undefined;
        await new Promise((resolve) => setTimeout(resolve, Math.max(350, availableAt - Date.now())));
        if (!current()) return undefined;
        availableAt = Date.now() + 5200;
        return send();
    });
    tail = job.catch(() => undefined);
    return job;
}
