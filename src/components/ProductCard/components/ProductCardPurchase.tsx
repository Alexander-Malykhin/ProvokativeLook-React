import { useRef, useState } from "react";
import { purchasableOffers } from '@store/api/catalog/purchasableOffers';
import { Link } from "react-router-dom";
import { useGetCatalogProductQuery } from "@store/api/catalog/catalogApi";
import { useAddCartItemMutation } from "@store/api/cart/cartApi";
import { useGetUserQuery } from "@store/api/user/userApi";
import { useAppDispatch } from "@store/hooks";
import { openAuthModal } from "@store/slices/toggleAuthModalSlice";
import { formatCatalogPrice } from "@store/api/catalog/format";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";
import styles from "./ProductCardPurchase.module.scss";

interface Props { slug: string; sectionSlug: string; fallbackPrice: string; title: string; onClose: () => void; }

const ProductCardPurchase = ({ slug, sectionSlug, fallbackPrice, title, onClose }: Props) => {
    const [offerId, setOfferId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState("1");
    const [message, setMessage] = useState("");
    const [added, setAdded] = useState(false);
    const addingRef = useRef(false);
    const dispatch = useAppDispatch();
    const { currentData: data, isFetching, isError, refetch } = useGetCatalogProductQuery({ slug, sectionSlug }, { refetchOnMountOrArgChange: true });
    const { data: userData, isLoading: isUserLoading } = useGetUserQuery();
    const [addCartItem, { isLoading: isAdding }] = useAddCartItemMutation();
    const product = data?.product;
    const available = purchasableOffers(product);
    const selected = available.find((offer) => offer.id === offerId) ?? available[0];
    const sizes = [...new Set(available.map((offer) => offer.size))];
    const colors = [...new Set(available.filter((offer) => offer.size === selected?.size).map((offer) => offer.color))];
    const maxQuantity = selected ? Math.floor(selected.quantity) : 999;
    const count = Number(quantity);
    const validQuantity = Number.isInteger(count) && count >= 1 && count <= maxQuantity;
    const soldOut = Boolean(product && !selected);
    const busy = isAdding || isFetching;

    const choose = (id: number | undefined) => {
        if (id === undefined) return;
        setOfferId(id);
        setQuantity("1");
        setAdded(false);
        setMessage("");
    };

    const add = async () => {
        if (!product || soldOut || !validQuantity || busy || addingRef.current) return;
        if (!userData?.success || !userData.user) {
            onClose();
            dispatch(openAuthModal("login"));
            return;
        }
        setMessage("");
        setAdded(false);
        addingRef.current = true;
        try {
            const result = await addCartItem({ productId: selected?.id ?? product.id, quantity: count }).unwrap();
            if (!result.success) throw new Error("Не удалось добавить товар в корзину");
            setAdded(true);
        } catch (error) {
            setMessage(getRequestErrorMessage(error, "Не удалось добавить товар в корзину"));
        } finally {
            await refetch();
            addingRef.current = false;
        }
    };

    return <div className={styles.purchase} aria-label={`Выбор параметров: ${title}`}>
        {sizes.some(Boolean) && <div className={styles.options} role="group" aria-label="Размер">
            <span className={styles.label}>Размер</span>
            {sizes.map((size) => <button type="button" key={size ?? ""} disabled={busy} aria-pressed={selected?.size === size} onClick={() => {
                const next = available.find((offer) => offer.size === size && offer.color === selected?.color) ?? available.find((offer) => offer.size === size);
                choose(next?.id);
            }}>{size || "Без размера"}</button>)}
        </div>}
        {colors.some(Boolean) && <div className={styles.options} role="group" aria-label="Цвет">
            <span className={styles.label}>Цвет</span>
            {colors.map((color) => <button type="button" key={color ?? ""} disabled={busy} aria-pressed={selected?.color === color} onClick={() => choose(available.find((offer) => offer.size === selected?.size && offer.color === color)?.id)}>{color || "Без цвета"}</button>)}
        </div>}
        {product && <div className={styles.quantityRow}>
            {!soldOut && <label className={styles.quantity}>Количество
                <input type="number" inputMode="numeric" min={1} max={maxQuantity} step={1} value={quantity} disabled={busy} onChange={(event) => { setQuantity(event.target.value); setAdded(false); setMessage(""); }}/>
            </label>}
            <span className={styles.stock} role="status" aria-live="polite">
                {selected ? `В наличии: ${maxQuantity} шт.` : soldOut ? "Нет доступного варианта с указанной ценой" : "Остаток не указан"}
            </span>
        </div>}
        <div className={styles.row}>
            <span>{product ? formatCatalogPrice(selected?.price ?? product.price, selected?.currency ?? product.currency) : fallbackPrice}</span>
            <button type="button" className={styles.add} disabled={!product || isError || soldOut || !validQuantity || busy || isUserLoading} onClick={() => void add()}>
                {soldOut ? "Покупка недоступна" : isAdding ? "Добавляем…" : "В корзину"}
            </button>
        </div>
        {isFetching && !product && <span role="status">Загрузка вариантов…</span>}
        {isError && <div role="alert">Не удалось загрузить варианты. <button type="button" onClick={() => void refetch()}>Повторить</button></div>}
        {product && !soldOut && !validQuantity && <span role="alert">Количество: от 1 до {maxQuantity}.</span>}
        {message && <span role="alert">{message}</span>}
        {added && <span role="status">Добавлено. <Link to="/basket" onClick={onClose}>В корзину</Link></span>}
    </div>;
};

export default ProductCardPurchase;
