import {useState} from "react";
//styles
import styles from './Basket.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//components
import OrderSummary from "@components/blocks/Basket/components/OrderSummary/OrderSummary.tsx";
import BasketList from "@components/blocks/Basket/components/BasketList/BasketList.tsx";
import BasketHeader from "@components/blocks/Basket/components/BasketHeader/BasketHeader.tsx";
//UI
import BasketButtonReset from "@components/blocks/Basket/UI/BasketButtonReset/BasketButtonReset.tsx";

const basketItems = [
    {
        id: 1,
        image: 'products/product-1.png',
        title: 'Костюм женский',
        article: '00000000',
        size: '46',
        color: 'оранжево-зеленый',
        count: 1,
        price: '17 500 ₽',
    },
    {
        id: 2,
        image: 'products/product-1.png',
        title: 'Костюм женский',
        article: '00000000',
        size: '46',
        color: 'оранжево-зеленый',
        count: 1,
        price: '17 500 ₽',
    },
    {
        id: 3,
        image: 'products/product-1.png',
        title: 'Костюм женский',
        article: '00000000',
        size: '46',
        color: 'оранжево-зеленый',
        count: 1,
        price: '17 500 ₽',
    },
];

const Basket = () => {
    const [items, setItems] = useState(basketItems);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const isAllSelected = items.length > 0 && selectedIds.length === items.length;

    const handleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? items.map((item) => item.id) : []);
    };

    const handleSelectItem = (id: number, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)
        );
    };

    const handleResetBasket = () => {
        setItems([]);
        setSelectedIds([]);
    };

    const handleDeleteSelected = () => {
        setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
        setSelectedIds([]);
    };

    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.basket}>
                <div className={styles.basket__content}>
                    <BasketHeader
                        isAllSelected={isAllSelected}
                        hasSelectedItems={selectedIds.length > 0}
                        onSelectAll={() => handleSelectAll(!isAllSelected)}
                        onDeleteSelected={handleDeleteSelected}
                    />

                    <BasketList
                        items={items}
                        selectedIds={selectedIds}
                        onSelectItem={handleSelectItem}
                    />

                    <BasketButtonReset onClick={handleResetBasket}/>
                </div>

                <OrderSummary/>
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default Basket;