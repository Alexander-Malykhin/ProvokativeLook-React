import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./BirthdayPicker.module.scss";

interface BirthdayPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const parseBirthday = (value: string): Date | null => {
  const match = value.match(/^(\d{2})[./](\d{2})[./](\d{4})$/);
  if (!match) return null;

  const date = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatBirthday = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
};

const displayBirthday = (value: string): string => {
  const parsed = parseBirthday(value);
  if (!parsed) return "Не указана";

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  return `${day} / ${month} / ${parsed.getFullYear()}`;
};

interface PickerSelectProps {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const PickerSelect = ({ label, open, onToggle, children }: PickerSelectProps) => (
  <div className={styles.picker__selectWrap}>
    <button
      type="button"
      className={`${styles.picker__selectButton} ${open ? styles.picker__selectButton_open : ""}`}
      onClick={onToggle}
      aria-expanded={open}
    >
      <span>{label}</span>
      <span className={styles.picker__selectChevron} />
    </button>
    {open && <div className={styles.picker__selectMenu}>{children}</div>}
  </div>
);

const BirthdayPicker = ({ value, onChange, disabled = false }: BirthdayPickerProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = useMemo(() => parseBirthday(value), [value]);
  const today = useMemo(() => new Date(), []);
  const initial = selected ?? new Date(today.getFullYear() - 25, today.getMonth(), 1);

  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(initial.getMonth());
  const [year, setYear] = useState(initial.getFullYear());
  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setMonthOpen(false);
        setYearOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setMonthOpen(false);
        setYearOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!selected) return;
    setMonth(selected.getMonth());
    setYear(selected.getFullYear());
  }, [selected?.getTime()]);

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells = Array.from({ length: 42 }, (_, index) => {
    const day = index - startOffset + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });

  const minYear = today.getFullYear() - 100;
  const maxYear = today.getFullYear();
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, index) => maxYear - index);

  const changeMonth = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    if (next.getFullYear() > today.getFullYear()) return;
    if (next.getFullYear() === today.getFullYear() && next.getMonth() > today.getMonth()) return;
    setMonth(next.getMonth());
    setYear(next.getFullYear());
    setMonthOpen(false);
    setYearOpen(false);
  };

  const chooseDay = (day: number) => {
    const date = new Date(year, month, day);
    if (date.getTime() > today.getTime()) return;
    onChange(formatBirthday(date));
    setOpen(false);
    setMonthOpen(false);
    setYearOpen(false);
  };

  const chooseMonth = (nextMonth: number) => {
    setMonth(nextMonth);
    setMonthOpen(false);
    setYearOpen(false);
  };

  const chooseYear = (nextYear: number) => {
    setYear(nextYear);
    if (nextYear === today.getFullYear() && month > today.getMonth()) {
      setMonth(today.getMonth());
    }
    setYearOpen(false);
    setMonthOpen(false);
  };

  return (
    <div ref={rootRef} className={styles.picker}>
      <button
        type="button"
        className={styles.picker__control}
        disabled={disabled}
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
          setMonthOpen(false);
          setYearOpen(false);
        }}
      >
        <span>{displayBirthday(value)}</span>
        <span className={styles.picker__icon} aria-hidden="true" />
      </button>

      {open && (
        <div className={styles.picker__calendar} role="dialog" aria-label="Выбор даты рождения">
          <div className={styles.picker__header}>
            <button
              type="button"
              className={styles.picker__arrow}
              onClick={() => changeMonth(-1)}
              aria-label="Предыдущий месяц"
            />

            <div className={styles.picker__selects}>
              <PickerSelect
                label={MONTHS[month]}
                open={monthOpen}
                onToggle={() => {
                  setMonthOpen((current) => !current);
                  setYearOpen(false);
                }}
              >
                {MONTHS.map((label, index) => {
                  const isDisabled = year === today.getFullYear() && index > today.getMonth();
                  return (
                    <button
                      key={label}
                      type="button"
                      disabled={isDisabled}
                      className={`${styles.picker__selectOption} ${index === month ? styles.picker__selectOption_active : ""}`}
                      onClick={() => chooseMonth(index)}
                    >
                      {label}
                    </button>
                  );
                })}
              </PickerSelect>

              <PickerSelect
                label={String(year)}
                open={yearOpen}
                onToggle={() => {
                  setYearOpen((current) => !current);
                  setMonthOpen(false);
                }}
              >
                {years.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`${styles.picker__selectOption} ${item === year ? styles.picker__selectOption_active : ""}`}
                    onClick={() => chooseYear(item)}
                  >
                    {item}
                  </button>
                ))}
              </PickerSelect>
            </div>

            <button
              type="button"
              className={`${styles.picker__arrow} ${styles.picker__arrow_next}`}
              onClick={() => changeMonth(1)}
              aria-label="Следующий месяц"
            />
          </div>

          <div className={styles.picker__weekdays}>
            {WEEK_DAYS.map((day) => <span key={day}>{day}</span>)}
          </div>

          <div className={styles.picker__days}>
            {cells.map((day, index) => {
              if (!day) return <span key={`empty-${index}`} />;

              const current = new Date(year, month, day);
              const isFuture = current.getTime() > today.getTime();
              const isSelected = Boolean(
                selected
                && selected.getFullYear() === year
                && selected.getMonth() === month
                && selected.getDate() === day,
              );

              return (
                <button
                  key={`${year}-${month}-${day}`}
                  type="button"
                  disabled={isFuture}
                  className={`${styles.picker__day} ${isSelected ? styles.picker__day_active : ""}`}
                  onClick={() => chooseDay(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className={styles.picker__footer}>
            <button type="button" onClick={() => { onChange(""); setOpen(false); }}>Очистить</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayPicker;
