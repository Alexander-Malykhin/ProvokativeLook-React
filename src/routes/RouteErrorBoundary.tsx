import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

const RouteErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <main role="alert">
        <h1>Страница не найдена</h1>
        <Link to="/">Вернуться на главную</Link>
      </main>
    );
  }

  return (
    <main role="alert">
      <h1>Не удалось открыть страницу</h1>
      <p>Обновите страницу или попробуйте ещё раз позже.</p>
    </main>
  );
};

export default RouteErrorBoundary;
