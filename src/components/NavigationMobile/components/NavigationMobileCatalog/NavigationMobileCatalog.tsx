import { NavLink } from "react-router-dom";
//styles
import styles from "./NavigationMobileCatalog.module.scss";
//images
import arrowRightImage from "@assets/arrows/arrow-shevron-right.svg";
//UI
import Image from "@UI/buttons/Image/Image";
//types
import type { NavigationMobileCatalogInterface } from "./types";

const catalogItems = [
    { text: "СМОТРЕТЬ ВСЁ", path: "/catalog" },
    { text: "Комбинезоны и костюмы", path: "/catalog/kombinezony-i-kostyumy" },
    { text: "Верхняя одежда", path: "/catalog/verhnyaya-odezhda" },
    { text: "Платья и сарафаны", path: "/catalog/platya-i-sarafany" },
    { text: "Обувь", path: "/catalog/obuv" },
    { text: "Брюки и шорты", path: "/catalog/bryuki-i-shorty" },
    { text: "Комплекты", path: "/catalog/komplekty" },
    { text: "Топы и футболки", path: "/catalog/topy-i-futbolki" },
    { text: "Юбки", path: "/catalog/yubki" },
];

const NavigationMobileCatalog = ({onBack, onClose,}: NavigationMobileCatalogInterface) => {
    return (
        <nav className={styles.catalog}>
            <button
                type="button"
                className={styles.catalog__back}
                onClick={onBack}
            >
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