import styles from './Pagination.module.scss';
import ArrowPagination from '@assets/arrows/arrow-pagination.svg';
import Image from '@UI/media/Image/Image.tsx';
type PaginationProps = {
    page: number;
    total: number;
    pageSize: number;
    itemCount?: number;
    totalPages: number;
    disabled?: boolean;
    onChange: (page: number) => void;
};
const Pagination = ({ page, total, pageSize, itemCount = pageSize, totalPages, disabled = false, onChange, }: PaginationProps) => {
    if (total === 0) {
        return null;
    }
    const first = Math.min((page - 1) * pageSize + 1, total);
    const last = Math.min((page - 1) * pageSize + itemCount, total);
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    return (<div className={styles.pagination}>
            <p className={styles.pagination__description}>
                Показаны {first}–{last} из {total} товаров
            </p>

            <div className={styles.pagination__list}>
                {pages.map((pageNumber) => (<button key={pageNumber} type="button" className={styles.pagination__item} onClick={() => onChange(pageNumber)} disabled={disabled || pageNumber === page} aria-current={pageNumber === page ? 'page' : undefined}>
                        {pageNumber}
                    </button>))}

                {page < totalPages && (<button type="button" className={styles.pagination__item} onClick={() => onChange(page + 1)} disabled={disabled} aria-label="Следующая страница">
                        <Image src={ArrowPagination}/>
                    </button>)}
            </div>
        </div>);
};
export default Pagination;

