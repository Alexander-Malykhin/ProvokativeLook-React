import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/hooks";
import styles from "./ProductsButtons.module.scss";
import MainButton from "@UI/buttons/MainButton/MainButton.tsx";
import FavoritesImage from "@assets/basket/favorites.svg";
import FavoritesPullImage from "@assets/basket/favorites-pull.svg";
import { useAddCartItemMutation } from "@store/api/cart/cartApi";
import { useAddFavoriteMutation, useGetFavoritesQuery, useRemoveFavoriteMutation, } from "@store/api/favorites/favoritesApi";
import { useGetUserQuery } from "@store/api/user/userApi";
import { openAuthModal } from "@store/slices/toggleAuthModalSlice";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";
interface ProductsButtonsProps {
    cartProductId: number | null;
    favoriteProductId: number;
    disabled?: boolean;
}
const ProductsButtons = ({ cartProductId, favoriteProductId, disabled = false, }: ProductsButtonsProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { data: userData, isLoading: isUserLoading } = useGetUserQuery();
    const [addCartItem, { isLoading: isCartLoading }] = useAddCartItemMutation();
    const isAuthenticated = Boolean(userData?.success && userData.user);
    const { data: favoritesData } = useGetFavoritesQuery(undefined, {
        skip: !isAuthenticated,
    });
    const [addFavorite, { isLoading: isAddingFavorite }] = useAddFavoriteMutation();
    const [removeFavorite, { isLoading: isRemovingFavorite }] = useRemoveFavoriteMutation();
    const [added, setAdded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const isFavorite = useMemo(() => favoritesData?.items.some((item) => item.id === favoriteProductId) ?? false, [favoritesData?.items, favoriteProductId]);
    const requireAuth = () => {
        if (isAuthenticated)
            return false;
        dispatch(openAuthModal("login"));
        return true;
    };
    const handleAddToBasket = async () => {
        if (!cartProductId || disabled || isCartLoading)
            return;
        if (requireAuth())
            return;
        if (added) {
            navigate("/basket");
            return;
        }
        setErrorMessage("");
        try {
            await addCartItem({ productId: cartProductId, quantity: 1 }).unwrap();
            setAdded(true);
        }
        catch (error) {
            setErrorMessage(getRequestErrorMessage(error, "Не удалось добавить товар в корзину"));
        }
    };
    const handleFavorite = async () => {
        if (isAddingFavorite || isRemovingFavorite)
            return;
        if (requireAuth())
            return;
        setErrorMessage("");
        try {
            if (isFavorite) {
                await removeFavorite({ productId: favoriteProductId }).unwrap();
            }
            else {
                await addFavorite({ productId: favoriteProductId }).unwrap();
            }
        }
        catch (error) {
            setErrorMessage(getRequestErrorMessage(error, "Не удалось изменить избранное"));
        }
    };
    return (<div className={styles.buttons}>
      <MainButton onClick={handleAddToBasket} disabled={disabled || isUserLoading || isCartLoading || !cartProductId}>
        {disabled
            ? "Нет в наличии"
            : isCartLoading
                ? "Добавляем..."
                : added
                    ? "Перейти в корзину"
                    : "В корзину"}
      </MainButton>

      <MainButton alt="favorites-icon" type="button" icon={isFavorite ? FavoritesPullImage : FavoritesImage} mode="secondary" color="black" onClick={handleFavorite} disabled={isUserLoading || isAddingFavorite || isRemovingFavorite}>
        {isFavorite ? "Убрать из избранного" : "В избранное"}
      </MainButton>

      {errorMessage && <p className={styles.buttons__error}>{errorMessage}</p>}
    </div>);
};
export default ProductsButtons;
