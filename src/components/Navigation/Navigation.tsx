import { NavLink } from "react-router-dom";
//styles
import styles from "./Navigation.module.scss";
//types
import type { NavigationInterface } from "./types";

const Navigation = ({ items }: NavigationInterface) => {
    return (
        <nav className={styles.navigation}>
            {items.map((item) => (
                <NavLink
                    key={item.id}
                    to={item.link}
                    className={`${styles.navigation__item} ${
                        item.code === "sale" ? styles.navigation__item_sale : ""
                    }`}
                >
                    {item.title}
                </NavLink>
            ))}
        </nav>
    );
};

export default Navigation;