import { useEffect, useMemo, useRef, useState } from "react";

import Modal from "@UI/overlays/Modal/Modal";
import { YANDEX_MAPS_API_KEY } from "@/config/env";
import {
  useLazyGeocodeAddressQuery,
  useLazyGetPickupPointsQuery,
  type PickupPoint,
} from "@store/api/address/addressApi";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";
import { loadYandexMaps, type YandexMapInstance, type YandexPlacemark } from "../../lib/yandexMaps";
import type { Coordinates, ParsedAddress, ProfileAddress } from "../../model/types";
import AddressCitySelect from "../AddressCitySelect/AddressCitySelect";
import styles from "./AddressModal.module.scss";

export type DeliveryProvider = "cdek" | "mail";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (address: ProfileAddress) => void;
  city?: string;
  country?: string;
  countryCode?: string;
  isSaving?: boolean;
}

const providerLabel = (provider: DeliveryProvider) =>
  provider === "cdek" ? "СДЭК" : "Почта России";

const AddressModal = ({
  open,
  onClose,
  onSave,
  city: initialCity = "Ростов-на-Дону",
  country: initialCountry = "Россия",
  countryCode: initialCountryCode = "RU",
  isSaving = false,
}: AddressModalProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<YandexMapInstance | null>(null);
  const placemarkRef = useRef<YandexPlacemark | null>(null);
  const requestRef = useRef(0);

  const [city, setCity] = useState(initialCity || "Ростов-на-Дону");
  const [country, setCountry] = useState(initialCountry || "Россия");
  const [countryCode, setCountryCode] = useState((initialCountryCode || "RU").toUpperCase());
  const [provider, setProvider] = useState<DeliveryProvider>("cdek");
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedResolved, setSelectedResolved] = useState<ParsedAddress | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResolvingPoint, setIsResolvingPoint] = useState(false);

  const [geocode] = useLazyGeocodeAddressQuery();
  const [getPickupPoints] = useLazyGetPickupPointsQuery();

  const selected = useMemo(
    () => points.find((point) => point.id === selectedId) ?? null,
    [points, selectedId],
  );

  const isRussianPostAvailable =
    countryCode === "RU" || country.trim().toLowerCase() === "россия";

  useEffect(() => {
    if (!open) return;
    setCity(initialCity || "Ростов-на-Дону");
    setCountry(initialCountry || "Россия");
    setCountryCode((initialCountryCode || "RU").toUpperCase());
    setProvider("cdek");
    setPoints([]);
    setSelectedId("");
    setSelectedResolved(null);
    setError("");
  }, [open, initialCity, initialCountry, initialCountryCode]);

  useEffect(() => {
    if (!isRussianPostAvailable && provider === "mail") {
      setProvider("cdek");
    }
  }, [isRussianPostAvailable, provider]);

  const ensureMap = async (center: Coordinates, requestId: number) => {
    if (!YANDEX_MAPS_API_KEY || !mapContainerRef.current) return null;

    const ymaps = await loadYandexMaps(YANDEX_MAPS_API_KEY);
    if (requestRef.current !== requestId || !mapContainerRef.current) return null;

    if (!mapRef.current) {
      mapRef.current = new ymaps.Map(
        mapContainerRef.current,
        { center, zoom: 11, controls: ["zoomControl"] },
        { suppressMapOpenBlock: true },
      );
    } else {
      mapRef.current.setCenter(center, 11, { duration: 150 });
    }

    return ymaps;
  };

  const showSelectedOnMap = async (
    point: PickupPoint,
    resolved: ParsedAddress,
    requestId: number,
  ) => {
    const coordinates: Coordinates = [resolved.latitude, resolved.longitude];
    const ymaps = await ensureMap(coordinates, requestId);
    if (!ymaps || !mapRef.current || requestRef.current !== requestId) return;

    if (placemarkRef.current) {
      mapRef.current.geoObjects.remove(placemarkRef.current);
    }

    const placemark = new ymaps.Placemark(
      coordinates,
      {
        balloonContentHeader: point.name,
        balloonContentBody: point.address,
      },
      { preset: "islands#blackIcon" },
    );

    mapRef.current.geoObjects.add(placemark);
    placemarkRef.current = placemark;
    mapRef.current.setCenter(coordinates, 15, { duration: 200 });
  };

  const resolvePoint = async (point: PickupPoint, requestId: number) => {
    setIsResolvingPoint(true);
    try {
      const geocoded = await geocode({
        geocode: point.address,
        results: 1,
      }).unwrap();

      if (requestRef.current !== requestId) return;
      const resolved = geocoded[0];
      if (!resolved) {
        throw new Error("Не удалось определить координаты выбранного пункта");
      }

      setSelectedResolved(resolved);
      await showSelectedOnMap(point, resolved, requestId);
    } catch (requestError) {
      if (requestRef.current === requestId) {
        setSelectedResolved(null);
        setError(
          getRequestErrorMessage(
            requestError,
            "Не удалось показать выбранный пункт на карте",
          ),
        );
      }
    } finally {
      if (requestRef.current === requestId) setIsResolvingPoint(false);
    }
  };

  const loadPoints = async () => {
    if (!open || !city.trim()) return;

    const requestId = ++requestRef.current;
    setIsLoading(true);
    setError("");
    setPoints([]);
    setSelectedId("");
    setSelectedResolved(null);

    try {
      const cityQuery = [city, country].filter(Boolean).join(", ");
      const geocoded = await geocode({ geocode: cityQuery, results: 1 }).unwrap();
      if (requestRef.current !== requestId) return;

      const resolvedCity = geocoded[0];
      if (!resolvedCity) {
        throw new Error("Не удалось определить выбранный город");
      }

      if (resolvedCity.country) setCountry(resolvedCity.country);
      if (resolvedCity.countryCode) {
        setCountryCode(resolvedCity.countryCode.toUpperCase());
      }

      const actualCountryCode = (resolvedCity.countryCode || countryCode).toUpperCase();
      if (provider === "mail" && actualCountryCode !== "RU") {
        throw new Error("Почта России доступна только для городов России");
      }

      await ensureMap(
        [resolvedCity.latitude, resolvedCity.longitude],
        requestId,
      );

      const response = await getPickupPoints({
        city: resolvedCity.city || city,
        provider,
        country: resolvedCity.country || country,
        countryCode: actualCountryCode,
      }).unwrap();

      if (requestRef.current !== requestId) return;

      const nextPoints = response.points ?? [];
      setPoints(nextPoints);

      if (nextPoints.length > 0) {
        setSelectedId(nextPoints[0].id);
        await resolvePoint(nextPoints[0], requestId);
      }
    } catch (requestError) {
      if (requestRef.current === requestId) {
        setError(
          getRequestErrorMessage(
            requestError,
            `Не удалось загрузить пункты ${providerLabel(provider)}`,
          ),
        );
      }
    } finally {
      if (requestRef.current === requestId) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    void loadPoints();

    return () => {
      requestRef.current += 1;
      mapRef.current?.destroy();
      mapRef.current = null;
      placemarkRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, open, provider]);

  const changeCity = (nextCity: string, resolved?: ParsedAddress) => {
    setCity(nextCity);
    if (resolved?.country) setCountry(resolved.country);
    if (resolved?.countryCode) setCountryCode(resolved.countryCode.toUpperCase());
  };

  const selectPoint = (point: PickupPoint) => {
    const requestId = requestRef.current;
    setSelectedId(point.id);
    setSelectedResolved(null);
    setError("");
    void resolvePoint(point, requestId);
  };

  const save = () => {
    if (!selected || !selectedResolved) return;

    const pickupCode = selected.code || selected.externalId || selected.id;
    onSave({
      id: Date.now(),
      title: `${providerLabel(provider)} — ${selected.name}`,
      formattedAddress: selectedResolved.formattedAddress || selected.address,
      address1: selectedResolved.address1 || selected.address,
      address2: "",
      city: selectedResolved.city || city,
      region: selectedResolved.region || "",
      province: selectedResolved.province || "",
      country: selectedResolved.country || country,
      countryId: 0,
      countryCode: selectedResolved.countryCode || countryCode,
      postalCode: selected.code || selectedResolved.postalCode || "",
      entrance: "",
      floor: "",
      apartment: "",
      comment: "",
      deliveryProvider: provider,
      pickupCode,
      pickupName: selected.name,
      isDefault: false,
      latitude: selectedResolved.latitude,
      longitude: selectedResolved.longitude,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      overlayClassName={styles.modal}
      contentClassName={styles.modal__window}
      ariaLabelledBy="address-modal-title"
    >
      <div className={styles.modal__header}>
        <h2 id="address-modal-title" className={styles.modal__title}>
          Добавить новый адрес
        </h2>
        <button
          type="button"
          aria-label="Закрыть окно"
          className={styles.modal__close}
          onClick={onClose}
        />
      </div>

      <div className={styles.modal__desktopContent}>
        <div className={styles.modal__form}>
          <AddressCitySelect
            value={city}
            defaultCity={initialCity || "Ростов-на-Дону"}
            onChange={changeCity}
          />

          <div className={styles.pickupServices}>
            <label
              className={`${styles.pickupService} ${
                provider === "cdek" ? styles.pickupService_active : ""
              }`}
            >
              <input
                type="radio"
                name="pickup-provider"
                checked={provider === "cdek"}
                onChange={() => setProvider("cdek")}
              />
              <span>СДЭК</span>
            </label>

            <label
              className={`${styles.pickupService} ${
                provider === "mail" ? styles.pickupService_active : ""
              }`}
              title={
                isRussianPostAvailable
                  ? undefined
                  : "Почта России доступна только в России"
              }
            >
              <input
                type="radio"
                name="pickup-provider"
                checked={provider === "mail"}
                disabled={!isRussianPostAvailable}
                onChange={() => setProvider("mail")}
              />
              <span>Почта России</span>
            </label>
          </div>

          <div className={styles.pickupList}>
            {isLoading && (
              <p className={styles.pickupStatus}>
                Загружаем пункты {providerLabel(provider)} в г. {city}…
              </p>
            )}

            {!isLoading && error && (
              <div className={styles.pickupErrorBox}>
                <p className={styles.pickupError}>{error}</p>
                <button
                  type="button"
                  className={styles.pickupRetry}
                  onClick={() => void loadPoints()}
                >
                  Повторить
                </button>
              </div>
            )}

            {!isLoading && !error && points.length === 0 && (
              <p className={styles.pickupStatus}>
                В выбранном городе пункты не найдены.
              </p>
            )}

            {points.map((point) => (
              <button
                key={point.id}
                type="button"
                className={`${styles.pickupPointRow} ${
                  selectedId === point.id ? styles.pickupPointRow_active : ""
                }`}
                onClick={() => selectPoint(point)}
              >
                <strong>{point.name}</strong>
                <span>{point.address}</span>
                {point.code && <small>Индекс / код: {point.code}</small>}
                {typeof point.distance === "number" && (
                  <small>
                    {point.distance < 1000
                      ? `${Math.round(point.distance)} м от центра поиска`
                      : `${(point.distance / 1000).toFixed(1)} км от центра поиска`}
                  </small>
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={
              !selected ||
              !selectedResolved ||
              isLoading ||
              isResolvingPoint ||
              isSaving
            }
            className={styles.modal__save}
            onClick={save}
          >
            {isSaving
              ? "Сохраняем…"
              : isResolvingPoint
                ? "Показываем пункт…"
                : "Сохранить"}
          </button>
        </div>

        <div className={styles.pickupMapWrap}>
          <div ref={mapContainerRef} className={styles.pickupMap} />
          {isLoading && !mapRef.current && (
            <div className={styles.pickupMapStatus}>Загружаем карту…</div>
          )}
          {!isLoading && points.length === 0 && (
            <div className={styles.pickupMapStatus}>
              Выберите другой город или службу доставки
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddressModal;
