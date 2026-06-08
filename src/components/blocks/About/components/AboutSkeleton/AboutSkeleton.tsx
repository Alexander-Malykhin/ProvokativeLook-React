//styles
import styles from './AboutSkeleton.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";

const AboutSkeleton = () => (
    <SectionLayout>
        <MainLayoutContainer className={styles.about}>
            <div className={styles.about__row}>
                <div className={styles.about__column}>
                    <div className={styles.skeleton__text} />
                    <div className={styles.skeleton__text} />
                    <div className={styles.skeleton__text_short} />
                </div>

                <div className={styles.skeleton__image} />
            </div>

            <div className={styles.about__list}>
                {[1, 2, 3].map((item) => (
                    <div key={item} className={styles.about__item}>
                        <div className={styles.skeleton__title} />
                        <div className={styles.skeleton__text} />
                    </div>
                ))}
            </div>
        </MainLayoutContainer>
    </SectionLayout>
);

export default AboutSkeleton;