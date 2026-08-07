import styles from "./ProfileDataField.module.scss";
import type { ProfileDataFieldInterface } from "@components/blocks/Profile/types/types.ts";

interface ProfileDataFieldProps {
  field: ProfileDataFieldInterface;
}

const ProfileDataField = ({ field }: ProfileDataFieldProps) => (
  <div className={styles.field}>
    <span className={styles.field__label}>{field.label}</span>
    <p className={styles.field__value}>{field.value || "Не указано"}</p>
  </div>
);

export default ProfileDataField;
