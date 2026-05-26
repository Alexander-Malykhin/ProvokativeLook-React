import {createBrowserRouter} from "react-router-dom";
//pages
import HomePage from "@pages/HomePage/HomePage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>
    }
], {
    basename: "/local/react-app",
})