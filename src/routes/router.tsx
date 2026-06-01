import {createBrowserRouter} from "react-router-dom";
//pages
import HomePage from "@pages/HomePage/HomePage.tsx";
import CatalogPage from "@pages/CatalogPage/CatalogPage.tsx";
import ContactsPage from "@pages/ContactsPage/ContactsPage.tsx";
import AboutPage from "@pages/AboutPage/AboutPage.tsx";
import BasketPage from "@pages/BasketPage/BasketPage.tsx";
import CatalogCategoryPage from "@pages/CatalogCategoryPage/CatalogCategoryPage.tsx";

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
    }
], {
    basename: "/local/react-app",
})