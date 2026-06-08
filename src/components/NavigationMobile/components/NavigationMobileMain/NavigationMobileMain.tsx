import {NavLink} from "react-router-dom";
//styles
import styles from "./NavigationMobileMain.module.scss";
//images
import arrowRightImage from "@assets/arrows/arrow-shevron-right.svg";
//UI
import Image from "@UI/buttons/Image/Image";
//types
import type {NavigationMobileMainInterface} from "./types";

const NavigationMobileMain = ({items, onOpenCatalog, onClose,}: NavigationMobileMainInterface) => {
    return (
        <nav className={styles.main}>
            {items.map((item) => {
                if (item.code === "catalog") {
                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={styles.main__item}
                            onClick={onOpenCatalog}
                        >
                            {item.title}
                            <Image
                                src={arrowRightImage}
                                alt="arrow-icon"
                                className={styles.main__item_image}
                            />
                        </button>
                    );
                }

                return (
                    <NavLink
                        key={item.id}
                        to={item.link}
                        className={`${styles.main__item} ${
                            item.code === "sale" ? styles.main__item_sale : ""
                        }`}
                        onClick={onClose}
                    >
                        {item.title}
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default NavigationMobileMain;