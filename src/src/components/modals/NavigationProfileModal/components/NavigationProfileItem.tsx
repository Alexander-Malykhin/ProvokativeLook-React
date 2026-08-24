import { NavLink } from "react-router-dom";
import styles from "./NavigationProfileItem.module.scss";
import type { NavigationProfileItemProps } from "@components/modals/NavigationProfileModal/types/types.ts";
const NavigationProfileItem = ({ item, onClose, }: NavigationProfileItemProps) => {
    return (<NavLink to={item.url} className={({ isActive }) => `${styles.item} ${isActive ? styles.item__active : ""}`} onClick={onClose}>
      {item.title}
    </NavLink>);
};
export default NavigationProfileItem;

