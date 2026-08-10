import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "provokative-look-delivery-city";
const EVENT_NAME = "provokative-look-delivery-city-change";
export const DEFAULT_DELIVERY_CITY = "Ростов-на-Дону";

const readCity = () => {
  if (typeof window === "undefined") return DEFAULT_DELIVERY_CITY;
  return window.localStorage.getItem(STORAGE_KEY)?.trim() || DEFAULT_DELIVERY_CITY;
};

export const useDeliveryCity = () => {
  const [city, setCityState] = useState(readCity);

  useEffect(() => {
    const sync = () => setCityState(readCity());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setCity = useCallback((nextCity: string) => {
    const normalized = nextCity.trim() || DEFAULT_DELIVERY_CITY;
    window.localStorage.setItem(STORAGE_KEY, normalized);
    setCityState(normalized);
    window.dispatchEvent(new Event(EVENT_NAME));
  }, []);

  const resetCity = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setCityState(DEFAULT_DELIVERY_CITY);
    window.dispatchEvent(new Event(EVENT_NAME));
  }, []);

  return { city, setCity, resetCity };
};
