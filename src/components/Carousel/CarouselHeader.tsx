import ArrowLeftImage from "@assets/arrows/arrow-left-gray.svg";
import ArrowRightImage from "@assets/arrows/arrow-right-gray.svg";
import Image from "@UI/media/Image/Image";
import styles from "./CarouselHeader.module.scss";

interface CarouselHeaderProps {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  hideControlsAt?: "mobile" | "desktop";
}

const CarouselHeader = ({
  title,
  onPrevious,
  onNext,
  hideControlsAt = "mobile",
}: CarouselHeaderProps) => (
  <div
    className={`${styles.column} ${
      hideControlsAt === "desktop"
        ? styles.column_desktop
        : styles.column_mobile
    }`}
  >
    <h2 className={styles.column__title}>{title}</h2>
    <div className={styles.column__buttons}>
      <button
        type="button"
        aria-label="Предыдущий слайд"
        className={styles.column__arrow}
        onClick={onPrevious}
      >
        <Image
          src={ArrowLeftImage}
          alt=""
          className={styles.column__arrow_image}
        />
      </button>
      <button
        type="button"
        aria-label="Следующий слайд"
        className={styles.column__arrow}
        onClick={onNext}
      >
        <Image
          src={ArrowRightImage}
          alt=""
          className={styles.column__arrow_image}
        />
      </button>
    </div>
  </div>
);

export default CarouselHeader;
