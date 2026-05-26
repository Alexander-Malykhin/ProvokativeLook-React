import {Link} from "react-router-dom";
//styles
import styles from './NavigationItem.module.scss'
//types
import type {NavigationItemInterface} from "@components/Navigation/components/types/types.ts";

const NavigationItem = ({children, color, path}: NavigationItemInterface) => {
    return (
        <Link to={path} className={`${styles.item} ${styles[`item__color_${color}`]}`}>
            {children}
        </Link>
    );
};

export default NavigationItem;