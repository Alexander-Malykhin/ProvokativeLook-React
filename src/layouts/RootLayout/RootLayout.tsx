import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

//header
import Header from "@components/blocks/Header/Header.tsx";
//footer
import Footer from "@components/blocks/Footer/Footer.tsx";
//components
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
    // Платёжные системы возвращают пользователя на корень сайта, потому что
    // прямой запрос к /payment/success на production обрабатывается веб-сервером
    // раньше React Router и давал 404. Корень всегда существует, дальше уже SPA
    // без промежуточного экрана отправляет клиента в его заказы.
    const params = new URLSearchParams(location.search);
    if (params.get("payment") !== "success") return;

    const returnedOrder = params.get("order") ?? sessionStorage.getItem("provokativelook.payment.order") ?? "";
    sessionStorage.removeItem("provokativelook.payment.url");
    if (returnedOrder) {
      sessionStorage.setItem("provokativelook.payment.returnedOrder", returnedOrder);
      sessionStorage.setItem("provokativelook.payment.pendingUntil", String(Date.now() + 60_000));
    }
    navigate("/profile/orders", { replace: true });
  }, [location.search, navigate]);

  return (
    <>
      <ScrollToTop />
      <ScrollToHash />
      <Header />
      <RunningLine />
      <Outlet />
      <Footer />
      <NavigationMobile />
      <SearchModal />
      <TableSizes />
    </>
  );
};

export default RootLayout;
