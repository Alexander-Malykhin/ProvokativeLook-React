//styles
import styles from './Header.module.scss'
//layouts
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//components
import Logo from "@components/Logo/Logo.tsx";
import Navigation from "@components/Navigation/Navigation.tsx";
import UserActions from "@components/blocks/Header/components/UserActions/UserActions.tsx";

const Header = () => {
    return (
        <header className={styles.header}>
            <MainLayoutContainer>
                <div className={styles.header__content}>
                    <div className={styles.header__action}>
                        <button className={styles.burger}>
                            <span className={styles.burger__line}></span>
                            <span className={styles.burger__line}></span>
                            <span className={styles.burger__line}></span>
                        </button>
                        <Logo/>
                    </div>
                    <Navigation/>
                    <UserActions/>
                </div>
            </MainLayoutContainer>
        </header>
    );
};

export default Header;