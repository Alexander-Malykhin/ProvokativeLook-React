import { useEffect, useRef, useState, type RefObject } from "react";

import { useLazyGeocodeAddressQuery } from "@store/api/address/addressApi";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  SELECTED_ZOOM,
} from "../model/constants";
import type { Coordinates, ParsedAddress } from "../model/types";
import {
  loadYandexMaps,
  normalizeCoordinates,
  type YandexMapInstance,
  type YandexPlacemark,
} from "../lib/yandexMaps";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
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
      onErrorRef.current("Не задан ключ Яндекс Карт");
      return;
    }

    const container = containerRef.current;
    let cancelled = false;
    setIsLoading(true);
    setIsReady(false);

    void loadYandexMaps(apiKey)
      .then((ymaps) => {
        if (cancelled) {
          return;
        }

        const coordinates: Coordinates = selectedAddress
          ? [selectedAddress.latitude, selectedAddress.longitude]
          : DEFAULT_CENTER;
        const map = new ymaps.Map(
          container,
          {
            center: coordinates,
            zoom: selectedAddress ? SELECTED_ZOOM : DEFAULT_ZOOM,
            controls: ["zoomControl"],
          },
          { suppressMapOpenBlock: true },
        );
        const placemark = new ymaps.Placemark(
          coordinates,
          {},
          { preset: "islands#redIcon" },
        );

        map.geoObjects.add(placemark);
        map.events.add("click", (event) => {
          const nextCoordinates = normalizeCoordinates(event.get("coords"));

          if (!nextCoordinates) {
            return;
          }

          placemark.geometry.setCoordinates(nextCoordinates);
          onSelectRef.current(nextCoordinates);
        });

        mapRef.current = map;
        placemarkRef.current = placemark;
        setIsLoading(false);
        setIsReady(true);
      })
      .catch((error) => {
        if (!cancelled) {
          onErrorRef.current(
            error instanceof Error
              ? error.message
              : "Не удалось загрузить карту",
          );
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      mapRef.current?.destroy();
      mapRef.current = null;
      placemarkRef.current = null;
      setIsReady(false);
    };
    // The map must be recreated only when its DOM container changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, containerRef, enabled]);

  useEffect(() => {
    if (!isReady || !selectedAddress) {
      return;
    }

    const coordinates: Coordinates = [
      selectedAddress.latitude,
      selectedAddress.longitude,
    ];
    placemarkRef.current?.geometry.setCoordinates(coordinates);
    mapRef.current?.setCenter(coordinates, SELECTED_ZOOM, {
      duration: 300,
    });
  }, [isReady, selectedAddress]);

  useEffect(() => {
    if (!isReady || selectedAddress || !city.trim()) {
      return;
    }

    void geocodeCity({ geocode: city, results: 1 })
      .unwrap()
      .then((result) => {
        const cityAddress = result[0];

        if (!cityAddress || !mapRef.current) {
          return;
        }

        const coordinates: Coordinates = [
          cityAddress.latitude,
          cityAddress.longitude,
        ];
        placemarkRef.current?.geometry.setCoordinates(coordinates);
        mapRef.current.setCenter(coordinates, DEFAULT_ZOOM, {
          duration: 300,
        });
      })
      .catch(() => undefined);
  }, [city, geocodeCity, isReady, selectedAddress]);

  return { isLoading };
};
