import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query';

type Query = ReturnType<typeof fetchBaseQuery>;
type Pause = (ms: number, signal: AbortSignal) => Promise<void>;
const pause: Pause = (ms, signal) => new Promise(resolve => {
    if (signal.aborted) { resolve(); return; }
    const finish = () => { clearTimeout(timer); signal.removeEventListener('abort', finish); resolve(); };
    const timer = setTimeout(finish, ms);
    signal.addEventListener('abort', finish, { once: true });
});

export const isTransientReadError = (error: FetchBaseQueryError): boolean => {
    const status = error.status === 'PARSING_ERROR' ? error.originalStatus : error.status;
    return status === 'FETCH_ERROR' || status === 'TIMEOUT_ERROR'
        || status === 408 || status === 502 || status === 503 || status === 504
        || status === 500 || status === 200;
};

export const parseApiResponse = async (response: Response): Promise<unknown> => {
    const text = await response.text();
    if (!text.trim()) {
        if (response.status === 204) return null;
        throw new Error('Empty API response');
    }
    // PHP warnings/HTML are an invalid response, never part of customer-facing text.
    return JSON.parse(text);
};

export const createSiteBaseQuery = (baseUrl: string, query: Query = fetchBaseQuery(), wait: Pause = pause):
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => async (args, api, extraOptions) => {
    const request: FetchArgs = typeof args === 'string' ? { url: args } : args;
    const method = (request.method ?? 'GET').toUpperCase();
    const read = method === 'GET' || method === 'HEAD';
    const configured: FetchArgs = {
        ...request,
        url: baseUrl + request.url.replace(/^\//, ''),
        credentials: request.credentials ?? 'include',
        cache: 'no-store',
        timeout: request.timeout ?? (read ? 20000 : 45000),
        responseHandler: request.responseHandler ?? parseApiResponse,
    };
    let result = await query(configured, api, extraOptions);
    // Retry only reads, once. A timed-out write may already have changed server state.
    if (read && result.error && isTransientReadError(result.error) && !api.signal.aborted) {
        await wait(400, api.signal);
        if (!api.signal.aborted) result = await query(configured, api, extraOptions);
    }
    return result;
};
