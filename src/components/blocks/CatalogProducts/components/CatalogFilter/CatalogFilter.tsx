import { useEffect, useMemo, useState } from 'react';

import styles from './CatalogFilter.module.scss';

import ArrowImage from '@assets/arrows/arrow-shevron-bottom.svg';
import Image from '@UI/buttons/Image/Image.tsx';

import { useAppDispatch } from '@store/hooks.ts';
import { close } from '@store/slices/toggleFIlterSlice';
import type {
  CatalogFilterOptions,
  CatalogFilters,
  CatalogSort,
} from '@store/api/catalog/types';

const EMPTY_FILTERS: CatalogFilters = {
  sizes: [],
  colors: [],
  minPrice: null,
  maxPrice: null,
};

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 15000;

const EMPTY_OPTIONS: CatalogFilterOptions = {
  sizes: [],
  colors: [],
  price: {
    min: DEFAULT_MIN_PRICE,
    max: DEFAULT_MAX_PRICE,
  },
};

type FilterSection = 'size' | 'color' | 'price' | 'sort';

type CatalogFilterProps = {
  productsCount?: number;
  options?: CatalogFilterOptions;
  value?: CatalogFilters;
  sort?: CatalogSort;
  onChange?: (filters: CatalogFilters) => void;
  onSortChange?: (sort: CatalogSort) => void;
  onReset?: () => void;
};

const COLOR_MAP: Record<string, string> = {
  Синий: '#2517e6',
  Голубой: '#24a5dc',
  Серый: '#978787',
  Белый: '#fff4f4',
  Черный: '#000000',
  Чёрный: '#000000',
  Бежевый: '#e6c5a7',
  Красный: '#ae0000',
  Розовый: '#ed5ad1',
  Зеленый: '#3b934e',
  Зелёный: '#3b934e',
};

const SORT_OPTIONS: Array<{ value: CatalogSort; title: string }> = [
  { value: 'popular', title: 'По популярности' },
  { value: 'new', title: 'По новизне' },
  { value: 'priceAsc', title: 'По возрастанию цены' },
  { value: 'priceDesc', title: 'По убыванию цены' },
];

