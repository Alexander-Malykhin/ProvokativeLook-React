import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import type { RootState, AppDispatch } from "@store/store";
//store
import { close } from "@store/slices/toggleMenuProfileSlice";
//styles
import styles from "./NavigationProfileModal.module.scss";
//api
import {navigationProfile} from "@api/static/navigationProfile.ts";

const NavigationProfileModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const modalRef = useRef<HTMLDivElement>(null);

    const active = useSelector(
        (state: RootState) => state.toggleMenuProfile.active
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (target.closest(`.${styles.actions__user}`)) {
                return;
            }

            if (
                modalRef.current &&
                !modalRef.current.contains(target)
            ) {
                dispatch(close());
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [dispatch]);

    if (!active) return null;

    return (
        <div ref={modalRef} className={styles.modal}>
            <div className={styles.modal__list}>
                {navigationProfile.map(item => <NavLink
                    key={item.id}
                    to={item.url}
                    className={({ isActive }) =>
                        `${styles.modal__item} ${isActive ? styles.modal__item_active : ""}`
                    }
                    onClick={() => dispatch(close())}
                >
                    {item.title}
                </NavLink>)}
            </div>
        </div>
    );
};

export default NavigationProfileModal;