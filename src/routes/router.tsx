import {createBrowserRouter} from "react-router-dom";
//pages
import HomePage from "@pages/HomePage/HomePage.tsx";
import CatalogPage from "@pages/CatalogPage/CatalogPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>
    },
    {
        path: "/catalog",
        element: <CatalogPage/>
    }
], {
    basename: "/local/react-app",
})