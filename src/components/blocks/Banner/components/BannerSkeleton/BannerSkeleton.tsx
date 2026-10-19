import styles from './BannerSkeleton.module.scss';
import SectionLayout from '@layouts/SectionLayout/SectionLayout.tsx';
const BannerSkeleton = () => (
  <SectionLayout className={styles.banner}>
    <div className={styles.hero} aria-hidden="true" />
    <div className={styles.categories} aria-hidden="true">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className={styles.category} />
      ))}
    </div>
  </SectionLayout>
);
export default BannerSkeleton;
