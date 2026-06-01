//styles
import styles from './Header.module.scss'
//layouts
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//components
import Logo from "@components/Logo/Logo.tsx";
import Navigation from "@components/Navigation/Navigation.tsx";
import UserActions from "@components/blocks/Header/components/UserActions/UserActions.tsx";
//UI
import BurgerButton from "@UI/buttons/BurgerButton/BurgerButton.tsx";

const Header = () => {
    return (
        <header className={styles.header}>
            <MainLayoutContainer>
                <div className={styles.header__content}>
                    <div className={styles.header__action}>
                        <BurgerButton/>
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