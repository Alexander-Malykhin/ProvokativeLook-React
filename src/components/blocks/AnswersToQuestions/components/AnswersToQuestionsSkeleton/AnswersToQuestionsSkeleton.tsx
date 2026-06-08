import styles from './AnswersToQuestionsSkeleton.module.scss';
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";

const AnswersToQuestionsSkeleton = () => (
    <SectionLayout>
        <MainLayoutContainer className={styles.answers}>
            <div className={styles.answers__column}>
                <div className={styles.skeleton__title} />
                <div className={styles.skeleton__button} />
            </div>

            <div className={styles.answers__list}>
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className={styles.skeleton__item} />
                ))}
            </div>
        </MainLayoutContainer>
    </SectionLayout>
);

export default AnswersToQuestionsSkeleton;