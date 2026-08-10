import styles from "./BasketList.module.scss";
import BasketItem from "@components/blocks/Basket/components/BasketItem/BasketItem.tsx";
import type { CartItem } from "@store/api/cart/types";

interface BasketListProps {
  items: CartItem[];
  selectedIds: number[];
  onSelectItem: (id: number, checked: boolean) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  onDelete: (id: number) => void;
  updatingId?: number | null;
}

const BasketList = ({
  items,
  selectedIds,
  onSelectItem,
  onQuantityChange,
  onDelete,
  updatingId = null,
}: BasketListProps) => {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <BasketItem
          key={item.id}
          item={item}
          checked={selectedIds.includes(item.id)}
          onCheckedChange={(checked) => onSelectItem(item.id, checked)}
          onQuantityChange={(quantity) => onQuantityChange(item.id, quantity)}
          onDelete={() => onDelete(item.id)}
          isUpdating={updatingId === item.id}
        />
      ))}
    </div>
  );
};

export default BasketList;
