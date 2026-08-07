import { useState } from "react";

import type { ProfilePageProps } from "@components/blocks/Profile/types/types";
import styles from "./ProfileAddresses.module.scss";
import AddressList from "./components/AddressList/AddressList";
import AddressModal from "./components/AddressModal/AddressModal";
import NotAddress from "./components/NotAddress/NotAddress.tsx";
import type { ProfileAddress } from "./model/types";

const ProfileAddresses = ({ title }: ProfilePageProps) => {
  const [addresses, setAddresses] = useState<ProfileAddress[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addAddress = (address: ProfileAddress) => {
    setAddresses((previous) => {
      const shouldBeDefault = address.isDefault || previous.length === 0;
      const existing = shouldBeDefault
        ? previous.map((item) => ({ ...item, isDefault: false }))
        : previous;

      return [...existing, { ...address, isDefault: shouldBeDefault }];
    });
  };

  const setDefaultAddress = (addressId: number) => {
    setAddresses((previous) =>
      previous.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      })),
    );
  };

  return (
    <section className={styles.content}>
      <h2 className={styles.content__title}>{title}</h2>

      {addresses.length > 0 ? (
        <AddressList addresses={addresses} onSetDefault={setDefaultAddress} />
      ) : (
        <NotAddress />
      )}

      <button
        type="button"
        className={styles.button}
        onClick={() => setIsModalOpen(true)}
      >
        <span className={styles.button__plus} aria-hidden="true">
          <span className={styles.button__plusLine} />
          <span className={styles.button__plusLine} />
        </span>
        <span className={styles.button__text}>Добавить новый адрес</span>
      </button>

      <AddressModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addAddress}
      />
    </section>
  );
};

export default ProfileAddresses;
