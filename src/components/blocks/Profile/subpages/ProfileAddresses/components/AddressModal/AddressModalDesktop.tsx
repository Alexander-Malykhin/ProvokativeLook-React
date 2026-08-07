import type { FormEvent, ReactNode, RefObject } from "react";

import styles from "./AddressModal.module.scss";
import type { AddressEditor } from "../../hooks/useAddressEditor";
import AddressCitySelect from "../AddressCitySelect/AddressCitySelect";
import AddressDetailsForm from "../AddressDetailsForm/AddressDetailsForm";
import AddressMap from "../AddressMap/AddressMap";

interface AddressModalDesktopProps {
  editor: AddressEditor;
  mapRef: RefObject<HTMLDivElement | null>;
  isMapLoading: boolean;
  errorMessage: ReactNode;
  search: ReactNode;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const AddressModalDesktop = ({
  editor,
  mapRef,
  isMapLoading,
  errorMessage,
  search,
  onClose,
  onSubmit,
}: AddressModalDesktopProps) => (
  <>
    <div className={styles.modal__header}>
      <h2 id="address-modal-title" className={styles.modal__title}>
        Добавить новый адрес
      </h2>
      <button
        type="button"
        aria-label="Закрыть окно"
        className={styles.modal__close}
        onClick={onClose}
      />
    </div>

    <form className={styles.modal__desktopContent} onSubmit={onSubmit}>
      <div className={styles.modal__form}>
        <AddressCitySelect
          value={editor.form.city}
          onChange={editor.selectCity}
        />
        {search}
        <AddressDetailsForm form={editor.form} onChange={editor.updateField} />
        {errorMessage}
        <button
          type="submit"
          disabled={!editor.selectedAddress}
          className={styles.modal__save}
        >
          Сохранить
        </button>
      </div>

      <AddressMap ref={mapRef} isLoading={isMapLoading} />
    </form>
  </>
);

export default AddressModalDesktop;
