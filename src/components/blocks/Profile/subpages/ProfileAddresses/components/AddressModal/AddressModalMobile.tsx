import type { FormEvent, ReactNode, RefObject } from "react";

import styles from "./AddressModal.module.scss";
import type { Suggestion } from "../../model/types";
import type { AddressEditor } from "../../hooks/useAddressEditor";
import AddressCitySelect from "../AddressCitySelect/AddressCitySelect";
import AddressDetailsForm from "../AddressDetailsForm/AddressDetailsForm";
import AddressMap from "../AddressMap/AddressMap";
import AddressSuggestions from "../AddressSuggestions/AddressSuggestions";

interface AddressModalMobileProps {
  editor: AddressEditor;
  mapRef: RefObject<HTMLDivElement | null>;
  isMapLoading: boolean;
  errorMessage: ReactNode;
  search: ReactNode;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSelectSuggestion: (suggestion: Suggestion) => void;
}

const AddressModalMobile = ({
  editor,
  mapRef,
  isMapLoading,
  errorMessage,
  search,
  onClose,
  onSubmit,
  onSelectSuggestion,
}: AddressModalMobileProps) => (
  <>
    <div className={styles.modal__mobileTop}>
      <AddressCitySelect value={editor.form.city} onChange={editor.selectCity} />
      <button
        type="button"
        aria-label="Закрыть окно"
        className={styles.modal__close}
        onClick={onClose}
      />
    </div>

    {(editor.mobileStep === "map" || editor.mobileStep === "selected") && (
      <div className={styles.modal__mobileMapPage}>
        <AddressMap ref={mapRef} isLoading={isMapLoading} fill />
        <div className={styles.modal__mobileFooter}>
          {search}
          {errorMessage}
          <button
            type="button"
            disabled={!editor.selectedAddress}
            className={styles.modal__continue}
            onClick={() => editor.setMobileStep("form")}
          >
            Продолжить
          </button>
        </div>
      </div>
    )}

    {editor.mobileStep === "search" && (
      <div className={styles.modal__mobileSearch}>
        <button
          type="button"
          aria-label="Назад"
          className={styles.modal__searchBack}
          onClick={() =>
            editor.setMobileStep(editor.selectedAddress ? "selected" : "map")
          }
        />
        <div className={styles.modal__mobileSearchInput}>{search}</div>
        {editor.isAddressListOpen && !editor.selectedAddress && (
          <AddressSuggestions
            className={styles.modal__mobileSuggestions}
            suggestions={editor.suggestions}
            isSearching={editor.isSearching}
            onSelect={onSelectSuggestion}
          />
        )}
        {errorMessage}
      </div>
    )}

    {editor.mobileStep === "form" && (
      <form className={styles.modal__mobileForm} onSubmit={onSubmit}>
        <div className={styles.modal__mobileFormHeader}>
          <button
            type="button"
            aria-label="Назад"
            className={styles.modal__back}
            onClick={() => editor.setMobileStep("selected")}
          />
          <h2 id="address-modal-title" className={styles.modal__mobileTitle}>
            Добавить новый адрес
          </h2>
        </div>

        <div className={styles.modal__selectedAddress}>
          <span className={styles.modal__selectedAddressIcon} />
          <p className={styles.modal__selectedAddressText}>
            {editor.form.formattedAddress}
          </p>
        </div>

        <AddressDetailsForm form={editor.form} onChange={editor.updateField} />
        {errorMessage}
        <button type="submit" className={styles.modal__save}>
          Сохранить
        </button>
      </form>
    )}
  </>
);

export default AddressModalMobile;
