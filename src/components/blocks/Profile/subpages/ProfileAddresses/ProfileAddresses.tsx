import { useState } from "react";

import type { ProfilePageProps } from "@components/blocks/Profile/types/types";
import styles from "./ProfileAddresses.module.scss";
import AddressList from "./components/AddressList/AddressList";
import AddressModal from "./components/AddressModal/AddressModal";
import NotAddress from "./components/NotAddress/NotAddress.tsx";
import type { ProfileAddress } from "./model/types";
import {
  useAddAddressMutation,
  useGetAddressesQuery,
  useSetDefaultAddressMutation,
  useDeleteAddressMutation,
} from "@store/api/address/addressApi";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";

const ProfileAddresses = ({ title }: ProfilePageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { data, isLoading, isError } = useGetAddressesQuery();
  const [addAddress, addState] = useAddAddressMutation();
  const [setDefaultAddress, defaultState] = useSetDefaultAddressMutation();
  const [deleteAddress, deleteState] = useDeleteAddressMutation();

  const addresses = data?.addresses ?? [];

  const handleAddAddress = (address: ProfileAddress) => {
    setErrorMessage("");

    void addAddress(address)
      .unwrap()
      .then(() => setIsModalOpen(false))
      .catch((error) => {
        setErrorMessage(getRequestErrorMessage(error, "Не удалось сохранить адрес"));
      });
  };

  const handleSetDefault = (addressId: number) => {
    setErrorMessage("");

    void setDefaultAddress({ id: addressId })
      .unwrap()
      .catch((error) => {
        setErrorMessage(
          getRequestErrorMessage(error, "Не удалось выбрать основной адрес"),
        );
      });
  };

  const handleDelete = (addressId: number) => {
    setErrorMessage("");

    void deleteAddress({ id: addressId })
      .unwrap()
      .catch((error) => {
        setErrorMessage(getRequestErrorMessage(error, "Не удалось удалить адрес"));
      });
  };

  return (
    <section className={styles.content}>
      <h2 className={styles.content__title}>{title}</h2>

      {isLoading ? (
        <p>Загрузка адресов...</p>
      ) : isError ? (
        <p>Не удалось загрузить адреса</p>
      ) : addresses.length > 0 ? (
        <AddressList
          addresses={addresses}
          onSetDefault={handleSetDefault}
          onDelete={handleDelete}
          disabled={defaultState.isLoading || deleteState.isLoading}
        />
      ) : (
        <NotAddress />
      )}

      {errorMessage && <p>{errorMessage}</p>}

      <button
        type="button"
        className={styles.button}
        disabled={addState.isLoading || defaultState.isLoading || deleteState.isLoading}
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
        onSave={handleAddAddress}
        isSaving={addState.isLoading}
      />
    </section>
  );
};

export default ProfileAddresses;
