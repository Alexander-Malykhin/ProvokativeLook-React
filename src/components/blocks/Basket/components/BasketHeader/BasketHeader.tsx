import styles from './BasketHeader.module.scss';

import InputCheck from '@components/blocks/Basket/UI/InputCheck/InputCheck.tsx';

interface BasketHeaderProps {
    isAllSelected: boolean;
    hasSelectedItems: boolean;
    onSelectAll: () => void;
    onDeleteSelected: () => void;
}

const BasketHeader = ({isAllSelected, hasSelectedItems, onSelectAll, onDeleteSelected,}: BasketHeaderProps) => {
    return (
        <div className={styles.header}>
            <button
                type="button"
                className={styles.header__select}
                onClick={onSelectAll}
            >
                <InputCheck checked={isAllSelected} onChange={onSelectAll} />

                <span>Выбрать все</span>
            </button>

            <button
                type="button"
                className={styles.header__delete}
                onClick={onDeleteSelected}
                disabled={!hasSelectedItems}
            >
                Удалить выбранное
            </button>
        </div>
    );
};

export default BasketHeader;