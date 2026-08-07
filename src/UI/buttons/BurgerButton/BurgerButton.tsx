//styles
import styles from "./BurgerButton.module.scss";
//store
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { toggle } from "@store/slices/toggleMenuNavigationSlice";

const BurgerButton = () => {
  const dispatch = useAppDispatch();

  const active = useAppSelector((state) => state.toggleMenuNavigation.active);

  return (
    <button
      type="button"
      aria-label={active ? "Закрыть меню" : "Открыть меню"}
      aria-expanded={active}
      className={`${styles.burger} ${active ? styles.burger_active : ""}`}
      onClick={() => dispatch(toggle())}
    >
      <span className={styles.burger__line}></span>
      <span className={styles.burger__line}></span>
      <span className={styles.burger__line}></span>
    </button>
  );
};

export default BurgerButton;
