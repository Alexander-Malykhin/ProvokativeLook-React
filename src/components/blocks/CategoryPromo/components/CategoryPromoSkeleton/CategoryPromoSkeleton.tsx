//styles
import styles from "./CategoryPromoSkeleton.module.scss";
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
//containers
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";

const CategoryPromoSkeleton = () => (
  <SectionLayout>
    <MainLayoutContainer className={styles.promo}>
      {[1, 2].map((item) => (
        <div key={item} className={styles.promo__item}>
          <div className={styles.skeleton__image} />
          <div className={styles.promo__information}>
            <div className={styles.skeleton__title} />
          </div>
        </div>
      ))}
    </MainLayoutContainer>
  </SectionLayout>
);

export default CategoryPromoSkeleton;
