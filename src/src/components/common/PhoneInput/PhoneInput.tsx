import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./PhoneInput.module.scss";
import { PHONE_COUNTRIES, detectCountry, formatPhone, normalizePhone, } from "./phone";
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
const PhoneInput = ({ value, onChange, className, selectClassName, placeholder = "+7 (999) 999-99-99", required, disabled, ariaInvalid, dataField, }: Props) => {
    const [countryIso, setCountryIso] = useState(() => detectCountry(value, "RU"));
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (value)
            setCountryIso(detectCountry(value, countryIso));
    }, [value]);
    const updateDropdownPosition = () => {
        const trigger = triggerRef.current;
        if (!trigger)
            return;
        const rect = trigger.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const width = Math.min(DROPDOWN_WIDTH, viewportWidth - VIEWPORT_GAP * 2);
        const left = Math.min(Math.max(rect.left, VIEWPORT_GAP), Math.max(VIEWPORT_GAP, viewportWidth - width - VIEWPORT_GAP));
        const spaceBelow = viewportHeight - rect.bottom - DROPDOWN_GAP - VIEWPORT_GAP;
        const spaceAbove = rect.top - DROPDOWN_GAP - VIEWPORT_GAP;
        const openUp = spaceBelow < MIN_DROPDOWN_HEIGHT && spaceAbove > spaceBelow;
        const availableSpace = Math.max(MIN_DROPDOWN_HEIGHT, openUp ? spaceAbove : spaceBelow);
        const maxHeight = Math.min(MAX_DROPDOWN_HEIGHT, availableSpace);
        const top = openUp
            ? Math.max(VIEWPORT_GAP, rect.top - DROPDOWN_GAP - maxHeight)
            : Math.min(viewportHeight - VIEWPORT_GAP - maxHeight, rect.bottom + DROPDOWN_GAP);
        setDropdownPosition({ top, left, width, maxHeight, openUp });
    };
    useEffect(() => {
        if (!isOpen) {
            setDropdownPosition(null);
            return;
        }
        updateDropdownPosition();
        const reposition = () => updateDropdownPosition();
        window.addEventListener("resize", reposition);
        window.addEventListener("scroll", reposition, true);
        return () => {
            window.removeEventListener("resize", reposition);
            window.removeEventListener("scroll", reposition, true);
        };
    }, [isOpen]);
    useEffect(() => {
        const close = (event: MouseEvent) => {
            const target = event.target as Node;
            if (!rootRef.current?.contains(target) &&
                !dropdownRef.current?.contains(target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);
    useEffect(() => {
        if (!isOpen)
            return;
        const closeByEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                triggerRef.current?.focus({ preventScroll: true });
            }
        };
        document.addEventListener("keydown", closeByEscape);
        return () => document.removeEventListener("keydown", closeByEscape);
    }, [isOpen]);
    const country = useMemo(() => PHONE_COUNTRIES.find((item) => item.iso === countryIso) ?? PHONE_COUNTRIES[0], [countryIso]);
    const changeCountry = (nextIso: string) => {
        const next = PHONE_COUNTRIES.find((item) => item.iso === nextIso) ?? PHONE_COUNTRIES[0];
        const current = PHONE_COUNTRIES.find((item) => item.iso === countryIso) ?? PHONE_COUNTRIES[0];
        const digits = value.replace(/\D/g, "");
        const local = digits.startsWith(current.dial) ? digits.slice(current.dial.length) : digits;
        setCountryIso(nextIso);
        setIsOpen(false);
        onChange(normalizePhone(`${next.dial}${local}`, nextIso));
        triggerRef.current?.focus({ preventScroll: true });
    };
    const handlePhoneChange = (raw: string) => {
        const explicitInternational = raw.trim().startsWith("+");
        const detected = explicitInternational ? detectCountry(raw, countryIso) : countryIso;
        if (explicitInternational && detected !== countryIso) {
            setCountryIso(detected);
        }
        onChange(normalizePhone(raw, detected));
    };
    const dropdown = isOpen && dropdownPosition && typeof document !== "undefined"
        ? createPortal(<div ref={dropdownRef} className={`${styles.phone__dropdown} ${dropdownPosition.openUp ? styles.phone__dropdown_up : ""}`.trim()} role="listbox" style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight: dropdownPosition.maxHeight,
            }}>
            {PHONE_COUNTRIES.map((item) => (<button key={item.iso} type="button" role="option" aria-selected={item.iso === countryIso} className={`${styles.phone__option} ${item.iso === countryIso ? styles.phone__option_active : ""}`.trim()} onClick={() => changeCountry(item.iso)}>
                <span className={styles.phone__optionName}>{item.name}</span>
                <span className={styles.phone__optionDial}>
                  {item.iso} +{item.dial}
                </span>
              </button>))}
          </div>, document.body)
        : null;
    return (<>
      <div ref={rootRef} className={styles.phone}>
        <div className={styles.phone__country}>
          <button ref={triggerRef} type="button" className={`${styles.phone__countryButton} ${selectClassName ?? ""}`.trim()} onClick={() => {
            if (disabled)
                return;
            setIsOpen((opened) => !opened);
        }} disabled={disabled} aria-haspopup="listbox" aria-expanded={isOpen} aria-label="Выбрать страну телефона">
            <span className={styles.phone__countryCode}>
              {country.iso} +{country.dial}
            </span>
            <span className={`${styles.phone__arrow} ${isOpen ? styles.phone__arrow_open : ""}`.trim()} aria-hidden="true"/>
          </button>
        </div>

        <input type="tel" inputMode="tel" autoComplete="tel" value={formatPhone(value)} onChange={(event) => handlePhoneChange(event.target.value)} className={`${styles.phone__input} ${className ?? ""}`.trim()} placeholder={placeholder} required={required} disabled={disabled} aria-invalid={ariaInvalid} data-register-field={dataField}/>
      </div>

      {dropdown}
    </>);
};
export default PhoneInput;

