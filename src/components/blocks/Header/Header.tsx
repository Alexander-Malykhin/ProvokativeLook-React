// styles
import styles from "./Header.module.scss";
// layouts
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
// components
import Logo from "@components/Logo/Logo.tsx";
import Navigation from "@components/Navigation/Navigation.tsx";
import UserActions from "@components/blocks/Header/components/UserActions/UserActions.tsx";
import HeaderSkeleton from "@components/blocks/Header/components/HeaderSkeleton/HeaderSkeleton.tsx";
// UI
import BurgerButton from "@UI/buttons/BurgerButton/BurgerButton.tsx";
// modals
import NavigationProfileModal from "@components/modals/NavigationProfileModal/NavigationProfileModal.tsx";
import AuthModal from "@components/modals/AuthModal/AuthModal.tsx";
// api
import { useGetSettingsQuery } from "@store/api/settings/settingsApi.ts";
import { useGetNavigationQuery } from "@store/api/navigation/navigationApi.ts";

const Header = () => {
  const { data: settings, isLoading: isSettingsLoading } =
    useGetSettingsQuery();

  const { data: navigation = [], isLoading: isNavigationLoading } =
    useGetNavigationQuery();

  const isLoading = isSettingsLoading || isNavigationLoading;

  if (isLoading) {
    return <HeaderSkeleton />;
  }

  return (
    <>
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

      <AuthModal />
    </>
  );
};

export default Header;
