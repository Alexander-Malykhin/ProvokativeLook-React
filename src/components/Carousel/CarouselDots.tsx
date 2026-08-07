import styles from "./CarouselDots.module.scss";

interface CarouselDotsProps {
  count: number;
  activeIndex: number;
  onChange: (index: number) => void;
  compact?: boolean;
  itemLabel?: string;
}

const CarouselDots = ({
  count,
  activeIndex,
  onChange,
  compact = false,
  itemLabel = "слайду",
}: CarouselDotsProps) => (
  <div
    className={`${styles.dots} ${
      compact ? styles.dots_compact : styles.dots_mobile
    }`}
  >
    {Array.from({ length: count }).map((_, index) => (
      <button
        key={index}
        type="button"
        className={`${styles.dots__item} ${
          activeIndex === index ? styles.dots__item_active : ""
        }`}
        onClick={() => onChange(index)}
        aria-label={`Перейти к ${itemLabel} ${index + 1}`}
      />
    ))}
  </div>
);

export default CarouselDots;
