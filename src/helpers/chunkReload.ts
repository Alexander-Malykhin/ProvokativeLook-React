const RELOAD_KEY = "provokativelook:chunk-reload-at";
const RELOAD_PARAM = "__app_reload";
const RELOAD_COOLDOWN = 30000;

export const reloadWithFreshHtml = (): boolean => {
    const now = Date.now();

    try {
        const lastReload = Number(window.sessionStorage.getItem(RELOAD_KEY) ?? 0);

        if (lastReload && now - lastReload < RELOAD_COOLDOWN) {
            return false;
        }

        window.sessionStorage.setItem(RELOAD_KEY, String(now));
    }
    catch {
    }

    const url = new URL(window.location.href);
    url.searchParams.set(RELOAD_PARAM, String(now));
    window.location.replace(url.toString());
    return true;
};

export const clearReloadParam = () => {
    const url = new URL(window.location.href);

    if (!url.searchParams.has(RELOAD_PARAM)) {
        return;
    }

    url.searchParams.delete(RELOAD_PARAM);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
};
