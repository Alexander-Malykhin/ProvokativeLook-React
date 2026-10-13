import { safeSessionStorage } from "@helpers/browserStorage";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useNavigation } from "react-router-dom";
import PageLoader from '@components/system/PageLoader/PageLoader';
import Header from "@components/blocks/Header/Header.tsx";
import Footer from "@components/blocks/Footer/Footer.tsx";
import FooterCookie from "@components/blocks/Footer/components/FooterCookie/FooterCookie";
import ScrollToHash from "@components/ScrollToHash/ScrollToHash";
import NavigationMobile from "@components/NavigationMobile/NavigationMobile.tsx";
import RunningLine from "@components/RunningLine/RunningLine.tsx";
import SearchModal from "@components/modals/SearchModal/SearchModal.tsx";
import TableSizes from "@components/modals/TableSizes/TableSizes.tsx";
import ScrollToTop from "@components/ScrollToTop/ScrollToTop.tsx";
const RootLayout = () => {
    const navigation = useNavigation();
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.pathname === "/" || location.pathname.endsWith("/"))
            return;
        navigate({ pathname: `${location.pathname}/`, search: location.search, hash: location.hash }, { replace: true });
    }, [location.hash, location.pathname, location.search, navigate]);
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("payment") !== "success")
            return;
        const returnedOrder = params.get("order") ?? safeSessionStorage.getItem("provokativelook.payment.order") ?? "";
        safeSessionStorage.removeItem("provokativelook.payment.url");
        if (returnedOrder) {
            safeSessionStorage.setItem("provokativelook.payment.returnedOrder", returnedOrder);
            safeSessionStorage.setItem("provokativelook.payment.pendingUntil", String(Date.now() + 60000));
        }
        navigate("/profile/orders", { replace: true });
    }, [location.search, navigate]);
    return (<>
      {navigation.state !== 'idle' && <PageLoader />}
      <ScrollToTop />
      <ScrollToHash />
      <Header />
      <RunningLine />
      <Outlet />
      <Footer />
      <FooterCookie />
      <NavigationMobile />
      <SearchModal />
      <TableSizes />
    </>);
};
export default RootLayout;
