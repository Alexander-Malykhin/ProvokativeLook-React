import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import styles from './NavigationMobile.module.scss';
import MainLayoutContainer from '@layouts/MainLayoutContainer/MainLayoutContainer';
import { close } from '@store/slices/toggleMenuNavigationSlice';
import { useGetNavigationQuery } from '@store/api/navigation/navigationApi';
import NavigationMobileMain from './components/NavigationMobileMain/NavigationMobileMain';
import NavigationMobileCatalog from './components/NavigationMobileCatalog/NavigationMobileCatalog';
const NavigationMobile = () => {
  const [menu, setMenu] = useState<'main' | 'catalog'>('main');
  const { data: navigationMain = [] } = useGetNavigationQuery();
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => state.toggleMenuNavigation.active);
  const handleClose = () => {
    setMenu('main');
    dispatch(close());
  };
  if (!active) return null;
  return (
    <MainLayoutContainer className={styles.navigation}>
      {menu === 'main' && (
        <NavigationMobileMain items={navigationMain} onOpenCatalog={() => setMenu('catalog')} onClose={handleClose} />
      )}

      {menu === 'catalog' && <NavigationMobileCatalog onBack={() => setMenu('main')} onClose={handleClose} />}
    </MainLayoutContainer>
  );
};
export default NavigationMobile;
