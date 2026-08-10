import { useEffect, useRef, useState } from "react";

import styles from "./AddressCitySelect.module.scss";
import { ADDRESS_CITIES } from "../../model/constants.ts";
import {
  useLazyGeocodeAddressQuery,
  useLazyGetAddressSuggestionsQuery,
} from "@store/api/address/addressApi";
import type { ParsedAddress, Suggestion } from "../../model/types";

interface AddressCitySelectProps {
  value: string;
  defaultCity?: string;
  onChange: (city: string, resolved?: ParsedAddress) => void;
}

const AddressCitySelect = ({
  value,
  defaultCity = "Ростов-на-Дону",
  onChange,
}: AddressCitySelectProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [getSuggestions, suggestionState] = useLazyGetAddressSuggestionsQuery();
  const [geocode] = useLazyGeocodeAddressQuery();

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCustom(false);
        setSuggestions([]);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (!isCustom || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const requestId = ++requestRef.current;
    const timer = window.setTimeout(() => {
      void getSuggestions({ city: "", query: query.trim() })
        .unwrap()
        .then((items) => {
          if (requestId !== requestRef.current) return;
          setSuggestions(items);
        })
        .catch(() => {
          if (requestId !== requestRef.current) return;
          setSuggestions([]);
        });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [getSuggestions, isCustom, query]);

  const selectCity = (city: string, resolved?: ParsedAddress) => {
    onChange(city, resolved);
    setIsOpen(false);
    setIsCustom(false);
    setQuery("");
    setSuggestions([]);
  };

  const selectSuggestion = async (suggestion: Suggestion) => {
    try {
      const result = await geocode({ geocode: suggestion.fullText, results: 1 }).unwrap();
      const resolved = result[0];
      const city = resolved?.city?.trim() || suggestion.title.trim();
      if (city) selectCity(city, resolved);
    } catch {
      selectCity(suggestion.title.trim());
    }
  };

  const startCustom = () => {
    setIsOpen(false);
    setIsCustom(true);
    setQuery("");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div ref={rootRef} className={styles.city}>
      {isCustom ? (
        <div className={styles.city__customWrap}>
          <div className={styles.city__customInputWrap}>
            <input
              ref={inputRef}
              value={query}
              className={styles.city__input}
              placeholder="Начните вводить город"
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className={styles.city__clear}
                aria-label="Очистить"
                onClick={() => setQuery("")}
              />
            )}
          </div>

          <div className={styles.city__customList}>
            {suggestionState.isFetching && (
              <div className={styles.city__hint}>Ищем города...</div>
            )}
            {!suggestionState.isFetching && query.trim().length >= 2 && suggestions.length === 0 && (
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

          <button
            type="button"
            className={styles.city__back}
            onClick={() => {
              setIsCustom(false);
              setIsOpen(true);
              setQuery("");
              setSuggestions([]);
            }}
          >
            Назад к списку
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={styles.city__header}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className={styles.city__value}>г. {value || defaultCity}</span>
          <span
            aria-hidden="true"
            className={`${styles.city__arrow} ${isOpen ? styles.city__arrow_open : ""}`}
          />
        </button>
      )}

      {isOpen && !isCustom && (
        <div role="listbox" className={styles.city__list}>
          {ADDRESS_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              role="option"
              aria-selected={value === city}
              className={`${styles.city__item} ${value === city ? styles.city__item_active : ""}`}
              onClick={() => selectCity(city)}
            >
              {city}
            </button>
          ))}

          <button
            type="button"
            className={`${styles.city__item} ${styles.city__item_other}`}
            onClick={startCustom}
          >
            Другой город...
          </button>

          {value !== defaultCity && (
            <button
              type="button"
              className={`${styles.city__item} ${styles.city__item_reset}`}
              onClick={() => selectCity(defaultCity)}
            >
              Сбросить: {defaultCity}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressCitySelect;
