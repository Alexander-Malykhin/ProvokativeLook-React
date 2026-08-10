import { useCallback, useEffect, useRef, type FormEvent } from "react";

import Modal from "@UI/overlays/Modal/Modal";
import { YANDEX_MAPS_API_KEY } from "@/config/env";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "../ProfileAddresses.module.scss";
import { MOBILE_BREAKPOINT } from "../model/constants";
import type { ProfileAddress } from "../model/types";
import { useAddressEditor } from "../hooks/useAddressEditor";
import { useAddressMap } from "../hooks/useAddressMap";
import { useGetUserQuery } from "@store/api/user/userApi";
import { useDeliveryCity } from "@/hooks/useDeliveryCity";
import AddressCitySelect from "./AddressCitySelect/AddressCitySelect.tsx";
import AddressDetailsForm from "./AddressDetailsForm/AddressDetailsForm.tsx";
import AddressMap from "./AddressMap";
import AddressSearch from "./AddressSearch";
import AddressSuggestions from "./AddressSuggestions";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (address: ProfileAddress) => void;
}

const AddressModal = ({ open, onClose, onSave }: AddressModalProps) => {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const { data: userData } = useGetUserQuery();
  const { city: deliveryCity } = useDeliveryCity();
  const defaultCity = userData?.user.city?.trim() || deliveryCity || "Ростов-на-Дону";
  const defaultCountry = userData?.user.country?.trim() || "Россия";
  const searchInputRef = useRef<HTMLInputElement>(null);
  const desktopMapRef = useRef<HTMLDivElement>(null);
  const mobileMapRef = useRef<HTMLDivElement>(null);
  const editor = useAddressEditor(isMobile, defaultCity, defaultCountry);
  const resetEditor = editor.reset;

  const activeMapRef = isMobile ? mobileMapRef : desktopMapRef;
  const isMapEnabled = open && (!isMobile || editor.mobileStep !== "form");
  const { isLoading: isMapLoading } = useAddressMap({
    containerRef: activeMapRef,
    enabled: isMapEnabled,
    apiKey: YANDEX_MAPS_API_KEY,
    city: editor.form.city,
    selectedAddress: editor.selectedAddress,
    onSelect: (coordinates) => {
      void editor.reverseGeocode(coordinates);
    },
    onError: editor.setError,
  });

  useEffect(() => {
    if (open) {
      resetEditor();
    }
  }, [open, resetEditor]);

  const close = useCallback(() => {
    resetEditor();
    onClose();
  }, [onClose, resetEditor]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const address = editor.createAddress();

    if (!address) {
      return;
    }

    onSave(address);
    close();
  };

  const handleSearchFocus = () => {
    if (isMobile) {
      editor.setMobileStep("search");
    }

    if (!editor.selectedAddress && editor.query.trim().length >= 2) {
      editor.setIsAddressListOpen(true);
    }
  };

  const clearSearch = () => {
    editor.clearSearch();
    window.setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const search = (showSuggestions = true) => (
    <AddressSearch
      ref={searchInputRef}
      query={editor.query}
      suggestions={editor.suggestions}
      isSearching={editor.isSearching}
      isListOpen={editor.isAddressListOpen}
      hasSelectedAddress={Boolean(editor.selectedAddress)}
      showSuggestions={showSuggestions}
      onChange={editor.changeQuery}
      onClear={clearSearch}
      onFocus={handleSearchFocus}
      onSelect={(suggestion) => {
        void editor.selectSuggestion(suggestion);
      }}
    />
  );

  const errorMessage = editor.error && (
    <p className={styles.modal__addressEmpty}>{editor.error}</p>
  );

  return (
    <Modal
      open={open}
      onClose={close}
      overlayClassName={styles.modal}
      contentClassName={styles.modal__window}
      ariaLabelledBy="address-modal-title"
    >
      {!isMobile ? (
        <>
          <div className={styles.modal__header}>
            <h2 id="address-modal-title" className={styles.modal__title}>
              Добавить новый адрес
            </h2>
            <button
              type="button"
              aria-label="Закрыть окно"
              className={styles.modal__close}
              onClick={close}
            />
          </div>

          <form
            className={styles.modal__desktopContent}
            onSubmit={handleSubmit}
          >
            <div className={styles.modal__form}>
              <AddressCitySelect
                value={editor.form.city}
                defaultCity={defaultCity}
                onChange={editor.selectCity}
              />
              {search()}
              <AddressDetailsForm
                form={editor.form}
                onChange={editor.updateField}
              />
              {errorMessage}
              <button
                type="submit"
                disabled={!editor.selectedAddress}
                className={styles.modal__save}
              >
                Сохранить
              </button>
            </div>

            <AddressMap ref={desktopMapRef} isLoading={isMapLoading} />
          </form>
        </>
      ) : (
        <>
          <div className={styles.modal__mobileTop}>
            <AddressCitySelect
              value={editor.form.city}
              defaultCity={defaultCity}
              onChange={editor.selectCity}
            />
            <button
              type="button"
              aria-label="Закрыть окно"
              className={styles.modal__close}
              onClick={close}
            />
          </div>

          {(editor.mobileStep === "map" ||
            editor.mobileStep === "selected") && (
            <div className={styles.modal__mobileMapPage}>
              <div className={styles.modal__mobileMap}>
                <div
                  ref={mobileMapRef}
                  className={styles.modal__mapContainer}
                />
                {isMapLoading && (
                  <span className={styles.modal__mapText}>
                    Загрузка карты...
                  </span>
                )}
              </div>
              <div className={styles.modal__mobileFooter}>
                {search(false)}
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
                  editor.setMobileStep(
                    editor.selectedAddress ? "selected" : "map",
                  )
                }
              />
              <div className={styles.modal__mobileSearchInput}>
                {search(false)}
              </div>
              {editor.isAddressListOpen && !editor.selectedAddress && (
                <AddressSuggestions
                  className={styles.modal__mobileSuggestions}
                  suggestions={editor.suggestions}
                  isSearching={editor.isSearching}
                  onSelect={(suggestion) => {
                    void editor.selectSuggestion(suggestion);
                  }}
                />
              )}
              {errorMessage}
            </div>
          )}

          {editor.mobileStep === "form" && (
            <form className={styles.modal__mobileForm} onSubmit={handleSubmit}>
              <div className={styles.modal__mobileFormHeader}>
                <button
                  type="button"
                  aria-label="Назад"
                  className={styles.modal__back}
                  onClick={() => editor.setMobileStep("selected")}
                />
                <h2
                  id="address-modal-title"
                  className={styles.modal__mobileTitle}
                >
                  Добавить новый адрес
                </h2>
              </div>
              <div className={styles.modal__selectedAddress}>
                <span className={styles.modal__selectedAddressIcon} />
                <p className={styles.modal__selectedAddressText}>
                  {editor.form.formattedAddress}
                </p>
              </div>
              <AddressDetailsForm
                form={editor.form}
                onChange={editor.updateField}
              />
              {errorMessage}
              <button type="submit" className={styles.modal__save}>
                Сохранить
              </button>
            </form>
          )}
        </>
      )}
    </Modal>
  );
};

export default AddressModal;
