import { useEffect, useMemo, useRef, useState } from "react";

import { YANDEX_MAPS_API_KEY } from "@/config/env";
import { useLazyGeocodeAddressQuery } from "@store/api/address/addressApi";
import {
  loadYandexMaps,
  type YandexMapInstance,
  type YandexPlacemark,
} from "@components/blocks/Profile/subpages/ProfileAddresses/lib/yandexMaps";
import type {
  Coordinates,
  ProfileAddress,
} from "@components/blocks/Profile/subpages/ProfileAddresses/model/types";
import { loadPickupPoints } from "@components/blocks/Profile/subpages/ProfileAddresses/lib/pickupPoints";
import styles from "./DeliveryPointModal.module.scss";

export type DeliveryProvider = "cdek" | "mail";

interface DeliveryPointModalProps {
  open: boolean;
  provider: DeliveryProvider;
  city: string;
  country: string;
  countryCode: string;
  referenceCoordinates?: Coordinates | null;
  onClose: () => void;
  onSelect: (address: ProfileAddress) => void;
  isSaving?: boolean;
}

interface DeliveryPoint {
  id: string;
  code: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  distanceKm: number | null;
}

const providerTitle = (provider: DeliveryProvider) =>
  provider === "cdek" ? "СДЭК" : "Почта России";


const distanceKm = (a: Coordinates, b: Coordinates): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const DeliveryPointModal = ({
  open,
  provider,
  city,
  country,
  countryCode,
  referenceCoordinates,
  onClose,
  onSelect,
  isSaving = false,
}: DeliveryPointModalProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<YandexMapInstance | null>(null);
  const placemarksRef = useRef<YandexPlacemark[]>([]);
  const [points, setPoints] = useState<DeliveryPoint[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [geocode] = useLazyGeocodeAddressQuery();

  const selected = useMemo(
    () => points.find((point) => point.id === selectedId) ?? null,
    [points, selectedId],
  );

  useEffect(() => {
    if (!open || !mapContainerRef.current) return;

    let cancelled = false;
    setError("");
    setPoints([]);
    setSelectedId("");
    setIsLoading(true);

    const run = async () => {
      try {
        if (!YANDEX_MAPS_API_KEY) {
          throw new Error("Не задан VITE_YANDEX_MAPS_API_KEY");
        }

        let reference = referenceCoordinates ?? null;
        if (!reference && city.trim()) {
          const geocoded = await geocode({
            geocode: [city, country].filter(Boolean).join(", "),
            results: 1,
          }).unwrap();
          const resolved = geocoded[0];
          if (resolved) {
            reference = [resolved.latitude, resolved.longitude];
          }
        }

        const ymaps = await loadYandexMaps(YANDEX_MAPS_API_KEY);
        if (cancelled || !mapContainerRef.current) return;

        const center: Coordinates = reference ?? [47.2357, 39.7015];
        const map = new ymaps.Map(
          mapContainerRef.current,
          { center, zoom: 12, controls: ["zoomControl"] },
          { suppressMapOpenBlock: true },
        );
        mapRef.current = map;

        const rawPoints = await loadPickupPoints(provider, center);
        const normalized = rawPoints
          .map((point) => ({
            ...point,
            distanceKm: distanceKm(center, point.coordinates),
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 30);

        if (!normalized.length) {
          throw new Error(
            provider === "cdek"
              ? `Рядом с ${city} не найдены пункты СДЭК`
              : `Рядом с ${city} не найдены отделения Почты России`,
          );
        }

        if (cancelled) return;
        setPoints(normalized);
        setSelectedId(normalized[0].id);

        normalized.forEach((point, index) => {
          const placemark = new ymaps.Placemark(
            point.coordinates,
            { balloonContentHeader: point.name, balloonContentBody: point.address },
            { preset: index === 0 ? "islands#redIcon" : "islands#blackIcon" },
          );
          placemark.events?.add?.("click", () => setSelectedId(point.id));
          map.geoObjects.add(placemark);
          placemarksRef.current.push(placemark);
        });

        if (map.setBounds && normalized.length > 1) {
          const lats = normalized.map((point) => point.coordinates[0]);
          const lons = normalized.map((point) => point.coordinates[1]);
          map.setBounds(
            [[Math.min(...lats), Math.min(...lons)], [Math.max(...lats), Math.max(...lons)]],
            { checkZoomRange: true, zoomMargin: 35 },
          );
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Не удалось загрузить пункты выдачи",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
      mapRef.current?.destroy();
      mapRef.current = null;
      placemarksRef.current = [];
    };
  }, [city, country, geocode, open, provider, referenceCoordinates]);

  useEffect(() => {
    if (!selected || !mapRef.current) return;
    mapRef.current.setCenter(selected.coordinates, 15, { duration: 250 });
  }, [selected]);

  if (!open) return null;

  const save = () => {
    if (!selected) return;

    onSelect({
      id: Date.now(),
      title: `${providerTitle(provider)} — ${selected.name}`,
      formattedAddress: selected.address,
      address1: selected.address,
      address2: "",
      city,
      region: "",
      province: "",
      country,
      countryId: 0,
      countryCode,
      postalCode: "",
      entrance: "",
      floor: "",
      apartment: "",
      comment: "",
      deliveryProvider: provider,
      pickupCode: selected.code,
      pickupName: selected.name,
      isDefault: false,
      latitude: selected.coordinates[0],
      longitude: selected.coordinates[1],
    });
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.header__title}>
            Выберите пункт {providerTitle(provider)}
          </h2>
          <button type="button" className={styles.header__close} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <p className={styles.description}>
              Пункты отсортированы по расстоянию до вашего сохранённого адреса. Если адреса нет — до центра города.
            </p>
            {isLoading && <p className={styles.status}>Ищем ближайшие пункты…</p>}
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.list}>
              {points.map((point) => (
                <button
                  key={point.id}
                  type="button"
                  className={`${styles.point} ${selectedId === point.id ? styles.point_active : ""}`}
                  onClick={() => setSelectedId(point.id)}
                >
                  <span className={styles.point__name}>{point.name}</span>
                  <span className={styles.point__address}>{point.address}</span>
                  {point.distanceKm !== null && (
                    <span className={styles.point__distance}>
                      {point.distanceKm < 1
                        ? `${Math.round(point.distanceKm * 1000)} м`
                        : `${point.distanceKm.toFixed(1)} км`}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              className={styles.save}
              disabled={!selected || isSaving}
              onClick={save}
            >
              {isSaving ? "Сохраняем…" : "Выбрать этот пункт"}
            </button>
          </aside>

          <div className={styles.map}>
            <div ref={mapContainerRef} className={styles.map__container} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPointModal;
