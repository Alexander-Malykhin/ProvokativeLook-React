interface ErrorPayload {
    message?: string;
    error?: string;
    errors?: Record<string, string | string[]>;
}
export const getRequestErrorMessage = (error: unknown, fallback = "Не удалось выполнить запрос"): string => {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    if (typeof error !== "object" || error === null) {
        return fallback;
    }
    const candidate = error as {
        status?: number | string;
        data?: ErrorPayload | string;
        error?: string;
        message?: string;
    };
    if (candidate.status === 'TIMEOUT_ERROR') return 'Сервер не ответил вовремя. Проверьте подключение и попробуйте позже.';
    if (candidate.status === 'FETCH_ERROR') return 'Нет соединения с сервером. Проверьте подключение и попробуйте позже.';
    if (candidate.status === 'PARSING_ERROR') return 'Сервер вернул неполный ответ. Попробуйте ещё раз.';
    if (typeof candidate.status === 'number' && candidate.status >= 500) return 'Сервер временно недоступен. Попробуйте позже.';
    if (typeof candidate.data === "string") return fallback;
    if (candidate.data && typeof candidate.data === "object") {
        if (candidate.data.message) {
            return candidate.data.message;
        }
        if (candidate.data.error) {
            return candidate.data.error;
        }
        const firstError = candidate.data.errors
            ? Object.values(candidate.data.errors)[0]
            : undefined;
        if (Array.isArray(firstError)) {
            return firstError[0] ?? fallback;
        }
        if (typeof firstError === "string") {
            return firstError;
        }
    }
    return candidate.message || candidate.error || fallback;
};

