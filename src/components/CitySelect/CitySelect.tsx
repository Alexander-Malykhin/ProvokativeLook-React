import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import styles from "./CitySelect.module.scss";

export const CITY_OPTIONS = [
  "Ростов-на-Дону",
  "Москва",
  "Санкт-Петербург",
  "Краснодар",
];

interface CitySelectProps {
  value: string;
  onChange: (city: string) => void;
  label?: string;
  uppercase?: boolean;
  className?: string;
}

const CitySelect = ({
  value,
  onChange,
  label = "Доставка в",
  uppercase = false,
  className = "",
}: CitySelectProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [draftCity, setDraftCity] = useState(value);

  useEffect(() => {
    setDraftCity(value);
  }, [value]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);

        if (isCustomMode) {
          const normalized = draftCity.trim();

          if (normalized) {
            onChange(normalized);
          } else {
            setDraftCity(value);
          }

          setIsCustomMode(false);
        }
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [draftCity, isCustomMode, onChange, value]);

  const selectCity = (city: string) => {
    setDraftCity(city);
    setIsCustomMode(false);
    setIsOpen(false);
    onChange(city);
  };

  const openCustomMode = () => {
    setIsOpen(false);
    setIsCustomMode(true);
    setDraftCity("");

    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const commitCustomCity = () => {
    const normalized = draftCity.trim();

    if (!normalized) {
      setDraftCity(value);
      setIsCustomMode(false);
      return;
    }

    setDraftCity(normalized);
    setIsCustomMode(false);
    setIsOpen(false);
    onChange(normalized);
  };

  const handleCustomKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitCustomCity();
    }

    if (event.key === "Escape") {
      setDraftCity(value);
      setIsCustomMode(false);
      setIsOpen(true);
    }
  };

  const visibleValue = uppercase
    ? `г. ${value}`.toLocaleUpperCase("ru-RU")
    : `г. ${value}`;

  return (
    <div ref={rootRef} className={`${styles.city} ${className}`}>
      <span className={styles.city__label}>{label}</span>

      {isCustomMode ? (
        <div className={styles.city__custom}>
          <input
            ref={inputRef}
            className={styles.city__input}
            value={draftCity}
            onChange={(event) => setDraftCity(event.target.value)}
            onKeyDown={handleCustomKeyDown}
            placeholder="Введите город"
            autoComplete="off"
          />

          <button
            type="button"
            className={styles.city__confirm}
            onClick={commitCustomCity}
            aria-label="Выбрать город"
          />
        </div>
      ) : (
        <button
          type="button"
          className={styles.city__trigger}
          onClick={() => setIsOpen((previous) => !previous)}
          aria-expanded={isOpen}
        >
          <span>{visibleValue}</span>
          <span
            className={`${styles.city__arrow} ${isOpen ? styles.city__arrow_open : ""}`}
          />
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
        </div>
      )}
    </div>
  );
};

export default CitySelect;
