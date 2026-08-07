import styles from "./AddressList.module.scss";
import type { ProfileAddress } from "../../model/types";

interface AddressListProps {
  addresses: ProfileAddress[];
  onSetDefault: (addressId: number) => void;
}

const AddressList = ({ addresses, onSetDefault }: AddressListProps) => (
  <div className={styles.list}>
    {addresses.map((address) => (
      <article key={address.id} className={styles.list__item}>
        <button
          type="button"
          aria-label={`Выбрать адрес: ${address.title}`}
          aria-pressed={address.isDefault}
          className={`${styles.list__button} ${
            address.isDefault ? styles.list__button_active : ""
          }`}
          onClick={() => onSetDefault(address.id)}
        />

        <p className={styles.list__description}>
          {address.postalCode ? `${address.postalCode}, ` : ""}
          {address.formattedAddress}
          {address.address2 ? `, ${address.address2}` : ""}
        </p>
      </article>
    ))}
  </div>
);

export default AddressList;
