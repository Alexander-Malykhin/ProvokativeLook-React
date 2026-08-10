import styles from "./AddressList.module.scss";
import type { ProfileAddress } from "../../model/types";

interface AddressListProps {
  addresses: ProfileAddress[];
  onSetDefault: (addressId: number) => void;
  onDelete: (addressId: number) => void;
  disabled?: boolean;
}

const AddressList = ({ addresses, onSetDefault, onDelete, disabled = false }: AddressListProps) => (
  <div className={styles.list}>
    {addresses.map((address) => (
      <article key={address.id} className={styles.list__item}>
        <button
          type="button"
          aria-label={`Сделать основным: ${address.title}`}
          aria-pressed={address.isDefault}
          disabled={disabled || address.isDefault}
          className={`${styles.list__radio} ${address.isDefault ? styles.list__radio_active : ""}`}
          onClick={() => onSetDefault(address.id)}
        />

        <div className={styles.list__content}>
          <p className={styles.list__description}>
            {address.postalCode ? `${address.postalCode}, ` : ""}
            {address.formattedAddress}
            {address.address2 ? `, ${address.address2}` : ""}
          </p>

          <div className={styles.list__meta}>
            {address.isDefault && <span>Основной адрес</span>}
            {address.country && <span>{address.country}</span>}
          </div>
        </div>

        <button
          type="button"
          className={styles.list__delete}
          disabled={disabled}
          aria-label="Удалить адрес"
          onClick={() => onDelete(address.id)}
        >
          Удалить
        </button>
      </article>
    ))}
  </div>
);

export default AddressList;
