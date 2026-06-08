//styles
import styles from './ContactUsSkeleton.module.scss';
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";

const ContactUsSkeleton = () => (
    <SectionLayout>
        <MainLayoutContainer className={styles.contacts}>
            <div className={styles.contacts__column}>
                {[1, 2, 3, 4].map((row) => (
                    <div key={row} className={styles.contacts__row}>
                        <div className={styles.skeleton__label} />
                        <div className={styles.skeleton__text} />
                    </div>
                ))}

                <div className={styles.contacts__list}>
                    {[1, 2, 3].map((item) => (
                        <div key={item} className={styles.contacts__item}>
                            <div className={styles.skeleton__icon} />
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.skeleton__map} />
        </MainLayoutContainer>
    </SectionLayout>
);

export default ContactUsSkeleton;