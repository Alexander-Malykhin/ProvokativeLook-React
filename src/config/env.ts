const readEnv = (key: keyof ImportMetaEnv, fallback: string): string => {
  const value = import.meta.env[key];

  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

export const API_BASE_URL = readEnv(
  "VITE_API_BASE_URL",
  "https://24.provokativelook.ru/local/api/web/index.php?route=",
);

export const SITE_API_BASE_URL = readEnv(
  "VITE_SITE_API_BASE_URL",
  "https://24.provokativelook.ru/local/api/site/index.php?route=",
);

export const IMAGE_BASE_URL = readEnv(
  "VITE_IMAGE_BASE_URL",
  "https://24.provokativelook.ru",
).replace(/\/$/, "");

export const YANDEX_MAPS_API_KEY = readEnv("VITE_YANDEX_MAPS_API_KEY", "");
