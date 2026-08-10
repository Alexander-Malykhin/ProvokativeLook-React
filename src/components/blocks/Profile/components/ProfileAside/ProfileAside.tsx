import { useEffect, useMemo, useState } from "react";

// styles
import styles from "./ProfileAside.module.scss";

// types
import type { ProfileAsideInterface } from "@components/blocks/Profile/types/types.ts";

// router
import { NavLink, useLocation, useNavigate } from "react-router-dom";

// store/api
import { useAppDispatch } from "@store/hooks";
import { baseApi } from "@store/api/baseApi";
import { useLogoutMutation } from "@store/api/user/userApi";

const ProfileAside = ({ navigation }: ProfileAsideInterface) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [isOpen, setIsOpen] = useState(false);

  const activeItem = useMemo(() => {
    return (
      navigation.find((item) =>
        location.pathname.includes(`/profile/${item.url}`),
      ) ?? navigation[0]
    );
  }, [location.pathname, navigation]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      await logout().unwrap();
      dispatch(baseApi.util.resetApiState());
      setIsOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("[PROFILE LOGOUT ERROR]", error);
    }
  };

  return (
    <aside className={styles.aside}>
      <div className={styles.aside__desktop}>
        <nav className={styles.aside__navigation}>
          {navigation.map((item) => (
            <NavLink
              key={item.id}
              to={`/profile/${item.url}`}
              className={({ isActive }) =>
                `${styles.aside__item} ${isActive ? styles.aside__item_active : ""}`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className={styles.aside__button}
          onClick={() => void handleLogout()}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Выходим..." : "Выйти"}
        </button>
      </div>

      <div className={styles.aside__mobile}>
        <button
          type="button"
          className={`${styles.aside__select} ${isOpen ? styles.aside__select_open : ""}`}
          onClick={() => setIsOpen((prevState) => !prevState)}
          aria-expanded={isOpen}
        >
          <span className={styles.aside__select_value}>{activeItem?.title}</span>
          <span className={styles.aside__select_arrow} />
        </button>

        <div
          className={`${styles.aside__dropdown} ${isOpen ? styles.aside__dropdown_open : ""}`}
        >
          <div className={styles.aside__dropdown_inner}>
            {navigation.map((item) => (
              <NavLink
                key={item.id}
                to={`/profile/${item.url}`}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `${styles.aside__dropdown_item} ${
                    isActive ? styles.aside__dropdown_item_active : ""
                  }`
                }
              >
                {item.title}
              </NavLink>
            ))}

            <button
              type="button"
              className={styles.aside__dropdown_logout}
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Выходим..." : "Выйти"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProfileAside;
