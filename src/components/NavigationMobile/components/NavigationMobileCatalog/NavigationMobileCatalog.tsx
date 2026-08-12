import { NavLink } from "react-router-dom";
//styles
import styles from "./NavigationMobileCatalog.module.scss";
//images
import arrowRightImage from "@assets/arrows/arrow-shevron-right.svg";
//UI
import Image from "@UI/media/Image/Image";
//types
import type { NavigationMobileCatalogInterface } from "./types";
import { navigationCategoryCatalog } from "@api/static/navigationCategoryCatalog";

const catalogItems = [
  { text: "СМОТРЕТЬ ВСЁ", path: "/catalog/all" },
  ...navigationCategoryCatalog.map((item) => ({
    text: item.title.replaceAll("#br#", ""),
    path: item.path,
  })),
];

const NavigationMobileCatalog = ({
  onBack,
  onClose,
}: NavigationMobileCatalogInterface) => {
  return (
    <nav className={styles.catalog}>
      <button type="button" className={styles.catalog__back} onClick={onBack}>
        <Image
          src={arrowRightImage}
          alt="arrow-icon"
          className={styles.catalog__back_image}
        />
        Каталог
      </button>

      <div className={styles.catalog__list}>
        {catalogItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={styles.catalog__item}
            onClick={onClose}
          >
            {item.text}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default NavigationMobileCatalog;
