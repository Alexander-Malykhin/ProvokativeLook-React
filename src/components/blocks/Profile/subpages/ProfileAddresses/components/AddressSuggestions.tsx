import styles from "../ProfileAddresses.module.scss";
import type { Suggestion } from "../model/types";

interface AddressSuggestionsProps {
  suggestions: Suggestion[];
  isSearching: boolean;
  onSelect: (suggestion: Suggestion) => void;
  className?: string;
}

const AddressSuggestions = ({
  suggestions,
  isSearching,
  onSelect,
  className = "",
}: AddressSuggestionsProps) => (
  <div className={className || styles.modal__addressList}>
    <p className={styles.modal__addressHint}>Выберите адрес</p>

    {suggestions.map((suggestion) => (
      <button
        key={suggestion.id}
        type="button"
        className={styles.modal__addressItem}
        onClick={() => onSelect(suggestion)}
      >
        <span className={styles.modal__addressTitle}>{suggestion.title}</span>
        <span className={styles.modal__addressCity}>{suggestion.subtitle}</span>
      </button>
    ))}

    {isSearching && <p className={styles.modal__addressEmpty}>Ищем адрес...</p>}

    {!isSearching && suggestions.length === 0 && (
      <p className={styles.modal__addressEmpty}>Адреса не найдены</p>
    )}
  </div>
);

export default AddressSuggestions;
