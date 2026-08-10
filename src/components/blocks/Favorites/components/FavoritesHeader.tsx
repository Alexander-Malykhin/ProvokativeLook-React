import styles from "./FavoritesHeader.module.scss";

interface FavoritesHeaderProps {
  count: number;
  onClear: () => void;
  isClearing?: boolean;
}

const plural = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товара";
  return "товаров";
};

const FavoritesHeader = ({ count, onClear, isClearing = false }: FavoritesHeaderProps) => (
  <div className={styles.header}>
    <span className={styles.header__count}>{count} {plural(count)}</span>
    {count > 0 && (
      <button className={styles.header__button} onClick={onClear} disabled={isClearing}>
        {isClearing ? "Очищаем..." : "Очистить избранное"}
      </button>
    )}
  </div>
);

export default FavoritesHeader;
