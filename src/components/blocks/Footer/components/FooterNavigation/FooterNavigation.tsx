import { Link } from "react-router-dom";
//types
import type { FooterNavigationProps } from "./types";
//styles
import styles from "./FooterNavigation.module.scss";

const FooterNavigation = ({ items, opened, onToggle }: FooterNavigationProps) => {
    return (
        <nav className={styles.nav}>
            {items.map((item) => {
                const title = item.navigationTitle;
                const isOpen = opened === title;

                return (
                    <div
                        key={item.id}
                        className={`${styles.nav__item} ${isOpen ? styles.nav__item_open : ""}`}
                    >
                        <button
                            type="button"
                            className={styles.nav__item_head}
                            onClick={() => onToggle(isOpen ? null : title)}
                        >
                            <span className={styles.nav__item_title}>{title}</span>
                            <span className={styles.nav__item_arrow} />
                        </button>

                        <div className={styles.nav__item_list}>
                            {item.navigationList.map((link) => (
                                <Link
                                    key={link.title}
                                    to={link.link.replace(/^-/, "")}
                                    className={styles.nav__item_link}
                                >
                                    {link.title.replace(/^-/, "")}
                                </Link>
                            ))}
                        </div>
                    </div>
                );
            })}
        </nav>
    );
};

export default FooterNavigation;