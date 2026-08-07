interface ErrorPayload {
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
}

export const getRequestErrorMessage = (
  error: unknown,
  fallback = "Не удалось выполнить запрос",
): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error !== "object" || error === null) {
    return fallback;
  }

  const candidate = error as {
    data?: ErrorPayload | string;
    error?: string;
    message?: string;
  };

  if (typeof candidate.data === "string" && candidate.data.trim()) {
    return candidate.data;
  }

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
