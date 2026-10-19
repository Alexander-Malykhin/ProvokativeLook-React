import styles from './Pagination.module.scss';
import ArrowPagination from '@assets/arrows/arrow-pagination.svg';
import Image from '@UI/media/Image/Image.tsx';
import { paginationItems } from '@helpers/pagination';
type PaginationProps = {
  page: number;
  total: number;
  pageSize: number;
  itemCount?: number;
  totalPages: number;
  disabled?: boolean;
  onChange: (page: number) => void;
};
const Pagination = ({
  page,
  total,
  pageSize,
  itemCount = pageSize,
  totalPages,
  disabled = false,
  onChange,
}: PaginationProps) => {
  if (total === 0) {
    return null;
  }
  const first = Math.min((page - 1) * pageSize + 1, total);
  const last = Math.min((page - 1) * pageSize + itemCount, total);
  const pages = paginationItems(page, totalPages);
  return (
    <div className={styles.pagination}>
      <p className={styles.pagination__description}>
        Показаны {first}–{last} из {total} товаров
      </p>

      <nav className={styles.pagination__list} aria-label="Страницы каталога">
        {totalPages > 5 && page > 1 && (
          <button
            type="button"
            className={`${styles.pagination__item} ${styles.pagination__previous}`}
            onClick={() => onChange(page - 1)}
            disabled={disabled}
            aria-label="Предыдущая страница"
          >
            <Image src={ArrowPagination} alt="" />
          </button>
        )}
        {pages.map((pageNumber) =>
          typeof pageNumber === 'string' ? (
            <span key={pageNumber} className={styles.pagination__ellipsis} aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={pageNumber}
              type="button"
              className={styles.pagination__item}
              onClick={() => onChange(pageNumber)}
              disabled={disabled || pageNumber === page}
              aria-current={pageNumber === page ? 'page' : undefined}
              aria-label={`Страница ${pageNumber}`}
            >
              {pageNumber}
            </button>
          ),
        )}

        {totalPages > 5 && page < totalPages && (
          <button
            type="button"
            className={styles.pagination__item}
            onClick={() => onChange(page + 1)}
            disabled={disabled}
            aria-label="Следующая страница"
          >
            <Image src={ArrowPagination} alt="" />
          </button>
        )}
      </nav>
    </div>
  );
};
export default Pagination;
