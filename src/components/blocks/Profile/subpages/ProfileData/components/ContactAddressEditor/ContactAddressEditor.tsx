import { useEffect, useMemo, useRef, useState } from "react";
import { YANDEX_MAPS_API_KEY } from "@/config/env";
import {
  useLazyGeocodeAddressQuery,
  useLazyGetAddressSuggestionsQuery,
} from "@store/api/address/addressApi";
import type { ProfileAddress, ParsedAddress, Suggestion } from "@components/blocks/Profile/subpages/ProfileAddresses/model/types";
import { useAddressMap } from "@components/blocks/Profile/subpages/ProfileAddresses/hooks/useAddressMap";
import styles from "./ContactAddressEditor.module.scss";

interface ContactAddressEditorProps {
  city: string;
  value: ProfileAddress | null;
  onChange: (address: ProfileAddress) => void;
}

const toParsed = (address: ProfileAddress | null): ParsedAddress | null => {
  if (!address || !address.latitude || !address.longitude) return null;
  return {
    formattedAddress: address.formattedAddress,
    address1: address.address1,
    city: address.city,
    postalCode: address.postalCode,
    region: address.region,
    province: address.province,
    country: address.country,
    countryCode: address.countryCode,
    latitude: address.latitude,
    longitude: address.longitude,
    hasHouse: true,
    kind: "house",
  };
};

const toProfile = (parsed: ParsedAddress): ProfileAddress => ({
  id: 0,
  title: parsed.address1 || parsed.formattedAddress,
  formattedAddress: parsed.formattedAddress,
  address1: parsed.address1,
  address2: "",
  city: parsed.city,
  region: parsed.region,
  province: parsed.province,
  country: parsed.country,
  countryId: 0,
  countryCode: parsed.countryCode,
  postalCode: parsed.postalCode,
  entrance: "",
  floor: "",
  apartment: "",
  comment: "",
  isDefault: false,
  latitude: parsed.latitude,
  longitude: parsed.longitude,
});

const ContactAddressEditor = ({ city, value, onChange }: ContactAddressEditorProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(value?.formattedAddress || value?.address1 || "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selected, setSelected] = useState<ParsedAddress | null>(() => toParsed(value));
  const [error, setError] = useState("");
  const [getSuggestions] = useLazyGetAddressSuggestionsQuery();
  const [geocode] = useLazyGeocodeAddressQuery();

  useEffect(() => {
    setQuery(value?.formattedAddress || value?.address1 || "");
    setSelected(toParsed(value));
  }, [value?.formattedAddress, value?.latitude, value?.longitude]);

  useEffect(() => {
    const current = value?.formattedAddress || value?.address1 || "";
    if (!current || selected || (value?.latitude && value?.longitude)) return;
    void geocode({ geocode: current, results: 1 })
      .unwrap()
      .then((items) => {
        if (items[0]) setSelected(items[0]);
      })
      .catch(() => undefined);
  }, [geocode, selected, value?.address1, value?.formattedAddress, value?.latitude, value?.longitude]);

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length < 2 || selected) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void getSuggestions({ city, query: normalized })
        .unwrap()
        .then((items) => { if (!cancelled) setSuggestions(items.slice(0, 8)); })
        .catch(() => { if (!cancelled) setSuggestions([]); });
    }, 250);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [city, getSuggestions, query, selected]);

  const applyResolved = async (geocodeValue: string) => {
    try {
      const items = await geocode({ geocode: geocodeValue, results: 1 }).unwrap();
      const resolved = items[0];
      if (!resolved) throw new Error();
      setSelected(resolved);
      setQuery(resolved.formattedAddress || resolved.address1);
      setSuggestions([]);
      setError("");
      onChange(toProfile(resolved));
    } catch {
      setError("Не удалось определить адрес");
    }
  };

  const mapSelected = useMemo(() => selected, [selected]);
  const { isLoading } = useAddressMap({
    containerRef: mapContainerRef,
    enabled: true,
    apiKey: YANDEX_MAPS_API_KEY,
    city,
    selectedAddress: mapSelected,
    onSelect: ([lat, lon]) => { void applyResolved(`${lon},${lat}`); },
    onError: setError,
  });

  return (
    <div className={styles.editor}>
      <div className={styles.editor__search}>
        <input
          value={query}
          placeholder="Введите полный адрес"
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(null);
            setError("");
          }}
        />
        {suggestions.length > 0 && (
          <div className={styles.editor__suggestions}>
            {suggestions.map((suggestion) => (
              <button key={suggestion.id} type="button" onClick={() => void applyResolved(suggestion.fullText)}>
                <span>{suggestion.title}</span>
                <small>{suggestion.subtitle}</small>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={styles.editor__map}>
        <div ref={mapContainerRef} className={styles.editor__mapCanvas} />
        {isLoading && <span>Загрузка карты…</span>}
      </div>
      {value?.postalCode && <div className={styles.editor__meta}>Индекс: {value.postalCode}</div>}
      {error && <div className={styles.editor__error}>{error}</div>}
    </div>
  );
};

export default ContactAddressEditor;
