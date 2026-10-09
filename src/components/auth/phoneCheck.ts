export type PhoneCheckInput = { challenge: string; code?: string; email?: string };
export type PhoneCheckResult = {
    success: boolean;
    challenge?: string;
    channel?: 'mobile-id' | 'sms';
    expiresIn?: number;
    retryAfter?: number;
    state: 'pending' | 'code' | 'processing' | 'email' | 'done';
};
type Request = (input: PhoneCheckInput) => Promise<PhoneCheckResult>;
type Wait = (ms: number, signal: AbortSignal) => Promise<void>;

export const getPhoneRetryAfter = (error: unknown): number | null => {
    if (typeof error !== 'object' || error === null || !('status' in error) || error.status !== 429 || !('data' in error)) return null;
    const data = error.data;
    if (typeof data !== 'object' || data === null || !('retryAfter' in data)) return null;
    const seconds = data.retryAfter;
    return typeof seconds === 'number' && Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : null;
};

export const isTemporaryPhoneError = (error: unknown): boolean => {
    if (typeof error !== 'object' || error === null || !('status' in error)) return false;
    const status = error.status === 'PARSING_ERROR' && 'originalStatus' in error ? error.originalStatus : error.status;
    return (typeof status === 'number' && (status >= 500 || status === 200)) || status === 'FETCH_ERROR' || status === 'TIMEOUT_ERROR';
};

export const isPhoneCheckResult = (value: unknown): value is PhoneCheckResult => {
    return typeof value === 'object' && value !== null && 'success' in value && value.success === true
        && 'state' in value && typeof value.state === 'string'
        && ['pending', 'code', 'processing', 'email', 'done'].includes(value.state);
};

const wait: Wait = (ms, signal) => new Promise((resolve, reject) => {
    signal.throwIfAborted();
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, ms);
    signal.addEventListener('abort', abort, { once: true });
});

// A user's confirmation waits behind an active poll; it is never discarded.
// Only checks are retried. This class cannot send a new SMS or create a challenge.
export class PhoneCheckQueue {
    private active: Promise<PhoneCheckResult> | null = null;

    private track(task: Promise<PhoneCheckResult>): Promise<PhoneCheckResult> {
        const tracked = task.finally(() => { if (this.active === tracked) this.active = null; });
        this.active = tracked;
        return tracked;
    }

    poll(request: Request, input: PhoneCheckInput): Promise<PhoneCheckResult> | null {
        if (this.active) return null;
        return this.track(request(input));
    }

    submit(request: Request, input: PhoneCheckInput, options: {
        signal: AbortSignal;
        onRetry: () => void;
        wait?: Wait;
    }): Promise<PhoneCheckResult> {
        const previous = this.active;
        return this.track((async () => {
            const priorResult = await previous?.catch(() => null);
            options.signal.throwIfAborted();
            // SIM-PUSH may have completed while the user was entering the code.
            if (priorResult?.state === 'done' || (priorResult?.state === 'email' && input.email === undefined)) return priorResult;
            const delays = [1500, 3000, 5000];
            for (let attempt = 0; ; attempt++) {
                options.signal.throwIfAborted();
                try {
                    const result = await request(input);
                    options.signal.throwIfAborted();
                    return result;
                } catch (error) {
                    options.signal.throwIfAborted();
                    if (!input.code || !isTemporaryPhoneError(error) || attempt >= delays.length) throw error;
                    options.onRetry();
                    await (options.wait ?? wait)(delays[attempt], options.signal);
                }
            }
        })());
    }
}
