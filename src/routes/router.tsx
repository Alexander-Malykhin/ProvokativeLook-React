import {createBrowserRouter} from "react-router-dom";
//layouts
import RootLayout from "@layouts/RootLayout/RootLayout.tsx";
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
import ProfilePage from "@pages/ProfilePage/ProfilePage.tsx";
import NotFoundPage from "@pages/NotFoundPage/NotFoundPage.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'catalog',
                element: <CatalogPage />,
            },
            {
                path: 'catalog/:categorySlug',
                element: <CatalogCategoryPage />,
            },
            {
                path: 'contacts',
                element: <ContactsPage />,
            },
            {
                path: 'about',
                element: <AboutPage />,
            },
            {
                path: 'basket',
                element: <BasketPage />,
            },
            {
                path: 'order',
                element: <OrderPage />,
            },
            {
                path: 'favorites',
                element: <FavoritesPage />,
            },
            {
                path: 'info/:url',
                element: <InfoPage />,
            },
            {
                path: 'profile/:url',
                element: <ProfilePage />,
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
], {
    basename: '/',
});