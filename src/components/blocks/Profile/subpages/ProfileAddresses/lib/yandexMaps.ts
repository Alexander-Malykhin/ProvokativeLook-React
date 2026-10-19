import type { Coordinates } from '../model/types';
interface YandexMapEvent {
  get: (name: string) => unknown;
}
interface YandexEventManager {
  add: (eventName: string, callback: (event?: YandexMapEvent) => void) => void;
}
export interface YandexGeoObject {
  geometry?: {
    getCoordinates?: () => Coordinates;
  };
  properties?: {
    get?: (name: string) => unknown;
  };
  events?: YandexEventManager;
}
export interface YandexPlacemark {
  geometry: {
    setCoordinates: (coordinates: Coordinates) => void;
  };
  events?: YandexEventManager;
}
export interface YandexGeoObjectCollection {
  toArray?: () => YandexGeoObject[];
  getBounds?: () => unknown;
}
export interface YandexSearchResult {
  geoObjects?: YandexGeoObjectCollection;
}
export interface YandexMapInstance {
  events: {
    add: (eventName: string, callback: (event: YandexMapEvent) => void) => void;
  };
  geoObjects: {
    add: (object: YandexPlacemark) => void;
    remove: (object: YandexPlacemark) => void;
  };
  setCenter: (coordinates: Coordinates, zoom?: number, options?: Record<string, unknown>) => void;
  setBounds?: (bounds: unknown, options?: Record<string, unknown>) => void;
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
  search?: (query: string, options?: Record<string, unknown>) => Promise<YandexSearchResult>;
}
declare global {
  interface Window {
    ymaps?: YandexApi;
  }
}
const SCRIPT_ID = 'yandex-maps-api';
let loadingMaps: Promise<YandexApi> | null = null;
export const loadYandexMaps = (apiKey: string): Promise<YandexApi> => {
  if (loadingMaps) return loadingMaps;
  loadingMaps = new Promise<YandexApi>((resolve, reject) => {
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    let settled = false;
    const cleanup = () => {
      clearTimeout(timer);
      script?.removeEventListener('load', ready);
      script?.removeEventListener('error', fail);
    };
    const fail = () => {
      if (settled) return;
      settled = true;
      cleanup();
      script?.remove();
      reject(new Error('Карта временно недоступна. Попробуйте открыть её ещё раз.'));
    };
    const ready = () => {
      if (!window.ymaps) {
        fail();
        return;
      }
      window.ymaps.ready(() => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(window.ymaps as YandexApi);
      });
    };
    const timer = setTimeout(fail, 12000);
    if (window.ymaps) {
      ready();
      return;
    }
    const existing = Boolean(script);
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
    }
    script.addEventListener('load', ready, { once: true });
    script.addEventListener('error', fail, { once: true });
    if (!existing) document.head.appendChild(script);
  }).catch((error) => {
    loadingMaps = null;
    throw error;
  });
  return loadingMaps;
};
export const normalizeCoordinates = (value: unknown): Coordinates | null => {
  if (!Array.isArray(value) || value.length < 2) {
    return null;
  }
  const latitude = Number(value[0]);
  const longitude = Number(value[1]);
  return Number.isFinite(latitude) && Number.isFinite(longitude) ? [latitude, longitude] : null;
};
