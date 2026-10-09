import { useEffect } from "react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { reloadWithFreshHtml } from "@helpers/chunkReload";

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error)
        return `${error.name}: ${error.message}`;
    if (typeof error === "string")
        return error;
    try {
        return JSON.stringify(error);
    }
    catch {
        return String(error);
    }
};
const isChunkLoadError = (error: unknown): boolean => {
    const message = getErrorMessage(error).toLowerCase();
    return (message.includes("failed to fetch dynamically imported module") ||
        message.includes("error loading dynamically imported module") ||
        message.includes("importing a module script failed") ||
        (message.includes("requested module") && message.includes("does not provide an export named")) ||
        message.includes("chunkloaderror") ||
        message.includes("loading chunk") ||
        message.includes("load failed") ||
        message.includes("vite:preloaderror"));
};
const forceFreshReload = () => {
    reloadWithFreshHtml();
};
const RouteErrorBoundary = () => {
    const error = useRouteError();
    useEffect(() => {
        if (!isChunkLoadError(error))
            return;
        forceFreshReload();
    }, [error]);
    if (isRouteErrorResponse(error) && error.status === 404) {
        return (<main role="alert" style={{ padding: "24px" }}>
        <h1>Страница не найдена</h1>
        <Link to="/">Вернуться на главную</Link>
      </main>);
    }
    const message = getErrorMessage(error);
    return (<main role="alert" style={{ padding: "24px", maxWidth: "760px", margin: "0 auto" }}>
      <h1>Не удалось открыть страницу</h1>
      <p>Приложение столкнулось с ошибкой. Попробуйте загрузить свежую версию.</p>

      <button type="button" onClick={forceFreshReload} style={{ padding: "12px 18px", cursor: "pointer", marginBottom: "20px" }}>
        Обновить приложение
      </button>

      {import.meta.env.DEV && <details open>
        <summary>Техническая информация</summary>
        <pre style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            marginTop: "12px",
            padding: "12px",
            background: "#f5f5f5",
            color: "#111",
            fontSize: "12px",
        }}>
          {message || "Неизвестная ошибка"}
        </pre>
      </details>}
    </main>);
};
export default RouteErrorBoundary;
