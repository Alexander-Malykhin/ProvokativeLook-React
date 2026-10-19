import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import styles from './PhoneInput.module.scss';
import { PHONE_COUNTRIES, detectCountry, editPhoneInput, formatNationalPhone, nationalPhone } from './phone';
type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  selectClassName?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  ariaInvalid?: boolean;
  dataField?: string;
  countryCodes?: readonly string[];
};
type DropdownPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  openUp: boolean;
};
const DROPDOWN_WIDTH = 260;
const DROPDOWN_GAP = 8;
const VIEWPORT_GAP = 12;
const MIN_DROPDOWN_HEIGHT = 160;
const MAX_DROPDOWN_HEIGHT = 330;
const PhoneInput = ({
  value,
  onChange,
  className,
  selectClassName,
  placeholder,
  required,
  disabled,
  ariaInvalid,
  dataField,
  countryCodes,
}: Props) => {
  const [selectedCountry, setCountryIso] = useState(() => detectCountry(value, 'RU'));
  const countryIso = detectCountry(value, selectedCountry);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [caret, setCaret] = useState<number | null>(null);
  useLayoutEffect(() => {
    if (caret !== null && document.activeElement === inputRef.current)
      inputRef.current?.setSelectionRange(caret, caret);
  }, [caret, value]);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const updateDropdownPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const width = Math.min(DROPDOWN_WIDTH, viewportWidth - VIEWPORT_GAP * 2);
    const left = Math.min(
      Math.max(rect.left, VIEWPORT_GAP),
      Math.max(VIEWPORT_GAP, viewportWidth - width - VIEWPORT_GAP),
    );
    const spaceBelow = viewportHeight - rect.bottom - DROPDOWN_GAP - VIEWPORT_GAP;
    const spaceAbove = rect.top - DROPDOWN_GAP - VIEWPORT_GAP;
    const openUp = spaceBelow < MIN_DROPDOWN_HEIGHT && spaceAbove > spaceBelow;
    const availableSpace = Math.max(MIN_DROPDOWN_HEIGHT, openUp ? spaceAbove : spaceBelow);
    const maxHeight = Math.min(MAX_DROPDOWN_HEIGHT, availableSpace);
    const top = openUp
      ? Math.max(VIEWPORT_GAP, rect.top - DROPDOWN_GAP - maxHeight)
      : Math.min(viewportHeight - VIEWPORT_GAP - maxHeight, rect.bottom + DROPDOWN_GAP);
    setDropdownPosition({ top, left, width, maxHeight, openUp });
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    const reposition = () => updateDropdownPosition();
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [isOpen, updateDropdownPosition]);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    const closeByEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener('keydown', closeByEscape);
    return () => document.removeEventListener('keydown', closeByEscape);
  }, [isOpen]);
  const country = useMemo(
    () => PHONE_COUNTRIES.find((item) => item.iso === countryIso) ?? PHONE_COUNTRIES[0],
    [countryIso],
  );
  const changeCountry = (nextIso: string) => {
    const next = PHONE_COUNTRIES.find((item) => item.iso === nextIso) ?? PHONE_COUNTRIES[0];
    const local = nationalPhone(value, countryIso);
    setCountryIso(nextIso);
    setIsOpen(false);
    const nextValue = `+${next.dial}${local}`;

    onChange(next.dial === '7' && detectCountry(nextValue, nextIso) !== nextIso ? '+7' : nextValue);
    triggerRef.current?.focus({ preventScroll: true });
  };
  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = editPhoneInput(
      event.target.value,
      event.target.selectionStart ?? event.target.value.length,
      countryIso,
      formatNationalPhone(value, countryIso),
      (event.nativeEvent as InputEvent).inputType,
    );
    setCountryIso(next.country);
    setCaret(next.caret);
    onChange(next.value);
  };
  const dropdown =
    isOpen && dropdownPosition && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={dropdownRef}
            className={`${styles.phone__dropdown} ${dropdownPosition.openUp ? styles.phone__dropdown_up : ''}`.trim()}
            role="listbox"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              maxHeight: dropdownPosition.maxHeight,
            }}
          >
            {PHONE_COUNTRIES.filter((item) => !countryCodes || countryCodes.includes(item.iso)).map((item) => (
              <button
                key={item.iso}
                type="button"
                role="option"
                aria-selected={item.iso === countryIso}
                className={`${styles.phone__option} ${item.iso === countryIso ? styles.phone__option_active : ''}`.trim()}
                onClick={() => changeCountry(item.iso)}
              >
                <span className={styles.phone__optionName}>{item.name}</span>
                <span className={styles.phone__optionDial}>
                  {item.iso} +{item.dial}
                </span>
              </button>
            ))}
          </div>,
          document.body,
        )
      : null;
  return (
    <>
      <div ref={rootRef} className={styles.phone}>
        <div className={styles.phone__country}>
          <button
            ref={triggerRef}
            type="button"
            className={`${styles.phone__countryButton} ${selectClassName ?? ''}`.trim()}
            onClick={() => {
              if (disabled) return;
              if (!isOpen) updateDropdownPosition();
              setIsOpen((opened) => !opened);
            }}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label="Выбрать страну телефона"
          >
            <span className={styles.phone__countryCode}>
              {country.iso} +{country.dial}
            </span>
            <span
              className={`${styles.phone__arrow} ${isOpen ? styles.phone__arrow_open : ''}`.trim()}
              aria-hidden="true"
            />
          </button>
        </div>

        <input
          ref={inputRef}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          aria-label="Номер телефона без кода страны"
          value={formatNationalPhone(value, countryIso)}
          onChange={handlePhoneChange}
          className={`${styles.phone__input} ${className ?? ''}`.trim()}
          placeholder={placeholder ?? (country.dial === '7' ? '(999) 999-99-99' : 'Номер телефона')}
          required={required}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          data-register-field={dataField}
        />
      </div>

      {dropdown}
    </>
  );
};
export default PhoneInput;
