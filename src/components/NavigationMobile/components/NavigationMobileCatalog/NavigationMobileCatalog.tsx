import { NavLink } from "react-router-dom";
import styles from "./NavigationMobileCatalog.module.scss";
import arrowRightImage from "@assets/arrows/arrow-shevron-right.svg";
import Image from "@UI/media/Image/Image";
import type { NavigationMobileCatalogInterface } from "./types";
import { useGetCatalogSectionsQuery } from "@store/api/catalog/catalogApi";
import { slugifyCatalogValue } from "@/helpers/catalog";
const NavigationMobileCatalog = ({ onBack, onClose, }: NavigationMobileCatalogInterface) => {
    const { data } = useGetCatalogSectionsQuery();
    const catalogItems = [
        { text: "СМОТРЕТЬ ВСЁ", path: "/catalog/all" },
        ...(data?.sections ?? []).map((item) => ({
            text: item.name,
            path: `/catalog/${slugifyCatalogValue(item.code || item.name)}`,
        })),
    ];
    return (<nav className={styles.catalog}>
      <button type="button" className={styles.catalog__back} onClick={onBack}>
        <Image src={arrowRightImage} alt="arrow-icon" className={styles.catalog__back_image}/>
        Каталог
      </button>

      <div className={styles.catalog__list}>
        {catalogItems.map((item) => (<NavLink key={item.path} to={item.path} className={styles.catalog__item} onClick={onClose}>
            {item.text}
          </NavLink>))}
      </div>
    </nav>);
};
export default NavigationMobileCatalog;
