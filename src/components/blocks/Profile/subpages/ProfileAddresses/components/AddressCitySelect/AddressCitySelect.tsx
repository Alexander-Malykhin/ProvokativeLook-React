import { useEffect, useRef, useState } from "react";

import styles from "./AddressCitySelect.module.scss";
import { ADDRESS_CITIES } from "../../model/constants.ts";

interface AddressCitySelectProps {
  value: string;
  onChange: (city: string) => void;
}

const AddressCitySelect = ({ value, onChange }: AddressCitySelectProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  const selectCity = (city: string) => {
    onChange(city);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={styles.city}>
      <button
        type="button"
        className={styles.city__header}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={styles.city__value}>г. {value}</span>
        <span
          aria-hidden="true"
          className={`${styles.city__arrow} ${
            isOpen ? styles.city__arrow_open : ""
          }`}
        />
      </button>

      {isOpen && (
        <div role="listbox" className={styles.city__list}>
          {ADDRESS_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              role="option"
              aria-selected={value === city}
              className={`${styles.city__item} ${
                value === city ? styles.city__item_active : ""
              }`}
              onClick={() => selectCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressCitySelect;
