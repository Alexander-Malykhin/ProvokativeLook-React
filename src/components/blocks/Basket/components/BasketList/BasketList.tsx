//styles
import styles from './BasketList.module.scss';
//components
import BasketItem from '@components/blocks/Basket/components/BasketItem/BasketItem.tsx';

interface BasketProduct {
    id: number;
    image: string;
    title: string;
    article: string;
    size: string;
    color: string;
    count: number;
    price: string;
}

interface BasketListProps {
    items: BasketProduct[];
    selectedIds: number[];
    onSelectItem: (id: number, checked: boolean) => void;
}

const BasketList = ({ items, selectedIds, onSelectItem }: BasketListProps) => {
    return (
        <div className={styles.list}>
            {items.map((item) => (
                <BasketItem
                    key={item.id}
                    item={item}
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={(checked) => onSelectItem(item.id, checked)}
                />
            ))}
        </div>
    );
};

export default BasketList;