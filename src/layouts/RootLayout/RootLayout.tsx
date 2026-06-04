import { Outlet } from 'react-router-dom';
//header
import Header from "@components/blocks/Header/Header.tsx";
//footer
import Footer from "@components/blocks/Footer/Footer.tsx";
//components
import ScrollToHash from '@components/ScrollToHash/ScrollToHash';
import NavigationMobile from "@components/NavigationMobile/NavigationMobile.tsx";
import RunningLine from "@components/RunningLine/RunningLine.tsx";
import SearchModal from "@components/modals/SearchModal/SearchModal.tsx";

const RootLayout = () => {
    return (
        <>
            <ScrollToHash />
            <Header />
            <RunningLine/>
            <Outlet />
            <Footer />
            <NavigationMobile/>
            <SearchModal/>
        </>
    );
};

export default RootLayout;