import { useEffect, useRef, useState } from 'react';
import Modal from '@UI/overlays/Modal/Modal';
import { YANDEX_MAPS_API_KEY } from '@/config/env';
import {
  useLazyPostalOfficeCodesQuery,
  useLazyPostalOfficeQuery,
  type PostalOffice,
} from '@store/api/orders/postalOfficesApi';
import { getRequestErrorMessage } from '@store/api/getRequestErrorMessage';
import AddressCitySelect from '@components/blocks/Profile/subpages/ProfileAddresses/components/AddressCitySelect/AddressCitySelect';
import {
  loadYandexMaps,
  type YandexMapInstance,
  type YandexPlacemark,
} from '@components/blocks/Profile/subpages/ProfileAddresses/lib/yandexMaps';
import styles from './PostalOfficePicker.module.scss';

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const cityKey = (value: string) =>
  value
    .toLocaleLowerCase('ru')
    .replace(/^г(?:ород)?\.?\s+/, '')
    .trim()
    .replace(/ё/g, 'е');
const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const officeHours = (office: PostalOffice) =>
  office.workingHours
    .map((day) => `${days[day.day - 1]}: ${day.from && day.to ? `${day.from}–${day.to}` : 'выходной'}`)
    .join('; ');

export default function PostalOfficePicker({
  initial,
  onClose,
  onSelect,
}: {
  initial: PostalOffice | null;
  onClose: () => void;
  onSelect: (office: PostalOffice) => void;
}) {
  const [location, setLocation] = useState({
    city: initial?.city || 'Ростов-на-Дону',
    region: initial?.region || 'Ростовская область',
    country: 'RU',
  });
  const [offices, setOffices] = useState<PostalOffice[]>([]);
  const [selected, setSelected] = useState<PostalOffice | null>(initial);
  const [error, setError] = useState('');
  const [mapError, setMapError] = useState('');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [getCodes] = useLazyPostalOfficeCodesQuery();
  const [getOffice] = useLazyPostalOfficeQuery();
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<YandexMapInstance | null>(null);
  const markers = useRef<YandexPlacemark[]>([]);

  const [previousLocation, setPreviousLocation] = useState(location);
  const [previousAttempt, setPreviousAttempt] = useState(attempt);
  if (previousLocation !== location || previousAttempt !== attempt) {
    setPreviousLocation(location);
    setPreviousAttempt(attempt);
    setOffices([]);
    setSelected(null);
    setLoading(true);
    setError('');
    setFailed(0);
    setMapError('');
  }
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        if (location.country !== 'RU') throw new Error('Выберите город России.');
        const request = getCodes({ city: location.city, region: location.region }, true);
        const { postalCodes } = await request.unwrap();
        if (cancelled) return;
        let next = 0;
        const worker = async () => {
          while (!cancelled && next < postalCodes.length) {
            const code = postalCodes[next++];
            const detail = getOffice(code, true);
            try {
              const { office } = await detail.unwrap();
              if (cancelled) return;

              if (office.available && cityKey(office.city) === cityKey(location.city)) {
                setOffices((previous) =>
                  [...previous, office].sort((a, b) => a.postalCode.localeCompare(b.postalCode)),
                );
              }
            } catch {
              if (!cancelled) setFailed((count) => count + 1);
            }
          }
        };
        await Promise.all(Array.from({ length: Math.min(4, postalCodes.length) }, worker));
      } catch (err) {
        if (!cancelled) setError(getRequestErrorMessage(err, 'Не удалось загрузить отделения.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();

    return () => {
      cancelled = true;
    };
  }, [location, attempt, getCodes, getOffice]);

  useEffect(() => {
    let disposed = false;
    const draw = async () => {
      try {
        if (!YANDEX_MAPS_API_KEY) throw new Error('Карта не настроена. Выберите отделение из списка.');
        const ymaps = await loadYandexMaps(YANDEX_MAPS_API_KEY);
        if (disposed || !container.current) return;
        const located = offices.filter((office) => office.latitude !== null && office.longitude !== null);
        if (!map.current)
          map.current = new ymaps.Map(container.current, {
            center: [47.23, 39.7],
            zoom: 11,
            controls: ['zoomControl'],
          });
        markers.current.forEach((marker) => map.current?.geoObjects.remove(marker));
        markers.current = [];
        for (const office of located) {
          const marker = new ymaps.Placemark(
            [office.latitude!, office.longitude!],
            {
              balloonContentHeader: `Почта России · ${office.postalCode}`,
              balloonContentBody: `${escapeHtml(office.address)}<br>${escapeHtml(officeHours(office))}`,
              balloonContentFooter: 'Нажмите «Выбрать отделение» под списком',
            },
            { preset: 'islands#blackIcon' },
          );
          marker.events?.add('click', () => setSelected(office));
          map.current.geoObjects.add(marker);
          markers.current.push(marker);
        }
        if (located.length) {
          const lat = located.map((office) => office.latitude!);
          const lng = located.map((office) => office.longitude!);
          if (located.length === 1) map.current.setCenter([lat[0], lng[0]], 13);
          else
            map.current.setBounds?.(
              [
                [Math.min(...lat), Math.min(...lng)],
                [Math.max(...lat), Math.max(...lng)],
              ],
              { checkZoomRange: true, zoomMargin: 30 },
            );
        }
      } catch {
        if (!disposed) setMapError('Карта временно недоступна. Можно выбрать отделение из списка.');
      }
    };

    if (!loading) void draw();
    return () => {
      disposed = true;
    };
  }, [offices, loading]);
  useEffect(
    () => () => {
      map.current?.destroy();
      map.current = null;
    },
    [],
  );

  return (
    <Modal
      open
      onClose={onClose}
      overlayClassName={styles.overlay}
      contentClassName={styles.window}
      ariaLabelledBy="post-office-title"
    >
      <div className={styles.header}>
        <h2 id="post-office-title">Отделения Почты России</h2>
        <button type="button" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
      </div>
      <AddressCitySelect
        value={location.city}
        onChange={(city, resolved) => {
          setSelected(null);
          markers.current.forEach((marker) => map.current?.geoObjects.remove(marker));
          markers.current = [];
          setLocation({ city, region: resolved?.region || '', country: resolved?.countryCode || 'RU' });
        }}
      />
      <div className={styles.layout}>
        <div className={styles.list} aria-label="Список отделений">
          {loading && <p role="status">Загружаем отделения… Найдено: {offices.length}</p>}
          {error && <p role="alert">{error}</p>}
          {!loading && failed > 0 && (
            <p role="status">Часть отделений не загрузилась ({failed}). Можно повторить запрос.</p>
          )}
          {!loading && !error && !failed && !offices.length && (
            <p>Доступные отделения в выбранном городе не найдены.</p>
          )}
          {!loading && (error || failed > 0) && (
            <button type="button" onClick={() => setAttempt((value) => value + 1)}>
              Повторить загрузку
            </button>
          )}
          {offices.map((office) => (
            <button
              type="button"
              key={office.postalCode}
              aria-pressed={selected?.postalCode === office.postalCode}
              onClick={() => {
                setSelected(office);
                if (office.latitude !== null && office.longitude !== null)
                  map.current?.setCenter([office.latitude, office.longitude], 15);
              }}
            >
              <strong>Отделение {office.postalCode}</strong>
              <span>{office.address}</span>
              <small>{officeHours(office)}</small>
            </button>
          ))}
        </div>
        <div className={styles.mapWrap}>
          <div ref={container} className={styles.map} />
          {(loading || mapError) && <p className={styles.mapStatus}>{loading ? 'Загружаем точки карты…' : mapError}</p>}
        </div>
      </div>
      {selected && (
        <p className={styles.selection}>
          {selected.postalCode}, {selected.address}
        </p>
      )}
      <button
        type="button"
        className={styles.confirm}
        disabled={!selected}
        onClick={() => {
          if (selected) onSelect(selected);
        }}
      >
        Выбрать отделение
      </button>
    </Modal>
  );
}