const CatalogFilter = ({
  productsCount = 0,
  options = EMPTY_OPTIONS,
  value = EMPTY_FILTERS,
  sort = 'popular',
  onChange,
  onSortChange,
  onReset,
}: CatalogFilterProps) => {
  const dispatch = useAppDispatch();

  const safeOptions: CatalogFilterOptions = {
    sizes: Array.isArray(options?.sizes) ? options.sizes : [],
    colors: Array.isArray(options?.colors) ? options.colors : [],
    price: {
      min: options?.price?.min ?? null,
      max: options?.price?.max ?? null,
    },
  };

  const safeValue: CatalogFilters = {
    sizes: Array.isArray(value?.sizes) ? value.sizes : [],
    colors: Array.isArray(value?.colors) ? value.colors : [],
    minPrice: value?.minPrice ?? null,
    maxPrice: value?.maxPrice ?? null,
  };

  const [openedSections, setOpenedSections] = useState<Record<FilterSection, boolean>>({
    size: true,
    color: true,
    price: true,
    sort: true,
  });

  const realMinPrice = safeOptions.price.min ?? DEFAULT_MIN_PRICE;
  const apiMaxPrice = safeOptions.price.max ?? DEFAULT_MAX_PRICE;
  const realMaxPrice =
    apiMaxPrice > realMinPrice
      ? apiMaxPrice
      : Math.max(realMinPrice + 1, DEFAULT_MAX_PRICE);
  const hasPriceRange = true;

  const [minInput, setMinInput] = useState(
    safeValue.minPrice !== null ? String(safeValue.minPrice) : '',
  );
  const [maxInput, setMaxInput] = useState(
    safeValue.maxPrice !== null ? String(safeValue.maxPrice) : '',
  );

  useEffect(() => {
    setMinInput(safeValue.minPrice !== null ? String(safeValue.minPrice) : '');
  }, [safeValue.minPrice]);

  useEffect(() => {
    setMaxInput(safeValue.maxPrice !== null ? String(safeValue.maxPrice) : '');
  }, [safeValue.maxPrice]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(close());
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

  const effectiveMin = safeValue.minPrice ?? realMinPrice;
  const effectiveMax = safeValue.maxPrice ?? realMaxPrice;
  const rangeLength = Math.max(realMaxPrice - realMinPrice, 1);

  const minPercent = useMemo(() => {
    const valuePercent = ((effectiveMin - realMinPrice) / rangeLength) * 100;
    return Math.min(100, Math.max(0, valuePercent));
  }, [effectiveMin, realMinPrice, rangeLength]);

  const maxPercent = useMemo(() => {
    const valuePercent = ((effectiveMax - realMinPrice) / rangeLength) * 100;
    return Math.min(100, Math.max(0, valuePercent));
  }, [effectiveMax, realMinPrice, rangeLength]);

  const emitChange = (next: CatalogFilters) => onChange?.(next);

  const toggleSection = (section: FilterSection) => {
    setOpenedSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  const toggleSize = (size: string) => {
    const sizes = safeValue.sizes.includes(size)
      ? safeValue.sizes.filter((item) => item !== size)
      : [...safeValue.sizes, size];

    emitChange({ ...safeValue, sizes });
  };

  const toggleColor = (color: string) => {
    const colors = safeValue.colors.includes(color)
      ? safeValue.colors.filter((item) => item !== color)
      : [...safeValue.colors, color];

    emitChange({ ...safeValue, colors });
  };

  const handleMinInputChange = (raw: string) => {
    setMinInput(raw);

    if (raw.trim() === '') {
      emitChange({ ...safeValue, minPrice: null });
      return;
    }

    const number = Number(raw);
    if (Number.isFinite(number)) {
      emitChange({ ...safeValue, minPrice: number });
    }
  };

  const handleMaxInputChange = (raw: string) => {
    setMaxInput(raw);

    if (raw.trim() === '') {
      emitChange({ ...safeValue, maxPrice: null });
      return;
    }

    const number = Number(raw);
    if (Number.isFinite(number)) {
      emitChange({ ...safeValue, maxPrice: number });
    }
  };

  const normalizeMinPrice = () => {
    if (!hasPriceRange || minInput.trim() === '') return;

    const number = Number(minInput);
    if (!Number.isFinite(number)) {
      setMinInput('');
      emitChange({ ...safeValue, minPrice: null });
      return;
    }

    const upperBound = safeValue.maxPrice ?? realMaxPrice;
    const normalized = Math.max(realMinPrice, Math.min(number, upperBound));

    setMinInput(String(normalized));
    emitChange({ ...safeValue, minPrice: normalized });
  };

  const normalizeMaxPrice = () => {
    if (!hasPriceRange || maxInput.trim() === '') return;

    const number = Number(maxInput);
    if (!Number.isFinite(number)) {
      setMaxInput('');
      emitChange({ ...safeValue, maxPrice: null });
      return;
    }

    const lowerBound = safeValue.minPrice ?? realMinPrice;
    const normalized = Math.min(realMaxPrice, Math.max(number, lowerBound));

    setMaxInput(String(normalized));
    emitChange({ ...safeValue, maxPrice: normalized });
  };

  const handleMinRange = (nextValue: number) => {
    const next = Math.min(nextValue, effectiveMax);
    setMinInput(String(next));
    emitChange({ ...safeValue, minPrice: next });
  };

  const handleMaxRange = (nextValue: number) => {
    const next = Math.max(nextValue, effectiveMin);
    setMaxInput(String(next));
    emitChange({ ...safeValue, maxPrice: next });
  };

  const clearSizes = () => emitChange({ ...safeValue, sizes: [] });
  const clearColors = () => emitChange({ ...safeValue, colors: [] });

  const clearPrice = () => {
    setMinInput('');
    setMaxInput('');
    emitChange({ ...safeValue, minPrice: null, maxPrice: null });
  };

  const handleReset = () => {
    setMinInput('');
    setMaxInput('');
    emitChange(EMPTY_FILTERS);
    onSortChange?.('popular');
    onReset?.();
  };

  const renderArrow = (section: FilterSection) => (
    <span
      className={`${styles.filter__arrow} ${
        openedSections[section] ? styles.filter__arrow_open : ''
      }`}
      aria-hidden="true"
    >
      <Image src={ArrowImage} />
    </span>
  );

  return (
    <div className={styles.filter} role="dialog" aria-modal="true" aria-label="Фильтры каталога">
      <button
        type="button"
        className={styles.filter__overlay}
        aria-label="Закрыть фильтры"
        onClick={() => dispatch(close())}
      />

      <aside className={styles.filter__menu}>
        <header className={styles.filter__header}>
          <h2 className={styles.filter__title}>Фильтры и сортировка</h2>

          <button
            type="button"
            className={styles.filter__close}
            onClick={() => dispatch(close())}
            aria-label="Закрыть"
          >
            ×
          </button>
        </header>

        <div className={styles.filter__content}>
          {safeOptions.sizes.length > 0 && (
            <section className={styles.filter__section}>
              <div className={styles.filter__sectionRow}>
                <button
                  type="button"
                  className={styles.filter__sectionHeader}
                  onClick={() => toggleSection('size')}
                  aria-expanded={openedSections.size}
                >
                  <span className={styles.filter__sectionTitle}>
                    РАЗМЕР
                    {safeValue.sizes.length > 0 && <span>{safeValue.sizes.length}</span>}
                  </span>
                  {renderArrow('size')}
                </button>

                {safeValue.sizes.length > 0 && (
                  <button
                    type="button"
                    className={styles.filter__clear}
                    onClick={clearSizes}
                    aria-label="Сбросить размер"
                  >
                    ×
                  </button>
                )}
              </div>

              {openedSections.size && (
                <div className={styles.filter__sizes}>
                  {safeOptions.sizes.map((size) => {
                    const active = safeValue.sizes.includes(size);

                    return (
                      <button
                        key={size}
                        type="button"
                        className={`${styles.filter__size} ${
                          active ? styles.filter__size_active : ''
                        }`}
                        onClick={() => toggleSize(size)}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {safeOptions.colors.length > 0 && (
            <section className={styles.filter__section}>
              <div className={styles.filter__sectionRow}>
                <button
                  type="button"
                  className={styles.filter__sectionHeader}
                  onClick={() => toggleSection('color')}
                  aria-expanded={openedSections.color}
                >
                  <span className={styles.filter__sectionTitle}>
                    ЦВЕТ
                    {safeValue.colors.length > 0 && <span>{safeValue.colors.length}</span>}
                  </span>
                  {renderArrow('color')}
                </button>

                {safeValue.colors.length > 0 && (
                  <button
                    type="button"
                    className={styles.filter__clear}
                    onClick={clearColors}
                    aria-label="Сбросить цвет"
                  >
                    ×
                  </button>
                )}
              </div>

              {openedSections.color && (
                <div className={styles.filter__colors}>
                  {safeOptions.colors.map((color) => {
                    const active = safeValue.colors.includes(color);

                    return (
                      <button
                        key={color}
                        type="button"
                        title={color}
                        aria-label={color}
                        className={`${styles.filter__color} ${
                          active ? styles.filter__color_active : ''
                        }`}
                        onClick={() => toggleColor(color)}
                      >
                        <span
                          style={{
                            backgroundColor: COLOR_MAP[color] ?? color,
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {hasPriceRange && (
            <section className={styles.filter__section}>
              <div className={styles.filter__sectionRow}>
                <button
                  type="button"
                  className={styles.filter__sectionHeader}
                  onClick={() => toggleSection('price')}
                  aria-expanded={openedSections.price}
                >
                  <span className={styles.filter__sectionTitle}>ЦЕНА</span>
                  {renderArrow('price')}
                </button>

                {(safeValue.minPrice !== null || safeValue.maxPrice !== null) && (
                  <button
                    type="button"
                    className={styles.filter__clear}
                    onClick={clearPrice}
                    aria-label="Сбросить цену"
                  >
                    ×
                  </button>
                )}
              </div>

              {openedSections.price && (
                <>
                  <div className={styles.filter__priceFields}>
                    <label className={styles.filter__priceField}>
                      <span>от</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={minInput}
                        placeholder={String(realMinPrice)}
                        onChange={(event) => handleMinInputChange(event.target.value)}
                        onBlur={normalizeMinPrice}
                      />
                    </label>

                    <label className={styles.filter__priceField}>
                      <span>до</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={maxInput}
                        placeholder={String(realMaxPrice)}
                        onChange={(event) => handleMaxInputChange(event.target.value)}
                        onBlur={normalizeMaxPrice}
                      />
                    </label>
                  </div>

                  <div className={styles.filter__range}>
                    <div className={styles.filter__rangeBackground} />
                    <div
                      className={styles.filter__rangeSelected}
                      style={{
                        left: `${minPercent}%`,
                        right: `${100 - maxPercent}%`,
                      }}
                    />

                    <input
                      type="range"
                      min={realMinPrice}
                      max={realMaxPrice}
                      value={effectiveMin}
                      onChange={(event) => handleMinRange(Number(event.target.value))}
                      aria-label="Минимальная цена"
                    />

                    <input
                      type="range"
                      min={realMinPrice}
                      max={realMaxPrice}
                      value={effectiveMax}
                      onChange={(event) => handleMaxRange(Number(event.target.value))}
                      aria-label="Максимальная цена"
                    />
                  </div>
                </>
              )}
            </section>
          )}

          <section className={styles.filter__section}>
            <div className={styles.filter__sectionRow}>
              <button
                type="button"
                className={styles.filter__sectionHeader}
                onClick={() => toggleSection('sort')}
                aria-expanded={openedSections.sort}
              >
                <span className={styles.filter__sectionTitle}>СОРТИРОВАТЬ</span>
                {renderArrow('sort')}
              </button>
            </div>

            {openedSections.sort && (
              <div className={styles.filter__sort}>
                {SORT_OPTIONS.map((option) => {
                  const active = sort === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`${styles.filter__sortButton} ${
                        active ? styles.filter__sortButton_active : ''
                      }`}
                      onClick={() => onSortChange?.(option.value)}
                    >
                      {option.title}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <footer className={styles.filter__footer}>
          <button
            type="button"
            className={styles.filter__apply}
            onClick={() => dispatch(close())}
          >
            Показать ({productsCount})
          </button>

          <button
            type="button"
            className={styles.filter__reset}
            onClick={handleReset}
          >
            Сбросить
          </button>
        </footer>
      </aside>
    </div>
  );
};

export default CatalogFilter;
