import {NavLink} from "react-router-dom";
//styles
import styles from './InfoAside.module.scss'
//types
import type {InfoAsideInterface} from "@components/blocks/InfoComponent/components/InfoAside/types/types.ts";


const InfoAside = ({pages}: InfoAsideInterface) => {
    return (
        <aside className={styles.aside}>
            {
                pages.map(page => (
                    <NavLink
                        key={page.id}
                        to={`/${page.url}`}
                        className={({isActive}) => `${styles.aside__item} ${isActive ? styles.aside__item_active : ''}`}
                    >
                        {page.title}
                    </NavLink>
                ))
            }
        </aside>
    );
};

export default InfoAside;