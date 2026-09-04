import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@layouts/RootLayout/RootLayout";
import RouteErrorBoundary from "./RouteErrorBoundary";
const page = (loader: () => Promise<{
    default: React.ComponentType;
}>) => async () => ({
    Component: (await loader()).default,
});
export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
            {
                index: true,
                lazy: page(() => import("@pages/HomePage/HomePage")),
            },
            {
                path: "catalog",
                lazy: page(() => import("@pages/CatalogPage/CatalogPage")),
            },
            {
                path: "catalog/:categorySlug",
                lazy: page(() => import("@pages/CatalogCategoryPage/CatalogCategoryPage")),
            },
            {
                path: "catalog/:sectionSlug/:productSlug",
                lazy: page(() => import("@pages/ProductPage/ProductPage")),
            },
            {
                path: "catalog/*",
                lazy: page(() => import("@pages/CatalogCategoryPage/CatalogCategoryPage")),
            },
            {
                path: "search",
                lazy: page(() => import("@pages/SearchResultsPage/SearchResultsPage")),
            },
            {
                path: "contacts",
                lazy: page(() => import("@pages/ContactsPage/ContactsPage")),
            },
            {
                path: "about",
                lazy: page(() => import("@pages/AboutPage/AboutPage")),
            },
            {
                path: "basket",
                lazy: page(() => import("@pages/BasketPage/BasketPage")),
            },
            {
                path: "order",
                lazy: page(() => import("@pages/OrderPage/OrderPage")),
            },
            {
                path: "favorites",
                lazy: page(() => import("@pages/FavoritesPage/FavoritesPage")),
            },
            {
                path: "payment/redirect",
                lazy: page(() => import("@pages/PaymentRedirectPage/PaymentRedirectPage")),
            },
            {
                path: "payment/success",
                lazy: page(() => import("@pages/PaymentSuccessPage/PaymentSuccessPage")),
            },
            {
                path: "info/:url",
                lazy: page(() => import("@pages/InfoPage/InfoPage")),
            },
            {
                path: "profile/:url",
                lazy: page(() => import("@pages/ProfilePage/ProfilePage")),
            },
            {
                path: "profile/:url/:id",
                lazy: page(() => import("@pages/ProfilePage/ProfilePage")),
            },
            {
                path: "public-offer",
                lazy: page(() => import("@pages/LegalPage/LegalPage")),
            },
            {
                path: "terms-of-use",
                lazy: page(() => import("@pages/LegalPage/LegalPage")),
            },
            {
                path: "privacy-policy",
                lazy: page(() => import("@pages/LegalPage/LegalPage")),
            },
            {
                path: "cookie-policy",
                lazy: page(() => import("@pages/LegalPage/LegalPage")),
            },
            {
                path: "personal-data-consent",
                lazy: page(() => import("@pages/LegalPage/LegalPage")),
            },
            {
                path: "*",
                lazy: page(() => import("@pages/NotFoundPage/NotFoundPage")),
            },
        ],
    },
], { basename: "/" });
