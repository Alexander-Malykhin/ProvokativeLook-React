//styles
import styles from './ReviewsSkeleton.module.scss';
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";

const ReviewsSkeleton = () => (
    <SectionLayout className={styles.reviews}>
        <div className={styles.reviews__column}>
            <div className={styles.skeleton__title} />
            <div className={styles.skeleton__controls} />
        </div>

        <div className={styles.reviews__slider}>
            {[1, 2, 3].map((item) => (
                <div key={item} className={styles.skeleton__card}>
                    <div className={styles.skeleton__name} />
                    <div className={styles.skeleton__text} />
                    <div className={styles.skeleton__text} />
                    <div className={styles.skeleton__date} />
                </div>
            ))}
        </div>
    </SectionLayout>
);

export default ReviewsSkeleton;