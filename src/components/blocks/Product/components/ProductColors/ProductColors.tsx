import styles from "./ProductColors.module.scss";

interface ProductColorsProps {
  colors: string[];
  selectedColor: string | null;
  disabledColors?: string[];
  onChange: (color: string) => void;
}

const COLOR_MAP: Record<string, string> = {
  Синий: "#2419df",
  Голубой: "#2da7dc",
  Серый: "#918484",
  Белый: "#fff7f7",
  Черный: "#111111",
  Чёрный: "#111111",
  Бежевый: "#e4c3a5",
  Красный: "#ab0808",
  Розовый: "#ec61d2",
  Зеленый: "#3d934f",
  Зелёный: "#3d934f",
};

const ProductColors = ({
  colors,
  selectedColor,
  disabledColors = [],
  onChange,
}: ProductColorsProps) => (
  <div className={styles.colors}>
    <h2 className={styles.colors__title}>цвет</h2>

    <div className={styles.colors__list}>
      {colors.map((color) => {
        const disabled = disabledColors.includes(color);
        return (
          <button
            key={color}
            type="button"
            title={disabled ? `${color} — нет в наличии` : color}
            aria-label={`Цвет ${color}`}
            aria-pressed={selectedColor === color}
            disabled={disabled}
            onClick={() => onChange(color)}
            className={`${styles.colors__item} ${
              selectedColor === color ? styles.colors__item_active : ""
            } ${disabled ? styles.colors__item_disabled : ""}`}
          >
            <span style={{ backgroundColor: COLOR_MAP[color] ?? "#d9d9d9" }} />
          </button>
        );
      })}
    </div>
  </div>
);

export default ProductColors;
