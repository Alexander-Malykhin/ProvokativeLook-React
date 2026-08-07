import type { Coordinates } from "../model/types";

interface YandexMapEvent {
  get: (name: string) => unknown;
}

export interface YandexPlacemark {
  geometry: {
    setCoordinates: (coordinates: Coordinates) => void;
  };
}

export interface YandexMapInstance {
  events: {
    add: (eventName: string, callback: (event: YandexMapEvent) => void) => void;
  };
  geoObjects: {
    add: (object: YandexPlacemark) => void;
  };
  setCenter: (
    coordinates: Coordinates,
    zoom?: number,
    options?: Record<string, unknown>,
  ) => void;
  destroy: () => void;
}

export interface YandexApi {
  ready: (callback: () => void) => void;
  Map: new (
    container: HTMLElement,
    state: {
      center: Coordinates;
      zoom: number;
      controls?: string[];
    },
    options?: Record<string, unknown>,
  ) => YandexMapInstance;
  Placemark: new (
    coordinates: Coordinates,
    properties?: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => YandexPlacemark;
}

declare global {
  interface Window {
    ymaps?: YandexApi;
  }
}

const SCRIPT_ID = "yandex-maps-api";

export const loadYandexMaps = (apiKey: string): Promise<YandexApi> =>
  new Promise((resolve, reject) => {
    const resolveReady = () => {
      if (!window.ymaps) {
        reject(new Error("Яндекс Карты не инициализированы"));
        return;
      }

      window.ymaps.ready(() => resolve(window.ymaps as YandexApi));
    };

    if (window.ymaps) {
      resolveReady();
      return;
    }

    const existing = document.getElementById(
      SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", resolveReady, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Не удалось загрузить Яндекс Карты")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src =
      "https://api-maps.yandex.ru/2.1/" +
      `?apikey=${encodeURIComponent(apiKey)}` +
      "&lang=ru_RU";
    script.onload = resolveReady;
    script.onerror = () =>
      reject(new Error("Не удалось загрузить Яндекс Карты"));

    document.head.appendChild(script);
  });

export const normalizeCoordinates = (value: unknown): Coordinates | null => {
  if (!Array.isArray(value) || value.length < 2) {
    return null;
  }

  const latitude = Number(value[0]);
  const longitude = Number(value[1]);

  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? [latitude, longitude]
    : null;
};
