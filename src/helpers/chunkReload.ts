import { safeSessionStorage } from '@helpers/browserStorage';
const RELOAD_KEY = 'provokativelook:chunk-reload-at';
const RELOAD_PARAM = '__app_reload';
const RELOAD_COOLDOWN = 30000;

export const reloadWithFreshHtml = (): boolean => {
  const now = Date.now();
  const url = new URL(window.location.href);
  const previousReload = Number(url.searchParams.get(RELOAD_PARAM) ?? 0);
  if (previousReload && now - previousReload < RELOAD_COOLDOWN) return false;

  const lastReload = Number(safeSessionStorage.getItem(RELOAD_KEY) ?? 0);
  if (lastReload && now - lastReload < RELOAD_COOLDOWN) {
    return false;
  }
  safeSessionStorage.setItem(RELOAD_KEY, String(now));

  url.searchParams.set(RELOAD_PARAM, String(now));
  window.location.replace(url.toString());
  return true;
};

export const clearReloadParam = () => {
  const url = new URL(window.location.href);

  if (!url.searchParams.has(RELOAD_PARAM)) {
    return;
  }

  safeSessionStorage.setItem(RELOAD_KEY, url.searchParams.get(RELOAD_PARAM) ?? '0');

  url.searchParams.delete(RELOAD_PARAM);
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
};
