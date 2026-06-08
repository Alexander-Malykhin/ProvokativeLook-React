// dataUserActions.ts
import SearchImage from "@assets/header/search.svg";
import UserImage from "@assets/header/user.svg";
import FavoritesImage from "@assets/header/favorite.svg";
import BasketImage from "@assets/header/basket.svg";

export const dataUserActions = [
    {
        id: 1,
        image: SearchImage,
        action: "search",
    },
    {
        id: 2,
        image: UserImage,
        action: "profile",
    },
    {
        id: 3,
        image: FavoritesImage,
        path: "/favorites",
    },
    {
        id: 4,
        image: BasketImage,
        path: "/basket",
    },
] as const;