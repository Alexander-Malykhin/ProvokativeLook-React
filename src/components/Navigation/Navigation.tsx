//styles
import styles from "./Navigation.module.scss";
//components
import NavigationItem from "@components/Navigation/components/NavigationItem/NavigationItem.tsx";
//types
import type { NavigationInterface } from "./types/types.ts";

const Navigation = ({ items }: NavigationInterface) => {
  return (
    <nav className={styles.navigation}>
      {items.map((item) => (
        <NavigationItem key={item.id} item={item} />
      ))}
    </nav>
  );
};

export default Navigation;
