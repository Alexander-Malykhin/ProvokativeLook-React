import styles from './CarouselDots.module.scss';
import { carouselDotIndexes } from '@/helpers/carouselDots';
interface CarouselDotsProps {
  count: number;
  activeIndex: number;
  onChange: (index: number) => void;
  compact?: boolean;
  itemLabel?: string;
  maxVisible?: number;
}
const CarouselDots = ({
  count,
  activeIndex,
  onChange,
  compact = false,
  itemLabel = 'слайду',
  maxVisible,
}: CarouselDotsProps) => {
  if (count <= 1) return null;

  return (
    <div className={`${styles.dots} ${compact ? styles.dots_compact : styles.dots_mobile}`}>
      {carouselDotIndexes(count, activeIndex, maxVisible).map((index) => (
        <button
          key={index}
          type="button"
          className={`${styles.dots__item} ${activeIndex === index ? styles.dots__item_active : ''}`}
          onClick={() => onChange(index)}
          aria-current={activeIndex === index ? 'true' : undefined}
          aria-label={`Перейти к ${itemLabel} ${index + 1}`}
        />
      ))}
    </div>
  );
};
export default CarouselDots;
