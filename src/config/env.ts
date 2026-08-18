const readEnv = (key: keyof ImportMetaEnv, fallback: string): string => {
  const value = import.meta.env[key];

  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};


export const SITE_API_BASE_URL = import.meta.env.DEV
  ? "/local/api/site/index.php?route="
  : readEnv(
      "VITE_SITE_API_BASE_URL",
      "https://24.provokativelook.ru/local/api/site/index.php?route=",
    );

export const IMAGE_BASE_URL = readEnv(
  "VITE_IMAGE_BASE_URL",
  "https://24.provokativelook.ru",
).replace(/\/$/, "");

export const YANDEX_MAPS_API_KEY = readEnv("VITE_YANDEX_MAPS_API_KEY", "");
