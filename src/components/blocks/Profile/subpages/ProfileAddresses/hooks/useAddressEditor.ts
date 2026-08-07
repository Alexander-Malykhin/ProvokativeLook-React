import { useCallback, useEffect, useRef, useState } from "react";

import {
  useLazyGeocodeAddressQuery,
  useLazyGetAddressSuggestionsQuery,
} from "@store/api/address/addressApi";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";
import { INITIAL_ADDRESS_FORM, SEARCH_DELAY } from "../model/constants";
import type {
  AddressFormState,
  Coordinates,
  MobileStep,
  ParsedAddress,
  ProfileAddress,
  Suggestion,
} from "../model/types";

export const useAddressEditor = (isMobile: boolean) => {
  const requestIdRef = useRef(0);
  const [form, setForm] = useState<AddressFormState>(INITIAL_ADDRESS_FORM);
  const [selectedAddress, setSelectedAddress] = useState<ParsedAddress | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAddressListOpen, setIsAddressListOpen] = useState(false);
  const [mobileStep, setMobileStep] = useState<MobileStep>("map");
  const [error, setError] = useState("");

  const [getSuggestions, suggestionsState] =
    useLazyGetAddressSuggestionsQuery();
  const [geocode, geocodeState] = useLazyGeocodeAddressQuery();

  const updateField = useCallback(
    <Key extends keyof AddressFormState>(
      key: Key,
      value: AddressFormState[Key],
    ) => {
      setForm((previous) => ({ ...previous, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setForm(INITIAL_ADDRESS_FORM);
    setSelectedAddress(null);
    setQuery("");
    setSuggestions([]);
    setIsAddressListOpen(false);
    setMobileStep("map");
    setError("");
  }, []);

  const applyAddress = useCallback(
    (address: ParsedAddress) => {
      setSelectedAddress(address);
      setQuery(address.address1 || address.formattedAddress);
      setSuggestions([]);
      setIsAddressListOpen(false);
      setError("");
      setForm((previous) => ({
        ...previous,
        formattedAddress: address.formattedAddress,
        address1: address.address1,
        city: address.city || previous.city,
        region: address.region,
        province: address.province,
        country: address.country || previous.country,
        countryCode: address.countryCode || previous.countryCode,
        postalCode: address.postalCode,
        latitude: address.latitude,
        longitude: address.longitude,
      }));

      if (isMobile) {
        setMobileStep("selected");
      }
    },
    [isMobile],
  );

  const resolveAddress = useCallback(
    async (geocodeValue: string) => {
      try {
        const result = await geocode({
          geocode: geocodeValue,
          results: 1,
        }).unwrap();
        const address = result[0];

        if (!address) {
          throw new Error("Геокодер не нашёл адрес");
        }

        applyAddress(address);
      } catch (requestError) {
        setError(
          getRequestErrorMessage(requestError, "Не удалось определить адрес"),
        );
      }
    },
    [applyAddress, geocode],
  );

  const reverseGeocode = useCallback(
    (coordinates: Coordinates) => {
      setIsAddressListOpen(false);
      setSuggestions([]);
      setError("");

      return resolveAddress(`${coordinates[1]},${coordinates[0]}`);
    },
    [resolveAddress],
  );

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2 || !form.city.trim() || selectedAddress) {
      setSuggestions([]);

      if (selectedAddress || normalizedQuery.length < 2) {
        setIsAddressListOpen(false);
      }

      return;
    }

    const requestId = ++requestIdRef.current;
    const timer = window.setTimeout(() => {
      setError("");

      void getSuggestions({
        city: form.city,
        query: normalizedQuery,
      })
        .unwrap()
        .then((result) => {
          if (requestId !== requestIdRef.current) {
            return;
          }

          setSuggestions(result);
          setIsAddressListOpen(true);
        })
        .catch((requestError) => {
          if (requestId !== requestIdRef.current) {
            return;
          }

          setSuggestions([]);
          setIsAddressListOpen(true);
          setError(
            getRequestErrorMessage(
              requestError,
              "Не удалось получить подсказки",
            ),
          );
        });
    }, SEARCH_DELAY);

    return () => window.clearTimeout(timer);
  }, [form.city, getSuggestions, query, selectedAddress]);

  const selectCity = useCallback((city: string) => {
    requestIdRef.current += 1;
    setForm((previous) => ({
      ...previous,
      city,
      formattedAddress: "",
      address1: "",
      region: "",
      province: "",
      postalCode: "",
      latitude: 0,
      longitude: 0,
    }));
    setSelectedAddress(null);
    setQuery("");
    setSuggestions([]);
    setIsAddressListOpen(false);
    setError("");
    setMobileStep("map");
  }, []);

  const selectSuggestion = useCallback(
    async (suggestion: Suggestion) => {
      requestIdRef.current += 1;
      setError("");
      await resolveAddress(suggestion.fullText);
    },
    [resolveAddress],
  );

  const changeQuery = useCallback(
    (value: string) => {
      setQuery(value);
      setIsAddressListOpen(value.trim().length >= 2);
      setSelectedAddress(null);
      setForm((previous) => ({
        ...previous,
        formattedAddress: "",
        address1: "",
        latitude: 0,
        longitude: 0,
      }));

      if (isMobile) {
        setMobileStep("search");
      }
    },
    [isMobile],
  );

  const clearSearch = useCallback(() => {
    requestIdRef.current += 1;
    setQuery("");
    setSuggestions([]);
    setIsAddressListOpen(false);
    setSelectedAddress(null);
    setError("");
    setMobileStep("map");
    setForm((previous) => ({
      ...previous,
      formattedAddress: "",
      address1: "",
      region: "",
      province: "",
      postalCode: "",
      latitude: 0,
      longitude: 0,
    }));
  }, []);

  const createAddress = useCallback((): ProfileAddress | null => {
    if (!selectedAddress || !form.latitude || !form.longitude) {
      setError("Выберите адрес из списка или отметьте точку на карте");
      return null;
    }

    const address2 = [
      form.entrance.trim() ? `Подъезд ${form.entrance.trim()}` : "",
      form.floor.trim() ? `этаж ${form.floor.trim()}` : "",
      form.apartment.trim() ? `квартира ${form.apartment.trim()}` : "",
    ]
      .filter(Boolean)
      .join(", ");

    return {
      id: Date.now(),
      title: form.address1 || form.formattedAddress,
      formattedAddress: form.formattedAddress,
      address1: form.address1,
      address2,
      city: form.city,
      region: form.region,
      province: form.province,
      country: form.country,
      countryCode: form.countryCode,
      postalCode: form.postalCode,
      entrance: form.entrance.trim(),
      floor: form.floor.trim(),
      apartment: form.apartment.trim(),
      comment: form.comment.trim(),
      isDefault: form.isDefault,
      latitude: form.latitude,
      longitude: form.longitude,
    };
  }, [form, selectedAddress]);

  return {
    form,
    selectedAddress,
    query,
    suggestions,
    isAddressListOpen,
    mobileStep,
    error,
    isSearching: suggestionsState.isFetching || geocodeState.isFetching,
    setMobileStep,
    setIsAddressListOpen,
    setError,
    updateField,
    reset,
    reverseGeocode,
    selectCity,
    selectSuggestion,
    changeQuery,
    clearSearch,
    createAddress,
  };
};

export type AddressEditor = ReturnType<typeof useAddressEditor>;
