import styles from "./AddressSuggestions.module.scss";
import type { Suggestion } from "../../model/types";

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
  <div className={`${styles.suggestions} ${className}`}>
    <p className={styles.suggestions__hint}>Выберите адрес</p>

    {suggestions.map((suggestion) => (
      <button
        key={suggestion.id}
        type="button"
        className={styles.suggestions__item}
        onClick={() => onSelect(suggestion)}
      >
        <span className={styles.suggestions__title}>{suggestion.title}</span>
        <span className={styles.suggestions__subtitle}>
          {suggestion.subtitle}
        </span>
      </button>
    ))}

    {isSearching && (
      <p className={styles.suggestions__empty}>Ищем адрес...</p>
    )}

    {!isSearching && suggestions.length === 0 && (
      <p className={styles.suggestions__empty}>Адреса не найдены</p>
    )}
  </div>
);

export default AddressSuggestions;
