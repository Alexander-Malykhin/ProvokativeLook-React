//styles
import styles from './BannerSkeleton.module.scss';
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";

const BannerSkeleton = () => {
    return (
        <SectionLayout className={styles.banner}>
            <div className={styles.banner__content}>
                <div className={styles.skeleton__image} />

                <div className={styles.banner__information}>
                    <div className={styles.skeleton__title} />
                    <div className={styles.skeleton__title} />
                    <div className={styles.skeleton__button} />
                </div>

                <div className={styles.skeleton__image} />
            </div>

            <div className={styles.banner__category}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className={styles.skeleton__category} />
                ))}
            </div>
        </SectionLayout>
    );
};

export default BannerSkeleton;