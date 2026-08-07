import { forwardRef } from "react";

import styles from "../ProfileAddresses.module.scss";

interface AddressMapProps {
  isLoading: boolean;
}

const AddressMap = forwardRef<HTMLDivElement, AddressMapProps>(
  ({ isLoading }, ref) => (
    <div className={styles.modal__map}>
      <div ref={ref} className={styles.modal__mapContainer} />
      {isLoading && (
        <span className={styles.modal__mapText}>Загрузка карты...</span>
      )}
    </div>
  ),
);

AddressMap.displayName = "AddressMap";

export default AddressMap;
