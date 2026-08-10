import styles from "./BasketItem.module.scss";
import BasketActions from "@components/blocks/Basket/components/BasketItem/components/BasketActions/BasketActions.tsx";
import BasketCounter from "@components/blocks/Basket/components/BasketCounter/BasketCounter.tsx";
import Image from "@UI/media/Image/Image";
import InputCheck from "@components/blocks/Basket/UI/InputCheck/InputCheck.tsx";
import type { CartItem } from "@store/api/cart/types";
import { useAddFavoriteMutation, useGetFavoritesQuery, useRemoveFavoriteMutation } from "@store/api/favorites/favoritesApi";

interface BasketItemProps {
  item: CartItem;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onQuantityChange: (quantity: number) => void;
  onDelete: () => void;
  isUpdating?: boolean;
}

const formatMoney = (value: number, currency: string) => {
  const formatted = new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(value);

  return currency === "RUB" ? `${formatted} ₽` : `${formatted} ${currency}`;
};

const BasketItem = ({
  item,
  checked,
  onCheckedChange,
  onQuantityChange,
  onDelete,
  isUpdating = false,
}: BasketItemProps) => {
  const count = Math.max(1, Math.round(item.quantity));
  const { data: favoritesData } = useGetFavoritesQuery();
  const [addFavorite, { isLoading: isAddingFavorite }] = useAddFavoriteMutation();
  const [removeFavorite, { isLoading: isRemovingFavorite }] = useRemoveFavoriteMutation();
  const isFavorite = favoritesData?.items.some((favorite) => favorite.id === item.productId) ?? false;
  const favoriteBusy = isAddingFavorite || isRemovingFavorite;

  const handleFavorite = async () => {
    if (favoriteBusy) return;
    if (isFavorite) {
      await removeFavorite({ productId: item.productId });
    } else {
      await addFavorite({ productId: item.productId });
    }
  };
  const descriptionParts = [
    `Арт. ${item.article}`,
    item.size ? `Размер: ${item.size}` : null,
    item.color ? `Цвет: ${item.color}` : null,
  ].filter(Boolean);

  const handleDecrease = () => {
    if (isUpdating || count <= 1) return;
    onQuantityChange(count - 1);
  };

  const handleIncrease = () => {
    if (isUpdating || count >= item.availableQuantity) return;
    onQuantityChange(count + 1);
  };

  return (
    <article className={styles.item}>
      <InputCheck
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />

      <div className={styles.item__body}>
        <div className={styles.item__top}>
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              className={styles.item__image}
            />
          ) : (
            <div className={`${styles.item__image} ${styles.item__image_empty}`} />
          )}

          <div className={styles.item__content}>
            <div className={styles.item__main}>
              <div className={styles.item__header}>
                <h2 className={styles.item__header_title}>{item.name}</h2>

                <div className={styles.item__header_buttons}>
                  <BasketActions onDelete={onDelete} onFavorite={handleFavorite} isFavorite={isFavorite} disabled={isUpdating || favoriteBusy} />
                </div>
              </div>

              <div className={styles.item__body}>
                <p className={styles.item__body_description}>
                  {descriptionParts.join(" / ")}
                </p>
              </div>

              {!item.isAvailable && (
                <p className={styles.item__stockError}>
                  {item.availabilityMessage ?? "Товар недоступен"}
                </p>
              )}

              <div className={styles.item__mobile_body}>
                <p className={styles.item__mobile_body_description}>Арт. {item.article}</p>
                {item.size && (
                  <p className={styles.item__mobile_body_description}>Размер: {item.size}</p>
                )}
                {item.color && (
                  <p className={styles.item__mobile_body_description}>Цвет: {item.color}</p>
                )}
              </div>
            </div>

            <div className={styles.item__footer}>
              <div className={styles.item__footer_counter}>
                <BasketCounter
                  count={count}
                  onDecrease={handleDecrease}
                  onIncrease={handleIncrease}
                />
              </div>

              <span className={styles.item__footer_price}>
                {formatMoney(item.sum, item.currency)}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.item__bottom}>
          <BasketCounter
            count={count}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
          />

          <BasketActions onDelete={onDelete} onFavorite={handleFavorite} isFavorite={isFavorite} disabled={isUpdating || favoriteBusy} />
        </div>
      </div>
    </article>
  );
};

export default BasketItem;
