import { useEffect, useEffectEvent, useRef, useState, type RefObject } from 'react';
import { useLazyGeocodeAddressQuery } from '@store/api/address/addressApi';
import { DEFAULT_CENTER, DEFAULT_ZOOM, SELECTED_ZOOM } from '../model/constants';
import type { Coordinates, ParsedAddress } from '../model/types';
import { loadYandexMaps, normalizeCoordinates, type YandexMapInstance, type YandexPlacemark } from '../lib/yandexMaps';
interface UseAddressMapOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
  apiKey: string;
  city: string;
  selectedAddress: ParsedAddress | null;
  onSelect: (coordinates: Coordinates) => void;
  onError: (message: string) => void;
}
export const useAddressMap = ({
  containerRef,
  enabled,
  apiKey,
  city,
  selectedAddress,
  onSelect,
  onError,
}: UseAddressMapOptions) => {
  const mapRef = useRef<YandexMapInstance | null>(null);
  const placemarkRef = useRef<YandexPlacemark | null>(null);
  const onSelectRef = useRef(onSelect);
  const onErrorRef = useRef(onError);
  const [failed, setFailed] = useState(false);
  const readSelectedAddress = useEffectEvent(() => selectedAddress);
  const [isReady, setIsReady] = useState(false);
  const [previousSetup, setPreviousSetup] = useState({ enabled, apiKey });
  if (previousSetup.enabled !== enabled || previousSetup.apiKey !== apiKey) {
    setPreviousSetup({ enabled, apiKey });
    setIsReady(false);
    setFailed(false);
  }
  const [geocodeCity] = useLazyGeocodeAddressQuery();
  useEffect(() => {
    onSelectRef.current = onSelect;
    onErrorRef.current = onError;
  }, [onError, onSelect]);
  useEffect(() => {
    if (!enabled || !containerRef.current) {
      return;
    }
    if (!apiKey) {
      onErrorRef.current('Не задан ключ Яндекс Карт');
      return;
    }
    const container = containerRef.current;
    let cancelled = false;
    void loadYandexMaps(apiKey)
      .then((ymaps) => {
        if (cancelled) {
          return;
        }
        const initialAddress = readSelectedAddress();
        const coordinates: Coordinates = initialAddress
          ? [initialAddress.latitude, initialAddress.longitude]
          : DEFAULT_CENTER;
        const map = new ymaps.Map(
          container,
          {
            center: coordinates,
            zoom: initialAddress ? SELECTED_ZOOM : DEFAULT_ZOOM,
            controls: ['zoomControl'],
          },
          { suppressMapOpenBlock: true },
        );
        const placemark = new ymaps.Placemark(coordinates, {}, { preset: 'islands#redIcon' });
        map.geoObjects.add(placemark);
        map.events.add('click', (event) => {
          const nextCoordinates = normalizeCoordinates(event.get('coords'));
          if (!nextCoordinates) {
            return;
          }
          placemark.geometry.setCoordinates(nextCoordinates);
          onSelectRef.current(nextCoordinates);
        });
        mapRef.current = map;
        placemarkRef.current = placemark;
        setFailed(false);
        setIsReady(true);
      })
      .catch((error) => {
        if (!cancelled) {
          onErrorRef.current(error instanceof Error ? error.message : 'Не удалось загрузить карту');
          setFailed(true);
        }
      });
    return () => {
      cancelled = true;
      mapRef.current?.destroy();
      mapRef.current = null;
      placemarkRef.current = null;
    };
  }, [apiKey, containerRef, enabled]);
  useEffect(() => {
    if (!isReady || !selectedAddress) {
      return;
    }
    const coordinates: Coordinates = [selectedAddress.latitude, selectedAddress.longitude];
    placemarkRef.current?.geometry.setCoordinates(coordinates);
    mapRef.current?.setCenter(coordinates, SELECTED_ZOOM, {
      duration: 300,
    });
  }, [isReady, selectedAddress]);
  useEffect(() => {
    if (!isReady || selectedAddress || !city.trim()) {
      return;
    }
    let cancelled = false;
    const request = geocodeCity({ geocode: city, results: 1 });
    void request
      .unwrap()
      .then((result) => {
        const cityAddress = result[0];
        if (cancelled || !cityAddress || !mapRef.current) {
          return;
        }
        const coordinates: Coordinates = [cityAddress.latitude, cityAddress.longitude];
        placemarkRef.current?.geometry.setCoordinates(coordinates);
        mapRef.current.setCenter(coordinates, DEFAULT_ZOOM, {
          duration: 300,
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [city, geocodeCity, isReady, selectedAddress]);
  return { isLoading: enabled && Boolean(apiKey) && !isReady && !failed };
};
