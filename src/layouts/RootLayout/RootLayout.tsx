import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "@components/blocks/Header/Header.tsx";
import Footer from "@components/blocks/Footer/Footer.tsx";
import ScrollToHash from "@components/ScrollToHash/ScrollToHash";
import NavigationMobile from "@components/NavigationMobile/NavigationMobile.tsx";
import RunningLine from "@components/RunningLine/RunningLine.tsx";
import SearchModal from "@components/modals/SearchModal/SearchModal.tsx";
import TableSizes from "@components/modals/TableSizes/TableSizes.tsx";
import ScrollToTop from "@components/ScrollToTop/ScrollToTop.tsx";
const RootLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("payment") !== "success")
            return;
        const returnedOrder = params.get("order") ?? sessionStorage.getItem("provokativelook.payment.order") ?? "";
        sessionStorage.removeItem("provokativelook.payment.url");
        if (returnedOrder) {
            sessionStorage.setItem("provokativelook.payment.returnedOrder", returnedOrder);
            sessionStorage.setItem("provokativelook.payment.pendingUntil", String(Date.now() + 60000));
        }
        navigate("/profile/orders", { replace: true });
    }, [location.search, navigate]);
    return (<>
      <ScrollToTop />
      <ScrollToHash />
      <Header />
      <RunningLine />
      <Outlet />
      <Footer />
      <NavigationMobile />
      <SearchModal />
      <TableSizes />
    </>);
};
export default RootLayout;

