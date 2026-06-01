import { Link, useLocation, useSearchParams } from 'react-router-dom';

import styles from './CategoryPagination.module.scss';

import ArrowRightImage from '@assets/paginations/arrow-right.svg';

import Image from '@UI/buttons/Image/Image.tsx';

const pages = [1, 2, 3, '...', 8];

const CategoryPagination = () => {
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();

    const currentPage = Number(searchParams.get('page') || 1);

    return (
        <div className={styles.pagination}>
            <p className={styles.pagination__description}>Просмотрено 24 из 184 товаров</p>
            <div className={styles.pagination__content}>
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={index} className={styles.pagination__item}>
                            ...
                        </span>
                        );
                    }

                    return (
                        <Link
                            key={page}
                            to={`${pathname}?page=${page}`}
                            className={`${styles.pagination__item} ${
                                currentPage === page ? styles.pagination__item_active : ''
                            }`}
                        >
                            {page}
                        </Link>
                    );
                })}

                <Link
                    to={`${pathname}?page=${currentPage + 1}`}
                    className={styles.pagination__button}
                >
                    <Image src={ArrowRightImage} alt="arrow-right" />
                </Link>
            </div>
        </div>
    );
};

export default CategoryPagination;