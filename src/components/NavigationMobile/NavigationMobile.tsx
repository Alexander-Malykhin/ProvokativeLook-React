import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@store/store";
//styles
import styles from "./NavigationMobile.module.scss";
//layouts
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer";
//store
import { close } from "@store/slices/toggleMenuNavigationSlice";
import { useGetNavigationQuery } from "@store/api/navigation/navigationApi";
//components
import NavigationMobileMain from "./components/NavigationMobileMain/NavigationMobileMain";
import NavigationMobileCatalog from "./components/NavigationMobileCatalog/NavigationMobileCatalog";

const NavigationMobile = () => {
    const [menu, setMenu] = useState<"main" | "catalog">("main");

    const { data: navigationMain = [] } = useGetNavigationQuery();

    const dispatch = useDispatch();

    const active = useSelector(
        (state: RootState) => state.toggleMenuNavigation.active
    );

    const handleClose = () => {
        setMenu("main");
        dispatch(close());
    };

    if (!active) return null;

    return (
        <MainLayoutContainer className={styles.navigation}>
            {menu === "main" && (
                <NavigationMobileMain
                    items={navigationMain}
                    onOpenCatalog={() => setMenu("catalog")}
                    onClose={handleClose}
                />
            )}

            {menu === "catalog" && (
                <NavigationMobileCatalog
                    onBack={() => setMenu("main")}
                    onClose={handleClose}
                />
            )}
        </MainLayoutContainer>
    );
};

export default NavigationMobile;