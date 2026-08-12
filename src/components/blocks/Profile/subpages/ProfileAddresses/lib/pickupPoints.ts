import type { Coordinates } from "../model/types";

export type PickupProvider = "cdek" | "mail";

export interface PickupPointResult {
  id: string;
  code: string;
  name: string;
  address: string;
  coordinates: Coordinates;
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string>;
}

const OVERPASS_ENDPOINTS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.nchc.org.tw/api/interpreter",
];

const withTimeout = async <T>(promise: Promise<T>, timeout = 9000): Promise<T> => {
  let timer = 0;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = window.setTimeout(() => reject(new Error("timeout")), timeout);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    window.clearTimeout(timer);
  }
};

const addressFromTags = (tags: Record<string, string>, city: string): string => {
  if (tags["addr:full"]) return tags["addr:full"];

  const street = tags["addr:street"] || tags["addr:place"] || "";
  const house = tags["addr:housenumber"] || "";
  const district = tags["addr:district"] || "";
  const taggedCity = tags["addr:city"] || city;
  const streetPart = [street, house].filter(Boolean).join(", ");

  return [taggedCity, district, streetPart].filter(Boolean).join(", ");
};

const makeQuery = (provider: PickupProvider, center: Coordinates): string => {
  const [lat, lon] = center;
  // 45 км покрывает весь крупный город и ближайшую агломерацию, но не соседние города.
  const radius = 45000;

  const selectors = provider === "mail"
    ? [
        `nwr(around:${radius},${lat},${lon})["amenity"="post_office"];`,
        `nwr(around:${radius},${lat},${lon})["operator"~"Почта России|Russian Post",i];`,
        `nwr(around:${radius},${lat},${lon})["name"~"Почта России|Почтовое отделение|Russian Post",i];`,
      ]
    : [
        `nwr(around:${radius},${lat},${lon})["name"~"СДЭК|СДЕК|CDEK",i];`,
        `nwr(around:${radius},${lat},${lon})["brand"~"СДЭК|СДЕК|CDEK",i];`,
        `nwr(around:${radius},${lat},${lon})["operator"~"СДЭК|СДЕК|CDEK",i];`,
      ];

  return `[out:json][timeout:12];(${selectors.join("")});out center tags;`;
};

const parseElements = (
  provider: PickupProvider,
  city: string,
  elements: OverpassElement[],
): PickupPointResult[] => {
  const seen = new Set<string>();

  return elements
    .map((element): PickupPointResult | null => {
      const lat = Number(element.lat ?? element.center?.lat);
      const lon = Number(element.lon ?? element.center?.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

      const key = `${lat.toFixed(5)}:${lon.toFixed(5)}`;
      if (seen.has(key)) return null;
      seen.add(key);

      const tags = element.tags ?? {};
      const fallbackName = provider === "cdek" ? "СДЭК" : "Почта России";
      const name = tags.name || tags.brand || tags.operator || fallbackName;
      const address = addressFromTags(tags, city) || city;
      const code = provider === "mail"
        ? tags["ref:ru_post"] || tags.postal_code || tags["addr:postcode"] || tags.ref || ""
        : tags.ref || tags["ref:cdek"] || "";

      return {
        id: `${provider}-${element.type}-${element.id}`,
        code,
        name,
        address,
        coordinates: [lat, lon],
      };
    })
    .filter((point): point is PickupPointResult => point !== null);
};

const requestEndpoint = async (
  endpoint: string,
  query: string,
  provider: PickupProvider,
  city: string,
): Promise<PickupPointResult[]> => {
  const response = await withTimeout(fetch(endpoint, {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams({ data: query }).toString(),
  }));

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = (await response.json()) as { elements?: OverpassElement[] };
  const points = parseElements(provider, city, payload.elements ?? []);
  if (!points.length) throw new Error("empty");
  return points;
};

export const loadPickupPoints = async (
  provider: PickupProvider,
  center: Coordinates,
  city: string,
): Promise<PickupPointResult[]> => {
  const query = makeQuery(provider, center);

  // Запускаем зеркала одновременно: не ждём по 5–10 секунд каждое последовательно.
  const requests = OVERPASS_ENDPOINTS.map((endpoint) =>
    requestEndpoint(endpoint, query, provider, city),
  );

  try {
    const points = await new Promise<PickupPointResult[]>((resolve, reject) => {
      let failed = 0;
      requests.forEach((request) => {
        void request
          .then(resolve)
          .catch(() => {
            failed += 1;
            if (failed === requests.length) reject(new Error("all endpoints failed"));
          });
      });
    });
    return points.slice(0, 80);
  } catch {
    throw new Error(
      provider === "cdek"
        ? "Не удалось загрузить пункты СДЭК. Нажмите «Повторить»."
        : "Не удалось загрузить отделения Почты России. Нажмите «Повторить».",
    );
  }
};
