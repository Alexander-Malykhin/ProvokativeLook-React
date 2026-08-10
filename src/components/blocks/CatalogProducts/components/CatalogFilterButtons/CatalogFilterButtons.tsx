import { useEffect, useRef, useState } from 'react';

import styles from './CatalogFilterButtons.module.scss';

import ArrowImage from '@assets/arrows/arrow-shevron-bottom.svg';
import FilterImage from '@assets/filters/filters.svg';

import Image from '@UI/buttons/Image/Image.tsx';

import { useAppDispatch } from '@store/hooks';
import { add } from '@store/slices/toggleFIlterSlice';

import type { CatalogSort } from '@store/api/catalog/types';

type CatalogFilterButtonsProps = {
  sort: CatalogSort;
  onSortChange: (sort: CatalogSort) => void;
};

const SORT_OPTIONS: Array<{ value: CatalogSort; title: string }> = [
  { value: 'popular', title: 'По популярности' },
  { value: 'new', title: 'По новизне' },
  { value: 'priceAsc', title: 'По возрастанию цены' },
  { value: 'priceDesc', title: 'По убыванию цены' },
];

const CatalogFilterButtons = ({ sort, onSortChange }: CatalogFilterButtonsProps) => {
  const dispatch = useAppDispatch();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const activeSort = SORT_OPTIONS.find((item) => item.value === sort) ?? SORT_OPTIONS[0];

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const openFilters = () => dispatch(add());

  return (
    <div className={styles.filter}>
      <div className={styles.filter__list}>
        <button type="button" className={styles.filter__button} onClick={openFilters}>
          Размер
          <Image src={ArrowImage} />
        </button>

        <button type="button" className={styles.filter__button} onClick={openFilters}>
          Цвет
          <Image src={ArrowImage} />
        </button>

        <button type="button" className={styles.filter__button} onClick={openFilters}>
          Цена
          <Image src={ArrowImage} />
        </button>
      </div>

      <button
        type="button"
        className={`${styles.filter__button} ${styles.filter__mobile}`}
        onClick={openFilters}
      >
        <Image src={FilterImage} />
        ФИЛЬТРЫ
      </button>

      <div className={styles.filter__sort} ref={sortRef}>
        <button
          type="button"
          className={styles.filter__sortTrigger}
          onClick={() => setIsSortOpen((previous) => !previous)}
          aria-expanded={isSortOpen}
        >
          {activeSort.title}
          <span
            className={`${styles.filter__sortArrow} ${
              isSortOpen ? styles.filter__sortArrow_open : ''
            }`}
          >
            <Image src={ArrowImage} />
          </span>
        </button>

        {isSortOpen && (
          <div className={styles.filter__sortMenu}>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.filter__sortOption} ${
                  sort === option.value ? styles.filter__sortOption_active : ''
                }`}
                onClick={() => {
                  onSortChange(option.value);
                  setIsSortOpen(false);
                }}
              >
                {option.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogFilterButtons;
