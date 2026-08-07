import { NavLink } from "react-router-dom";
//styles
import styles from "./NavigationItem.module.scss";
//types
import type { NavigationItemProps } from "@components/Navigation/types/types.ts";

const NavigationItem = ({ item }: NavigationItemProps) => {
  return (
    <NavLink
      key={item.id}
      to={item.link}
      className={`${styles.item} ${
        item.code === "sale" ? styles.item__sale : ""
      }`}
    >
      {item.title}
    </NavLink>
  );
};

export default NavigationItem;
