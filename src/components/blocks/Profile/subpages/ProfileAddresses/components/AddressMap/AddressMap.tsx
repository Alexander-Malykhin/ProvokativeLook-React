import { forwardRef } from "react";

import styles from "./AddressMap.module.scss";

interface AddressMapProps {
  isLoading: boolean;
  fill?: boolean;
}

const AddressMap = forwardRef<HTMLDivElement, AddressMapProps>(
  ({ isLoading, fill = false }, ref) => (
    <div className={`${styles.map} ${fill ? styles.map_fill : ""}`}>
      <div ref={ref} className={styles.map__container} />
      {isLoading && (
        <span className={styles.map__loading}>Загрузка карты...</span>
      )}
    </div>
  ),
);

AddressMap.displayName = "AddressMap";

export default AddressMap;
