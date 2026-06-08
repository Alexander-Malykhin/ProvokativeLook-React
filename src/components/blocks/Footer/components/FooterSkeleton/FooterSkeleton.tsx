//layouts
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//styles
import styles from "./FooterSkeleton.module.scss";

const FooterSkeleton = () => {
    return (
        <footer className={styles.skeleton}>
            <MainLayoutContainer>
                <div className={styles.skeleton__select} />
            </MainLayoutContainer>

            <div className={styles.skeleton__line}>
                <MainLayoutContainer className={styles.skeleton__content}>
                    <div className={styles.skeleton__contacts} />
                    <div className={styles.skeleton__nav} />
                    <div className={styles.skeleton__socials} />
                    <div className={styles.skeleton__bottom} />
                </MainLayoutContainer>
            </div>
        </footer>
    );
};

export default FooterSkeleton;