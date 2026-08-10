import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
// styles
import styles from "./InfoAside.module.scss";
// types
import type { InfoAsideInterface } from "@components/blocks/InfoComponent/components/InfoAside/types/types.ts";


const InfoAside = ({ pages }: InfoAsideInterface) => {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const activeItem = useMemo(() => {
    return (
        pages.find((page) =>
            location.pathname.includes(`/info/${page.url}`)
        ) ?? pages[0]
    );
  }, [location.pathname, pages]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
      <aside className={styles.aside}>
        <div className={styles.aside__desktop}>
          <nav className={styles.aside__navigation}>
            {pages.map((page) => (
                <NavLink
                    key={page.id}
                    to={`/info/${page.url}`}
                    className={({ isActive }) =>
                        `${styles.aside__item} ${
                            isActive ? styles.aside__item_active : ""
                        }`
                    }
                >
                  {page.title}
                </NavLink>
            ))}
          </nav>
        </div>

        <div className={styles.aside__mobile}>
          <button
              type="button"
              className={`${styles.aside__select} ${
                  isOpen ? styles.aside__select_open : ""
              }`}
              onClick={() => setIsOpen((prevState) => !prevState)}
              aria-expanded={isOpen}
          >
          <span className={styles.aside__select_value}>
            {activeItem?.title}
          </span>

            <span className={styles.aside__select_arrow} />
          </button>

          <div
              className={`${styles.aside__dropdown} ${
                  isOpen ? styles.aside__dropdown_open : ""
              }`}
          >
            <div className={styles.aside__dropdown_inner}>
              {pages.map((page) => (
                  <NavLink
                      key={page.id}
                      to={`/info/${page.url}`}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                          `${styles.aside__dropdown_item} ${
                              isActive
                                  ? styles.aside__dropdown_item_active
                                  : ""
                          }`
                      }
                  >
                    {page.title}
                  </NavLink>
              ))}
            </div>
          </div>
        </div>
      </aside>
  );
};

export default InfoAside;