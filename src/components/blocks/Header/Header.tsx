//styles
import styles from "./Header.module.scss";
//layouts
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer";
//components
import Logo from "@components/Logo/Logo";
import Navigation from "@components/Navigation/Navigation";
import UserActions from "@components/blocks/Header/components/UserActions/UserActions";
import HeaderSkeleton from "./components/HeaderSkeleton/HeaderSkeleton";
//UI
import BurgerButton from "@UI/buttons/BurgerButton/BurgerButton";
//modals
import NavigationProfileModal from "@components/modals/NavigationProfileModal/NavigationProfileModal";
//store
import { useGetSettingsQuery } from "@store/api/settings/settingsApi";
import { useGetNavigationQuery } from "@store/api/navigation/navigationApi";

const Header = () => {
    const { data: settings, isLoading: isSettingsLoading } = useGetSettingsQuery();
    const { data: navigation = [], isLoading: isNavigationLoading } = useGetNavigationQuery();

    const isLoading = isSettingsLoading || isNavigationLoading;

    if (isLoading) {
        return <HeaderSkeleton />;
    }

    return (
        <header className={styles.header}>
            <MainLayoutContainer>
                <div className={styles.header__content}>
                    <div className={styles.header__action}>
                        <BurgerButton />
                        <Logo logo={settings?.logo} />
                    </div>
                    <Navigation items={navigation} />
                    <UserActions />
                    <NavigationProfileModal />
                </div>
            </MainLayoutContainer>
        </header>
    );
};

export default Header;