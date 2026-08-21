import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { clearReloadParam, reloadWithFreshHtml } from "@helpers/chunkReload";
import "@scss/main.scss";

window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    reloadWithFreshHtml();
});

clearReloadParam();

const root = document.getElementById("root");

if (!root) {
    throw new Error("Root element was not found");
}

createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
