import { forwardRef } from "react";

import searchImage from "@assets/header/search.svg";
import styles from "../ProfileAddresses.module.scss";
import type { Suggestion } from "../model/types";
import AddressSuggestions from "./AddressSuggestions";

interface AddressSearchProps {
  query: string;
  suggestions: Suggestion[];
  isSearching: boolean;
  isListOpen: boolean;
  hasSelectedAddress: boolean;
  showSuggestions?: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
  onFocus: () => void;
  onSelect: (suggestion: Suggestion) => void;
}

const AddressSearch = forwardRef<HTMLInputElement, AddressSearchProps>(
  (
    {
      query,
      suggestions,
      isSearching,
      isListOpen,
      hasSelectedAddress,
      showSuggestions = true,
      onChange,
      onClear,
      onFocus,
      onSelect,
    },
    ref,
  ) => (
    <div className={styles.modal__address}>
      <div className={styles.modal__addressLine}>
        <img
          src={searchImage}
          alt=""
          aria-hidden="true"
          className={styles.modal__addressIcon}
        />
        <input
          ref={ref}
          type="text"
          value={query}
          className={styles.modal__addressInput}
          placeholder="Ввести адрес"
          autoComplete="off"
          onFocus={onFocus}
          onChange={(event) => onChange(event.target.value)}
        />
        {query && (
          <button
            type="button"
            aria-label="Очистить адрес"
            className={styles.modal__addressClear}
            onClick={onClear}
          />
        )}
      </div>

      {showSuggestions &&
        isListOpen &&
        !hasSelectedAddress &&
        query.trim().length >= 2 && (
          <AddressSuggestions
            suggestions={suggestions}
            isSearching={isSearching}
            onSelect={onSelect}
          />
        )}
    </div>
  ),
);

AddressSearch.displayName = "AddressSearch";

export default AddressSearch;
