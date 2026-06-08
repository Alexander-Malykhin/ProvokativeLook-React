import styles from "./HeaderSkeleton.module.scss";

import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer";

const HeaderSkeleton = () => {
    return (
        <header className={styles.skeleton}>
            <MainLayoutContainer>
                <div className={styles.skeleton__content}>
                    <div className={styles.skeleton__left}>
                        <div className={styles.skeleton__burger}></div>
                        <div className={styles.skeleton__logo}></div>
                    </div>

                    <div className={styles.skeleton__navigation}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    <div className={styles.skeleton__actions}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </MainLayoutContainer>
        </header>
    );
};

export default HeaderSkeleton;