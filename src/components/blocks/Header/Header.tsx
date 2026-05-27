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
                    <Logo/>
                    <Navigation/>
                    <UserActions/>
                </div>
            </MainLayoutContainer>
        </header>
    );
};

export default Header;