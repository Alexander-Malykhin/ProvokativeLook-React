import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import styles from "./CitySelect.module.scss";
import {
  useLazyGeocodeAddressQuery,
  useLazyGetAddressSuggestionsQuery,
} from "@store/api/address/addressApi";
import type { Suggestion } from "@components/blocks/Profile/subpages/ProfileAddresses/model/types";

export const CITY_OPTIONS = [
  "Ростов-на-Дону",
  "Москва",
  "Санкт-Петербург",
  "Краснодар",
];

interface ResolvedCity {
  city: string;
  country: string;
  countryCode: string;
  region: string;
  province: string;
}

interface CitySelectProps {
  value: string;
  onChange: (city: string) => void;
  onResolved?: (data: ResolvedCity) => void;
  label?: string;
  uppercase?: boolean;
  className?: string;
  defaultCity?: string;
  allowReset?: boolean;
}

const CitySelect = ({
  value,
  onChange,
  onResolved,
  label = "Доставка в",
  uppercase = false,
  className = "",
  defaultCity = "Ростов-на-Дону",
  allowReset = true,
}: CitySelectProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef(0);

  const [isOpen, setIsOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [draftCity, setDraftCity] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [getSuggestions, suggestionState] = useLazyGetAddressSuggestionsQuery();
  const [geocode] = useLazyGeocodeAddressQuery();

  useEffect(() => {
    setDraftCity(value);
  }, [value]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setIsSuggestionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (!isCustomMode) return;
    const query = draftCity.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setIsSuggestionOpen(false);
      return;
    }

    const requestId = ++requestRef.current;
    const timer = window.setTimeout(() => {
      void getSuggestions({ query, city: "" })
        .unwrap()
        .then((items) => {
          if (requestRef.current !== requestId) return;
          setSuggestions(items);
          setIsSuggestionOpen(true);
        })
        .catch(() => {
          if (requestRef.current !== requestId) return;
          setSuggestions([]);
          setIsSuggestionOpen(true);
        });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [draftCity, getSuggestions, isCustomMode]);

  const selectCity = (city: string) => {
    setDraftCity(city);
    setIsCustomMode(false);
    setIsOpen(false);
    setIsSuggestionOpen(false);
    onChange(city);
  };

  const selectSuggestion = async (suggestion: Suggestion) => {
    try {
      const result = await geocode({ geocode: suggestion.fullText, results: 1 }).unwrap();
      const resolved = result[0];
      const city = resolved?.city?.trim() || suggestion.title.trim();
      if (!city) return;

      selectCity(city);
      if (resolved) {
        onResolved?.({
          city,
          country: resolved.country,
          countryCode: resolved.countryCode,
          region: resolved.region,
          province: resolved.province,
        });
      }
    } catch {
      selectCity(suggestion.title.trim());
    }
  };

  const openCustomMode = () => {
    setIsOpen(false);
    setIsCustomMode(true);
    setDraftCity("");
    setSuggestions([]);
    setIsSuggestionOpen(false);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const cancelCustomMode = () => {
    requestRef.current += 1;
    setDraftCity(value);
    setSuggestions([]);
    setIsSuggestionOpen(false);
    setIsCustomMode(false);
    setIsOpen(true);
  };

  const handleCustomKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const first = suggestions[0];
      if (first) void selectSuggestion(first);
    }
    if (event.key === "Escape") cancelCustomMode();
  };

  const reset = () => {
    selectCity(defaultCity);
  };

  const visibleValue = uppercase
    ? `г. ${value || defaultCity}`.toLocaleUpperCase("ru-RU")
    : `г. ${value || defaultCity}`;

  const canReset = useMemo(
    () => allowReset && (value || defaultCity) !== defaultCity,
    [allowReset, defaultCity, value],
  );

  return (
    <div ref={rootRef} className={`${styles.city} ${className}`}>
      {label && <span className={styles.city__label}>{label}</span>}

      {isCustomMode ? (
        <div className={styles.city__customWrap}>
          <div className={styles.city__custom}>
            <input
              ref={inputRef}
              className={styles.city__input}
              value={draftCity}
              onChange={(event) => setDraftCity(event.target.value)}
              onKeyDown={handleCustomKeyDown}
              placeholder="Начните вводить город"
              autoComplete="off"
            />
            {draftCity && (
              <button
                type="button"
                className={styles.city__clear}
                onClick={() => setDraftCity("")}
                aria-label="Очистить"
              />
            )}
          </div>

          {isSuggestionOpen && (
            <div className={styles.city__suggestions}>
              {suggestionState.isFetching && (
                <div className={styles.city__hint}>Ищем города...</div>
              )}
              {!suggestionState.isFetching && suggestions.length === 0 && (
                <div className={styles.city__hint}>Город не найден</div>
              )}
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.city__suggestion}
                  onClick={() => void selectSuggestion(item)}
                >
                  <span>{item.title}</span>
                  {item.subtitle && <small>{item.subtitle}</small>}
                </button>
              ))}
            </div>
          )}

          <button type="button" className={styles.city__cancel} onClick={cancelCustomMode}>
            Назад к списку
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={styles.city__trigger}
          onClick={() => setIsOpen((previous) => !previous)}
          aria-expanded={isOpen}
        >
          <span>{visibleValue}</span>
          <span className={`${styles.city__arrow} ${isOpen ? styles.city__arrow_open : ""}`} />
        </button>
      )}

      {isOpen && !isCustomMode && (
        <div className={styles.city__menu} role="listbox">
          {CITY_OPTIONS.map((city) => (
            <button
              key={city}
              type="button"
              className={`${styles.city__option} ${city === value ? styles.city__option_active : ""}`}
              onClick={() => selectCity(city)}
              role="option"
              aria-selected={city === value}
            >
              {city}
            </button>
          ))}

          <button
            type="button"
            className={`${styles.city__option} ${styles.city__option_other}`}
            onClick={openCustomMode}
          >
            Другой город...
          </button>

          {canReset && (
            <button
              type="button"
              className={`${styles.city__option} ${styles.city__option_reset}`}
              onClick={reset}
            >
              Сбросить: {defaultCity}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySelect;
