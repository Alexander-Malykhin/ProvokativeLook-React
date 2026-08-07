import styles from "./AddressDetailsForm.module.scss";
import { MAX_COMMENT_LENGTH } from "../../model/constants.ts";
import type { AddressFormState } from "../../model/types.ts";

interface AddressDetailsFormProps {
  form: AddressFormState;
  onChange: <Key extends keyof AddressFormState>(
    key: Key,
    value: AddressFormState[Key],
  ) => void;
}

const DETAIL_FIELDS = [
  { name: "entrance", placeholder: "Подъезд" },
  { name: "floor", placeholder: "Этаж" },
  { name: "apartment", placeholder: "Квартира" },
] as const;

const AddressDetailsForm = ({ form, onChange }: AddressDetailsFormProps) => (
  <div className={styles.details}>
    <div className={styles.details__fields}>
      {DETAIL_FIELDS.map(({ name, placeholder }) => (
        <label key={name} className={styles.details__field}>
          <input
            type="text"
            value={form[name]}
            className={styles.details__input}
            placeholder={placeholder}
            onChange={(event) => onChange(name, event.target.value)}
          />
        </label>
      ))}
    </div>

    <label className={styles.details__comment}>
      <textarea
        value={form.comment}
        maxLength={MAX_COMMENT_LENGTH}
        className={styles.details__textarea}
        placeholder="Комментарий"
        onChange={(event) => onChange("comment", event.target.value)}
      />
      <span className={styles.details__count}>
        Осталось символов {MAX_COMMENT_LENGTH - form.comment.length}/
        {MAX_COMMENT_LENGTH}
      </span>
    </label>

    <label className={styles.details__checkbox}>
      <input
        type="checkbox"
        checked={form.isDefault}
        className={styles.details__checkboxInput}
        onChange={(event) => onChange("isDefault", event.target.checked)}
      />
      <span className={styles.details__checkboxBox}>
        <span className={styles.details__checkboxMark} />
      </span>
      <span className={styles.details__checkboxText}>Сделать основным</span>
    </label>
  </div>
);

export default AddressDetailsForm;
