import { useCallback, useEffect, useRef, type FormEvent } from "react";

import Modal from "@UI/overlays/Modal/Modal";
import { YANDEX_MAPS_API_KEY } from "@/config/env";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./AddressModal.module.scss";
import { MOBILE_BREAKPOINT } from "../../model/constants";
import type { ProfileAddress, Suggestion } from "../../model/types";
import { useAddressEditor } from "../../hooks/useAddressEditor";
import { useAddressMap } from "../../hooks/useAddressMap";
import AddressSearch from "../AddressSearch/AddressSearch";
import AddressModalDesktop from "./AddressModalDesktop";
import AddressModalMobile from "./AddressModalMobile";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (address: ProfileAddress) => void;
}

const AddressModal = ({ open, onClose, onSave }: AddressModalProps) => {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const desktopMapRef = useRef<HTMLDivElement>(null);
  const mobileMapRef = useRef<HTMLDivElement>(null);
  const editor = useAddressEditor(isMobile);
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

  const selectSuggestion = (suggestion: Suggestion) => {
    void editor.selectSuggestion(suggestion);
  };

  const renderSearch = (showSuggestions = true) => (
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
      onSelect={selectSuggestion}
    />
  );

  const errorMessage = editor.error ? (
    <p className={styles.modal__error}>{editor.error}</p>
  ) : null;

  return (
    <Modal
      open={open}
      onClose={close}
      overlayClassName={styles.modal}
      contentClassName={styles.modal__window}
      ariaLabelledBy="address-modal-title"
    >
      {isMobile ? (
        <AddressModalMobile
          editor={editor}
          mapRef={mobileMapRef}
          isMapLoading={isMapLoading}
          errorMessage={errorMessage}
          search={renderSearch(false)}
          onClose={close}
          onSubmit={handleSubmit}
          onSelectSuggestion={selectSuggestion}
        />
      ) : (
        <AddressModalDesktop
          editor={editor}
          mapRef={desktopMapRef}
          isMapLoading={isMapLoading}
          errorMessage={errorMessage}
          search={renderSearch()}
          onClose={close}
          onSubmit={handleSubmit}
        />
      )}
    </Modal>
  );
};

export default AddressModal;
