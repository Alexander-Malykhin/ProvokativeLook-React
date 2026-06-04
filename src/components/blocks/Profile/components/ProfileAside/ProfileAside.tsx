//styles
import styles from './ProfileAside.module.scss'
import {NavLink} from "react-router-dom";

import type {ReactNode} from 'react';

export interface ProfileNavigationItemInterface {
    id: number;
    url: string;
    title: string;
    component?: (title: string) => ReactNode;
}

export interface ProfileAsideInterface {
    navigation: ProfileNavigationItemInterface[];
}

const ProfileAside = ({navigation}: ProfileAsideInterface) => {


    return (
        <aside className={styles.aside}>
            {navigation.map(item => (
                <NavLink
                    key={item.id}
                    to={`/profile/${item.url}`}
                    className={({isActive}) =>
                        `${styles.aside__item} ${isActive ? styles.aside__item_active : ''}`
                    }
                >
                    {item.title}
                </NavLink>
            ))}
            <button className={styles.aside__button}>
                Выйти
            </button>
        </aside>
    );
};

export default ProfileAside;