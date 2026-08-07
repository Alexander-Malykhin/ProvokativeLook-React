import styles from "../ProfileAddresses.module.scss";
import type { ProfileAddress } from "../model/types";

interface AddressListProps {
  addresses: ProfileAddress[];
  onSetDefault: (addressId: number) => void;
}

const AddressList = ({ addresses, onSetDefault }: AddressListProps) => (
  <div className={styles.content__list}>
    {addresses.map((address) => (
      <article key={address.id} className={styles.content__item}>
        <button
          type="button"
          aria-label={`Выбрать адрес: ${address.title}`}
          aria-pressed={address.isDefault}
          className={`${styles.content__itemButton} ${
            address.isDefault ? styles.content__itemButton_active : ""
          }`}
          onClick={() => onSetDefault(address.id)}
        />

        <p className={styles.content__itemDescription}>
          {address.postalCode ? `${address.postalCode}, ` : ""}
          {address.formattedAddress}
          {address.address2 ? `, ${address.address2}` : ""}
        </p>
      </article>
    ))}
  </div>
);

export default AddressList;
