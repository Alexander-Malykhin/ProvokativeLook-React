import styles from './ActionButton.module.scss';
import type { ActionButtonInterface } from '@UI/buttons/ActionButton/types/types.ts';
const ActionButton = ({ children, onClick, className = '', 'aria-label': label }: ActionButtonInterface) => {
  return (
    <button type="button" className={`${styles.button} ${className}`} onClick={onClick} aria-label={label}>
      {children}
    </button>
  );
};
export default ActionButton;
