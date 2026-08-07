import styles from "../AuthModal.module.scss";
import type { AuthMessageProps } from "../model/types";

const AuthMessages = ({ errorMessage, successMessage }: AuthMessageProps) => (
  <>
    {errorMessage && (
      <p className={styles.form__error} role="alert">
        {errorMessage}
      </p>
    )}
    {successMessage && (
      <p className={styles.form__success} role="status">
        {successMessage}
      </p>
    )}
  </>
);

export default AuthMessages;
