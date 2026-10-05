import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/hooks";
import styles from "./ProductsButtons.module.scss";
import MainButton from "@UI/buttons/MainButton/MainButton.tsx";
import FavoritesImage from "@assets/basket/favorites.svg";
import FavoritesPullImage from "@assets/basket/favorites-pull.svg";
import { useAddCartItemMutation, useGetCartQuery } from "@store/api/cart/cartApi";
import { useAddFavoriteMutation, useGetFavoritesQuery, useRemoveFavoriteMutation, } from "@store/api/favorites/favoritesApi";
import { useGetUserQuery } from "@store/api/user/userApi";
import { openAuthModal } from "@store/slices/toggleAuthModalSlice";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";
import { useState } from "react";

interface ProductsButtonsProps {
    cartProductId: number | null;
    favoriteProductId: number;
    disabled?: boolean;
    availableQuantity: number;
}

const ProductsButtons = ({ cartProductId, favoriteProductId, disabled = false, availableQuantity, }: ProductsButtonsProps) => {
    const [quantity, setQuantity] = useState("1");
    const maxQuantity = Math.max(0, Math.floor(availableQuantity));
    const count = Number(quantity);
    const validQuantity = Number.isInteger(count) && count >= 1 && count <= maxQuantity;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { data: userData, isLoading: isUserLoading } = useGetUserQuery();
    const isAuthenticated = Boolean(userData?.success && userData.user);

    const { data: cartData } = useGetCartQuery(undefined, {
        skip: !isAuthenticated,
    });
    const [addCartItem, { isLoading: isCartLoading }] = useAddCartItemMutation();

    const { data: favoritesData } = useGetFavoritesQuery(undefined, {
        skip: !isAuthenticated,
    });
    const [addFavorite, { isLoading: isAddingFavorite }] = useAddFavoriteMutation();
    const [removeFavorite, { isLoading: isRemovingFavorite }] = useRemoveFavoriteMutation();
    const [errorMessage, setErrorMessage] = useState("");

    const isCurrentOfferInCart = useMemo(() => {
        if (!cartProductId) return false;
        return cartData?.cart?.items?.some((item) => {
            const basketProductId = Number(item.offerId || item.productId);
            return basketProductId === cartProductId;
        }) ?? false;
    }, [cartData?.cart?.items, cartProductId]);

    const isFavorite = useMemo(() => favoritesData?.ids?.includes(favoriteProductId) ?? favoritesData?.items.some((item) => item.id === favoriteProductId) ?? false, [favoritesData?.ids, favoritesData?.items, favoriteProductId]);

    const requireAuth = () => {
        if (isAuthenticated)
            return false;
        dispatch(openAuthModal("login"));
        return true;
    };

    const handleAddToBasket = async () => {
        if (!cartProductId || disabled || isCartLoading || (!isCurrentOfferInCart && !validQuantity))
            return;
        if (requireAuth())
            return;
        if (isCurrentOfferInCart) {
            navigate("/basket");
            return;
        }
        setErrorMessage("");
        try {
            await addCartItem({ productId: cartProductId, quantity: count }).unwrap();
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
      {!disabled && !isCurrentOfferInCart && <div className={styles.buttons__quantity}>
        <label htmlFor={`product-quantity-${cartProductId}`}>Количество</label>
        <button type="button" aria-label="Уменьшить количество" disabled={isCartLoading || count <= 1} onClick={() => setQuantity(String(Math.max(1, (count || 1) - 1)))}>−</button>
        <input id={`product-quantity-${cartProductId}`} type="number" inputMode="numeric" min={1} max={maxQuantity} step={1} value={quantity} disabled={isCartLoading} onChange={(event) => setQuantity(event.target.value)}/>
        <button type="button" aria-label="Увеличить количество" disabled={isCartLoading || count >= maxQuantity} onClick={() => setQuantity(String(Math.min(maxQuantity, (count || 0) + 1)))}>+</button>
        <span>В наличии: {maxQuantity} шт.</span>
      </div>}
      {!disabled && !isCurrentOfferInCart && !validQuantity && <p role="alert">Выберите от 1 до {maxQuantity} шт.</p>}
      <MainButton onClick={handleAddToBasket} disabled={disabled || isUserLoading || isCartLoading || !cartProductId || (!isCurrentOfferInCart && !validQuantity)}>
        {disabled
            ? "Нет в наличии"
            : isCartLoading
                ? "Добавляем..."
                : isCurrentOfferInCart
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
