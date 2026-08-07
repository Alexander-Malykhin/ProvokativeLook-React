// styles
import styles from "./AnswersToQuestionsSkeleton.module.scss";
// layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer";

const skeletonItems = [1, 2, 3, 4];

const AnswersToQuestionsSkeleton = () => {
  return (
    <SectionLayout>
      <MainLayoutContainer className={styles.answers}>
        <div className={styles.answers__column}>
          <div className={styles.skeleton__title} />
          <div className={styles.skeleton__button} />
        </div>

        <div className={styles.answers__list}>
          {skeletonItems.map((item) => (
            <div key={item} className={styles.skeleton__item} />
          ))}
        </div>
      </MainLayoutContainer>
    </SectionLayout>
  );
};

export default AnswersToQuestionsSkeleton;
