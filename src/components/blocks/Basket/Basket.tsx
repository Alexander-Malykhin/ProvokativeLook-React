import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Basket.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
import OrderSummary from "@components/blocks/Basket/components/OrderSummary/OrderSummary.tsx";
import BasketList from "@components/blocks/Basket/components/BasketList/BasketList.tsx";
import BasketHeader from "@components/blocks/Basket/components/BasketHeader/BasketHeader.tsx";
import BasketButtonReset from "@components/blocks/Basket/UI/BasketButtonReset/BasketButtonReset.tsx";
import {
  useClearCartMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@store/api/cart/cartApi";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";

const BasketSkeleton = () => (
  <SectionLayout>
    <MainLayoutContainer className={styles.basket}>
      <div className={styles.basket__content}>
        <div className={styles.basket__skeletonHeader} />
        {[0, 1, 2].map((item) => (
          <div key={item} className={styles.basket__skeletonItem}>
            <div className={styles.basket__skeletonImage} />
            <div className={styles.basket__skeletonText}>
              <span />
              <span />
              <span />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.basket__skeletonSummary} />
    </MainLayoutContainer>
  </SectionLayout>
);

const Basket = () => {
  const navigate = useNavigate();
  const { data, isLoading, isFetching, error } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const cart = data?.cart;
  const items = useMemo(() => cart?.items ?? [], [cart?.items]);
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  useEffect(() => {
    const actualIds = new Set(items.map((item) => item.id));
    setSelectedIds((current) => {
      const next = current.filter((id) => actualIds.has(id));

      if (next.length === current.length && next.every((id, index) => id === current[index])) {
        return current;
      }

      return next;
    });
  }, [items]);

  const handleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : items.map((item) => item.id));
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    setSelectedIds((current) =>
      checked
        ? Array.from(new Set([...current, id]))
        : current.filter((itemId) => itemId !== id),
    );
  };

  const handleQuantityChange = async (id: number, quantity: number) => {
    setErrorMessage("");
    setUpdatingId(id);

    try {
      await updateCartItem({ id, quantity }).unwrap();
    } catch (requestError) {
      setErrorMessage(getRequestErrorMessage(requestError, "Не удалось изменить количество"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    setErrorMessage("");
    setUpdatingId(id);

    try {
      await removeCartItem({ id }).unwrap();
    } catch (requestError) {
      setErrorMessage(getRequestErrorMessage(requestError, "Не удалось удалить товар"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;

    setErrorMessage("");
    setIsBulkUpdating(true);

    try {
      await Promise.all(selectedIds.map((id) => removeCartItem({ id }).unwrap()));
      setSelectedIds([]);
    } catch (requestError) {
      setErrorMessage(getRequestErrorMessage(requestError, "Не удалось удалить выбранные товары"));
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleResetBasket = async () => {
    setErrorMessage("");
    setIsBulkUpdating(true);

    try {
      await clearCart().unwrap();
      setSelectedIds([]);
    } catch (requestError) {
      setErrorMessage(getRequestErrorMessage(requestError, "Не удалось очистить корзину"));
    } finally {
      setIsBulkUpdating(false);
    }
  };

  if (isLoading) {
    return <BasketSkeleton />;
  }

  if (error && !cart) {
    return (
      <SectionLayout>
        <MainLayoutContainer>
          <div className={styles.basket__error}>
            Не удалось загрузить корзину
          </div>
        </MainLayoutContainer>
      </SectionLayout>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <SectionLayout>
        <MainLayoutContainer className={styles.empty}>
          <div className={styles.empty__count}>0 товаров</div>
          <div className={styles.empty__row}>
            <span>В корзине ничего нет</span>
            <button type="button" onClick={() => navigate("/catalog")}>Перейти в каталог</button>
          </div>
        </MainLayoutContainer>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout>
      <MainLayoutContainer className={styles.basket}>
        <div className={styles.basket__content}>
          <BasketHeader
            isAllSelected={isAllSelected}
            hasSelectedItems={selectedIds.length > 0}
            onSelectAll={handleSelectAll}
            onDeleteSelected={handleDeleteSelected}
            disabled={isBulkUpdating}
          />

          {errorMessage && <div className={styles.basket__error}>{errorMessage}</div>}
          {isFetching && <div className={styles.basket__refreshLine} />}

          <BasketList
            items={items}
            selectedIds={selectedIds}
            onSelectItem={handleSelectItem}
            onQuantityChange={handleQuantityChange}
            onDelete={handleDelete}
            updatingId={updatingId}
          />

          <BasketButtonReset onClick={handleResetBasket} />
        </div>

        <OrderSummary cart={cart} />
      </MainLayoutContainer>
    </SectionLayout>
  );
};

export default Basket;
