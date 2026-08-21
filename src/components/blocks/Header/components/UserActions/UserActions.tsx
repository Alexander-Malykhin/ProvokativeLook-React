import type { MouseEvent } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "@store/hooks";
import { dataUserActions } from "./data.ts";
import { add } from "@store/slices/toggleSearchSlice";
import { toggle } from "@store/slices/toggleMenuProfileSlice";
import { useGetCartQuery } from "@store/api/cart/cartApi";
import { useGetFavoritesQuery } from "@store/api/favorites/favoritesApi";
import { useGetUserQuery } from "@store/api/user/userApi";
import styles from "./UserActions.module.scss";
import ActionButton from "@UI/buttons/ActionButton/ActionButton";
import Image from "@UI/media/Image/Image";
const formatCounter = (value: number) => (value > 99 ? "99+" : String(value));
const UserActions = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { data: userData } = useGetUserQuery();
    const isAuthenticated = Boolean(userData?.success && userData.user);
    const { data: favoritesData } = useGetFavoritesQuery(undefined, {
        skip: !isAuthenticated,
    });
    const { data: cartData } = useGetCartQuery(undefined, {
        skip: !isAuthenticated,
    });
    const favoritesCount = isAuthenticated
        ? Math.max(0, Number(favoritesData?.count ?? favoritesData?.items.length ?? 0))
        : 0;
    const cartCount = isAuthenticated
        ? Math.max(0, Math.round(Number(cartData?.cart?.quantity ?? 0)))
        : 0;
    const handleClick = (event: MouseEvent<HTMLButtonElement>, item: (typeof dataUserActions)[number]) => {
        event.stopPropagation();
        if ("path" in item) {
            navigate(item.path);
            return;
        }
        switch (item.action) {
            case "search":
                dispatch(add());
                break;
            case "profile":
                dispatch(toggle());
                break;
            default:
                break;
        }
    };
    return (<div className={styles.actions}>
      {dataUserActions.map((item) => {
            const isProfile = "action" in item && item.action === "profile";
            const counter = "path" in item && item.path === "/favorites"
                ? favoritesCount
                : "path" in item && item.path === "/basket"
                    ? cartCount
                    : 0;
            return (<div key={item.id} className={styles.actions__item} data-profile-button={isProfile ? true : undefined}>
            <ActionButton onClick={(event) => handleClick(event, item)} className={styles.actions__button}>
              <Image src={item.image} alt="action-icon" className={styles.actions__image}/>

              {counter > 0 && (<span className={styles.actions__counter} aria-label={`Количество товаров: ${counter}`}>
                  {formatCounter(counter)}
                </span>)}
            </ActionButton>
          </div>);
        })}
    </div>);
};
export default UserActions;
