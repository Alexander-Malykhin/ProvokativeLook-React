import styles from "./AddressList.module.scss";
import type { ProfileAddress } from "../../model/types";

interface AddressListProps {
  addresses: ProfileAddress[];
  onSetDefault: (addressId: number) => void;
  onDelete: (addressId: number) => void;
  disabled?: boolean;
}

const getProviderName = (address: ProfileAddress) =>
  address.deliveryProvider === "mail" ? "Почта России" : "СДЭК";

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
          <div className={styles.list__topline}>
            <strong>{getProviderName(address)}</strong>
            {address.pickupName && <span>{address.pickupName}</span>}
            {address.isDefault && <small>Основной</small>}
          </div>
          <p className={styles.list__description}>
            {address.formattedAddress || address.address1}
          </p>
          {(address.postalCode || address.pickupCode) && (
            <div className={styles.list__meta}>
              {address.postalCode && <span>Индекс {address.postalCode}</span>}
              {address.pickupCode && <span>Код пункта {address.pickupCode}</span>}
            </div>
          )}
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
