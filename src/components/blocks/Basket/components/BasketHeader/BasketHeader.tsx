import styles from "./BasketHeader.module.scss";
import InputCheck from "@components/blocks/Basket/UI/InputCheck/InputCheck.tsx";

interface BasketHeaderProps {
  isAllSelected: boolean;
  hasSelectedItems: boolean;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  disabled?: boolean;
}

const BasketHeader = ({
  isAllSelected,
  hasSelectedItems,
  onSelectAll,
  onDeleteSelected,
  disabled = false,
}: BasketHeaderProps) => {
  return (
    <div className={styles.header}>
      <button
        type="button"
        className={styles.header__select}
        onClick={onSelectAll}
        disabled={disabled}
      >
        <InputCheck
          checked={isAllSelected}
          onChange={(event) => {
            event.stopPropagation();
            onSelectAll();
          }}
        />

        <span>Выбрать все</span>
      </button>

      <button
        type="button"
        className={styles.header__delete}
        onClick={onDeleteSelected}
        disabled={!hasSelectedItems || disabled}
      >
        Удалить выбранное
      </button>
    </div>
  );
};

export default BasketHeader;
