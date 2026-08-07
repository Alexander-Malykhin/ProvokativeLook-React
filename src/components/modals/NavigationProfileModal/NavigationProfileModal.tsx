import { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@store/hooks";

import { close } from "@store/slices/toggleMenuProfileSlice.ts";

import { openAuthModal } from "@store/slices/toggleAuthModalSlice.ts";

// api
import { useGetUserQuery, useLogoutMutation } from "@store/api/user/userApi.ts";

// data
import { navigationProfile } from "@api/static/navigationProfile.ts";

// components
import NavigationProfileItem from "@components/modals/NavigationProfileModal/components/NavigationProfileItem.tsx";

// styles
import styles from "./NavigationProfileModal.module.scss";

const NavigationProfileModal = () => {
  const dispatch = useAppDispatch();

  const modalRef = useRef<HTMLDivElement>(null);

  const active = useAppSelector((state) => state.toggleMenuProfile.active);

  const { data, isFetching } = useGetUserQuery();

  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

  const isAuthenticated = Boolean(data?.success && data.user);

  useEffect(() => {
    if (!active) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        target instanceof Element &&
        target.closest("[data-profile-button]")
      ) {
        return;
      }

      if (modalRef.current && !modalRef.current.contains(target)) {
        dispatch(close());
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [active, dispatch]);

  const handleOpenAuth = () => {
    dispatch(close());
    dispatch(openAuthModal("login"));
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(close());
    } catch {
      // Ошибку выхода при необходимости можно вывести уведомлением
    }
  };

  if (!active) {
    return null;
  }

  return (
    <div ref={modalRef} className={styles.modal}>
      {isFetching ? (
        <div className={styles.modal__loading}>Загрузка...</div>
      ) : isAuthenticated ? (
        <>
          <div className={styles.modal__user}>
            <span className={styles.modal__user_name}>
              {data?.user.firstName} {data?.user.lastName}
            </span>

            <span className={styles.modal__user_email}>{data?.user.email}</span>
          </div>

          <div className={styles.modal__list}>
            {navigationProfile.map((item) => (
              <NavigationProfileItem
                key={item.id}
                item={item}
                onClose={() => dispatch(close())}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.modal__button}
            onClick={handleLogout}
            disabled={isLogoutLoading}
          >
            {isLogoutLoading ? "Выходим..." : "Выйти"}
          </button>
        </>
      ) : (
        <div className={styles.modal__guest}>
          <span className={styles.modal__guest_title}>Личный кабинет</span>

          <p className={styles.modal__guest_text}>
            Войдите или зарегистрируйтесь, чтобы видеть заказы и сохранять свои
            данные
          </p>

          <button
            type="button"
            className={styles.modal__login}
            onClick={handleOpenAuth}
          >
            Войти
          </button>
        </div>
      )}
    </div>
  );
};

export default NavigationProfileModal;
