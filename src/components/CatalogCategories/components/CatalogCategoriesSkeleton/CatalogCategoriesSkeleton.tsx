import styles from './CatalogCategoriesSkeleton.module.scss';

const CatalogCategoriesSkeleton = () => {
    return (
        <>
            {Array.from({ length: 14 }).map((_, index) => (
                <div key={index} className={styles.skeleton}>
                    <div className={styles.skeleton__title} />
                    <div className={styles.skeleton__image} />
                </div>
            ))}
        </>
    );
};

export default CatalogCategoriesSkeleton;