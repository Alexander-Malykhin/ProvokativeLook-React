import {createBrowserRouter} from "react-router-dom";
//pages
import HomePage from "@pages/HomePage/HomePage.tsx";
import CatalogPage from "@pages/CatalogPage/CatalogPage.tsx";
import ContactsPage from "@pages/ContactsPage/ContactsPage.tsx";
import AboutPage from "@pages/AboutPage/AboutPage.tsx";
import BasketPage from "@pages/BasketPage/BasketPage.tsx";
import CatalogCategoryPage from "@pages/CatalogCategoryPage/CatalogCategoryPage.tsx";
import InfoPage from "@pages/InfoPage/InfoPage.tsx";
import FavoritesPage from "@pages/FavoritesPage/FavoritesPage.tsx";
import OrderPage from "@pages/OrderPage/OrderPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>
    },
    {
        path: "/catalog",
        element: <CatalogPage/>
    },
    {
        path: "/catalog/:categorySlug",
        element: <CatalogCategoryPage />,
    },
    {
        path: "/contacts",
        element: <ContactsPage/>
    },
    {
        path: "/about",
        element: <AboutPage/>
    },
    {
        path: "/basket",
        element: <BasketPage/>
    },
    {
        path: "/order",
        element: <OrderPage/>
    },
    {
        path: '/favorites',
        element: <FavoritesPage />,
    },
    {
        path: '/:url',
        element: <InfoPage />,
    }
], {
    basename: "/local/react-app",
})