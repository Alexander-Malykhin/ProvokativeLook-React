// styles
import styles from './Pagination.module.scss';

// image
import ArrowPagination from '@assets/arrows/arrow-pagination.svg';

// UI
import Image from '@UI/media/Image/Image.tsx';

type PaginationProps = {
    page: number;
    total: number;
    pageSize: number;
    totalPages: number;
    onChange: (page: number) => void;
};

const Pagination = ({
    page,
    total,
    pageSize,
    totalPages,
    onChange,
}: PaginationProps) => {
    if (total === 0) {
        return null;
    }

    const viewed = Math.min(page * pageSize, total);
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className={styles.pagination}>
            <p className={styles.pagination__description}>
                Просмотрено {viewed} из {total} товаров
            </p>

            <div className={styles.pagination__list}>
                {pages.map((pageNumber) => (
                    <button
                        key={pageNumber}
                        type="button"
                        className={styles.pagination__item}
                        onClick={() => onChange(pageNumber)}
                        disabled={pageNumber === page}
                    >
                        {pageNumber}
                    </button>
                ))}

                {page < totalPages && (
                    <button
                        type="button"
                        className={styles.pagination__item}
                        onClick={() => onChange(page + 1)}
                        aria-label="Следующая страница"
                    >
                        <Image src={ArrowPagination} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Pagination;
