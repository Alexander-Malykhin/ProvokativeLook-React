import { animateModalClose } from '@UI/overlays/Modal/animateModalClose';
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import Modal from '@UI/overlays/Modal/Modal';
import { YANDEX_MAPS_API_KEY } from '@/config/env';
import {
  useLazyGeocodeAddressQuery,
  useLazyGetPickupPointsQuery,
  type PickupPoint,
} from '@store/api/address/addressApi';
import { getRequestErrorMessage } from '@store/api/getRequestErrorMessage';
import { loadYandexMaps, type YandexMapInstance, type YandexPlacemark } from '../../lib/yandexMaps';
import type { Coordinates, ParsedAddress, ProfileAddress } from '../../model/types';
import AddressCitySelect from '../AddressCitySelect/AddressCitySelect';
import styles from './AddressModal.module.scss';
export type DeliveryProvider = 'cdek' | 'mail';
interface AddressModalProps {
  cdekOnly?: boolean;
  mailOnly?: boolean;
  open: boolean;
  onClose: () => void;
  onSave: (address: ProfileAddress) => void;
  city?: string;
  country?: string;
  countryCode?: string;
  isSaving?: boolean;
  saveError?: string;
}
type MappedPickupPoint = PickupPoint & {
  coordinates?: Coordinates;
  resolvedAddress?: ParsedAddress;
};
const providerLabel = (provider: DeliveryProvider) => (provider === 'cdek' ? 'СДЭК' : 'Почта России');
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const AddressModal = ({
  cdekOnly = false,
  mailOnly = false,
  open,
  onClose: finishClose,
  onSave,
  city: initialCity = 'Ростов-на-Дону',
  country: initialCountry = 'Россия',
  countryCode: initialCountryCode = 'RU',
  isSaving = false,
  saveError = '',
}: AddressModalProps) => {
  const onClose = () => animateModalClose(finishClose);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<YandexMapInstance | null>(null);
  const placemarksRef = useRef<YandexPlacemark[]>([]);
  const requestRef = useRef(0);
  const selectionRef = useRef(0);
  const [city, setCity] = useState(initialCity || 'Ростов-на-Дону');
  const [country, setCountry] = useState(initialCountry || 'Россия');
  const [countryCode, setCountryCode] = useState((initialCountryCode || 'RU').toUpperCase());
  const [provider, setProvider] = useState<DeliveryProvider>(mailOnly ? 'mail' : 'cdek');
  const [points, setPoints] = useState<MappedPickupPoint[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedResolved, setSelectedResolved] = useState<ParsedAddress | null>(null);
  const [error, setError] = useState('');
  const [mapError, setMapError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResolvingPoint, setIsResolvingPoint] = useState(false);
  const [geocode] = useLazyGeocodeAddressQuery();
  const [getPickupPoints] = useLazyGetPickupPointsQuery();
  const selected = useMemo(() => points.find((point) => point.id === selectedId) ?? null, [points, selectedId]);
  const isRussianPostAvailable = countryCode === 'RU' || country.trim().toLowerCase() === 'россия';
  const [previousSetup, setPreviousSetup] = useState({
    open,
    initialCity,
    initialCountry,
    initialCountryCode,
    mailOnly,
  });
  if (
    previousSetup.open !== open ||
    previousSetup.initialCity !== initialCity ||
    previousSetup.initialCountry !== initialCountry ||
    previousSetup.initialCountryCode !== initialCountryCode ||
    previousSetup.mailOnly !== mailOnly
  ) {
    setPreviousSetup({ open, initialCity, initialCountry, initialCountryCode, mailOnly });
    setCity(initialCity || 'Ростов-на-Дону');
    setCountry(initialCountry || 'Россия');
    setCountryCode((initialCountryCode || 'RU').toUpperCase());
    setProvider(mailOnly ? 'mail' : 'cdek');
    setPoints([]);
    setSelectedId('');
    setSelectedResolved(null);
    setError('');
  }
  if (!isRussianPostAvailable && provider === 'mail' && !mailOnly) setProvider('cdek');
  const ensureMap = async (center: Coordinates, requestId: number) => {
    if (!YANDEX_MAPS_API_KEY || !mapContainerRef.current) return null;
    const ymaps = await loadYandexMaps(YANDEX_MAPS_API_KEY);
    if (requestRef.current !== requestId || !mapContainerRef.current) return null;
    if (!mapRef.current) {
      mapRef.current = new ymaps.Map(
        mapContainerRef.current,
        { center, zoom: 11, controls: ['zoomControl'] },
        { suppressMapOpenBlock: true },
      );
    } else {
      mapRef.current.setCenter(center, 11, { duration: 150 });
    }
    return ymaps;
  };
  const showPointsOnMap = async (nextPoints: MappedPickupPoint[], center: Coordinates, requestId: number) => {
    const ymaps = await ensureMap(center, requestId);
    if (!ymaps || !mapRef.current || requestRef.current !== requestId) return;
    placemarksRef.current.forEach((placemark) => mapRef.current?.geoObjects.remove(placemark));
    placemarksRef.current = [];
    const coordinates: Coordinates[] = [];
    nextPoints.forEach((point) => {
      if (!point.coordinates || !mapRef.current) return;
      coordinates.push(point.coordinates);
      const placemark = new ymaps.Placemark(
        point.coordinates,
        {
          balloonContentHeader: escapeHtml(point.name),
          balloonContentBody: escapeHtml(point.address),
        },
        { preset: 'islands#blackIcon', iconColor: '#000000' },
      );
      placemark.events?.add?.('click', () => selectPoint(point));
      mapRef.current.geoObjects.add(placemark);
      placemarksRef.current.push(placemark);
    });
    if (coordinates.length > 1 && mapRef.current.setBounds) {
      const latitudes = coordinates.map((item) => item[0]);
      const longitudes = coordinates.map((item) => item[1]);
      mapRef.current.setBounds(
        [
          [Math.min(...latitudes), Math.min(...longitudes)],
          [Math.max(...latitudes), Math.max(...longitudes)],
        ],
        { checkZoomRange: true, zoomMargin: 35 },
      );
    }
  };
  const showSelectedOnMap = async (point: MappedPickupPoint, resolved: ParsedAddress, requestId: number) => {
    const coordinates: Coordinates = [resolved.latitude, resolved.longitude];
    const ymaps = await ensureMap(coordinates, requestId);
    if (!ymaps || !mapRef.current || requestRef.current !== requestId) return;
    if (point.coordinates) {
      mapRef.current.setCenter(coordinates, 15, { duration: 200 });
      return;
    }
    const placemark = new ymaps.Placemark(
      coordinates,
      {
        balloonContentHeader: escapeHtml(point.name),
        balloonContentBody: escapeHtml(point.address),
      },
      { preset: 'islands#blackIcon', iconColor: '#000000' },
    );
    mapRef.current.geoObjects.add(placemark);
    placemarksRef.current.push(placemark);
    mapRef.current.setCenter(coordinates, 15, { duration: 200 });
  };
  async function resolvePoint(point: MappedPickupPoint, requestId: number) {
    const selectionId = ++selectionRef.current;
    if (point.resolvedAddress) {
      setSelectedResolved(point.resolvedAddress);
      mapRef.current?.setCenter(
        point.coordinates ?? [point.resolvedAddress.latitude, point.resolvedAddress.longitude],
        15,
        { duration: 200 },
      );
      return;
    }
    setIsResolvingPoint(true);
    try {
      const geocoded = await geocode({
        geocode: point.address,
        results: 1,
      }).unwrap();
      if (requestRef.current !== requestId || selectionRef.current !== selectionId) return;
      const resolved = geocoded[0];
      if (!resolved) {
        throw new Error('Не удалось определить координаты выбранного пункта');
      }
      setSelectedResolved(resolved);
      try {
        await showSelectedOnMap(point, resolved, requestId);
      } catch {
        if (requestRef.current === requestId) setMapError('Карта временно недоступна. Выберите пункт из списка.');
      }
    } catch (requestError) {
      if (requestRef.current === requestId && selectionRef.current === selectionId) {
        setSelectedResolved(null);
        setError(getRequestErrorMessage(requestError, 'Не удалось показать выбранный пункт на карте'));
      }
    } finally {
      if (requestRef.current === requestId && selectionRef.current === selectionId) setIsResolvingPoint(false);
    }
  }
  const loadPoints = useEffectEvent(() => {
    if (!open || !city.trim()) return;
    const requestId = ++requestRef.current;

    const cityQuery = [city, country].filter(Boolean).join(', ');
    void geocode({ geocode: cityQuery, results: 1 })
      .unwrap()
      .then(async (geocoded) => {
        if (requestRef.current !== requestId) return;
        const resolvedCity = geocoded[0];
        if (!resolvedCity) {
          throw new Error('Не удалось определить выбранный город');
        }
        if (resolvedCity.country) setCountry(resolvedCity.country);
        if (resolvedCity.countryCode) {
          setCountryCode(resolvedCity.countryCode.toUpperCase());
        }
        const actualCountryCode = (resolvedCity.countryCode || countryCode).toUpperCase();
        if (provider === 'mail' && actualCountryCode !== 'RU') {
          throw new Error('Почта России доступна только для городов России');
        }
        const pickupRequest = {
          city: resolvedCity.city || city,
          provider,
          country: resolvedCity.country || country,
          countryCode: actualCountryCode,
        };
        let response;
        try {
          response = await getPickupPoints(pickupRequest, false).unwrap();
        } catch {
          if (requestRef.current !== requestId) return;
          await new Promise((resolve) => window.setTimeout(resolve, 450));
          if (requestRef.current !== requestId) return;
          response = await getPickupPoints(pickupRequest, false).unwrap();
        }
        if (requestRef.current !== requestId) return;
        let nextPoints = response.points ?? [];
        if (provider === 'mail' && nextPoints.length === 0) {
          await new Promise((resolve) => window.setTimeout(resolve, 450));
          if (requestRef.current !== requestId) return;
          const retryResponse = await getPickupPoints(pickupRequest, false).unwrap();
          if (requestRef.current !== requestId) return;
          nextPoints = retryResponse.points ?? [];
        }
        const mappedPoints = nextPoints.map((point): MappedPickupPoint => {
          const latitude = Number(point.latitude);
          const longitude = Number(point.longitude);
          if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude === 0 || longitude === 0)
            return point;
          return {
            ...point,
            coordinates: [latitude, longitude],
          };
        });
        if (requestRef.current !== requestId) return;
        setPoints(mappedPoints);
        setIsLoading(false);
        try {
          if (!YANDEX_MAPS_API_KEY) throw new Error('Map unavailable');
          await showPointsOnMap(mappedPoints, [resolvedCity.latitude, resolvedCity.longitude], requestId);
        } catch {
          if (requestRef.current === requestId) setMapError('Карта временно недоступна. Выберите пункт из списка.');
        }
      })
      .catch((requestError: unknown) => {
        if (requestRef.current === requestId) {
          setError(getRequestErrorMessage(requestError, `Не удалось загрузить пункты ${providerLabel(provider)}`));
        }
      })
      .finally(() => {
        if (requestRef.current === requestId) setIsLoading(false);
      });
  });
  const [reload, setReload] = useState(0);
  const loadKey = JSON.stringify([city, open, provider, reload]);
  const [previousLoadKey, setPreviousLoadKey] = useState('');
  if (previousLoadKey !== loadKey) {
    setPreviousLoadKey(loadKey);
    setIsLoading(open);
    setError('');
    setPoints([]);
    setSelectedId('');
    setSelectedResolved(null);
    setIsResolvingPoint(false);
    setMapError('');
  }
  useEffect(() => {
    if (!open) return;
    void loadPoints();
    return () => {
      requestRef.current += 1;
      mapRef.current?.destroy();
      mapRef.current = null;
      placemarksRef.current = [];
    };
  }, [city, open, provider, reload]);
  const changeCity = (nextCity: string, resolved?: ParsedAddress) => {
    setCity(nextCity);
    if (resolved?.country) setCountry(resolved.country);
    if (resolved?.countryCode) setCountryCode(resolved.countryCode.toUpperCase());
  };
  function selectPoint(point: MappedPickupPoint) {
    const requestId = requestRef.current;
    setSelectedId(point.id);
    setSelectedResolved(null);
    setError('');
    void resolvePoint(point, requestId);
  }
  const save = () => {
    if (!selected || !selectedResolved) return;
    const pickupCode = selected.code || selected.externalId || selected.id;
    onSave({
      id: Date.now(),
      title: `${providerLabel(provider)} — ${selected.name}`,
      formattedAddress: selectedResolved.formattedAddress || selected.address,
      address1: selectedResolved.address1 || selected.address,
      address2: '',
      city: selectedResolved.city || city,
      region: selectedResolved.region || '',
      province: selectedResolved.province || '',
      country: selectedResolved.country || country,
      countryId: 0,
      countryCode: selectedResolved.countryCode || countryCode,
      postalCode:
        selected.postalCode || selectedResolved.postalCode || (provider === 'mail' ? selected.code : '') || '',
      entrance: '',
      floor: '',
      apartment: '',
      comment: '',
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
        <button type="button" aria-label="Закрыть окно" className={styles.modal__close} onClick={onClose} />
      </div>

      <div className={styles.modal__desktopContent}>
        <div className={styles.modal__form}>
          <AddressCitySelect value={city} defaultCity={initialCity || 'Ростов-на-Дону'} onChange={changeCity} />

          {!mailOnly && !cdekOnly && (
            <div className={styles.pickupServices}>
              <label className={`${styles.pickupService} ${provider === 'cdek' ? styles.pickupService_active : ''}`}>
                <input
                  type="radio"
                  name="pickup-provider"
                  checked={provider === 'cdek'}
                  onChange={() => setProvider('cdek')}
                />
                <span className={styles.pickupService__content}>СДЭК</span>
              </label>

              {!cdekOnly && (
                <label
                  className={`${styles.pickupService} ${provider === 'mail' ? styles.pickupService_active : ''} ${!isRussianPostAvailable ? styles.pickupService_disabled : ''}`}
                  aria-disabled={!isRussianPostAvailable}
                  title={isRussianPostAvailable ? undefined : 'Почта России доступна только в России'}
                >
                  <input
                    type="radio"
                    name="pickup-provider"
                    checked={provider === 'mail'}
                    disabled={!isRussianPostAvailable}
                    onChange={() => setProvider('mail')}
                  />
                  <span className={styles.pickupService__content}>
                    <span>Почта России</span>
                  </span>
                </label>
              )}
            </div>
          )}

          <div className={styles.pickupList}>
            {isLoading && (
              <p className={styles.pickupStatus}>
                Загружаем пункты {providerLabel(provider)} в г. {city}…
              </p>
            )}

            {!isLoading && error && (
              <div className={styles.pickupErrorBox}>
                <p className={styles.pickupError}>{error}</p>
                <button type="button" className={styles.pickupRetry} onClick={() => setReload((value) => value + 1)}>
                  Повторить
                </button>
              </div>
            )}

            {!isLoading && !error && points.length === 0 && (
              <p className={styles.pickupStatus}>В выбранном городе пункты не найдены.</p>
            )}

            {points.map((point) => (
              <button
                key={point.id}
                type="button"
                className={`${styles.pickupPointRow} ${selectedId === point.id ? styles.pickupPointRow_active : ''}`}
                onClick={() => selectPoint(point)}
              >
                <strong>{point.name}</strong>
                <span>{point.address}</span>
                {point.code && <small>Индекс / код: {point.code}</small>}
                {typeof point.distance === 'number' && (
                  <small>
                    {point.distance < 1000
                      ? `${Math.round(point.distance)} м от центра поиска`
                      : `${(point.distance / 1000).toFixed(1)} км от центра поиска`}
                  </small>
                )}
              </button>
            ))}
          </div>

          {saveError && (
            <p className={styles.pickupError} role="alert">
              {saveError}
            </p>
          )}
          <button
            type="button"
            disabled={!selected || !selectedResolved || isLoading || isResolvingPoint || isSaving}
            className={styles.modal__save}
            onClick={save}
          >
            {isSaving ? 'Сохраняем…' : isResolvingPoint ? 'Показываем пункт…' : 'Сохранить'}
          </button>
        </div>

        <div className={styles.pickupMapWrap}>
          <div ref={mapContainerRef} className={styles.pickupMap} />
          {mapError && (
            <div className={styles.pickupMapStatus} role="status">
              {mapError}
            </div>
          )}
          {isLoading && !mapRef.current && <div className={styles.pickupMapStatus}>Загружаем карту…</div>}
          {!isLoading && points.length === 0 && (
            <div className={styles.pickupMapStatus}>Выберите другой город или службу доставки</div>
          )}
        </div>
      </div>
    </Modal>
  );
};
export default AddressModal;
