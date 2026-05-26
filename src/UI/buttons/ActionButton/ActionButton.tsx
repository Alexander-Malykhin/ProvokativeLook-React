//styles
import styles from './ActionButton.module.scss'
//types
import type {ActionButtonInterface} from "@UI/buttons/ActionButton/types/types.ts";

const ActionButton = ({children, onClick, className = '',}: ActionButtonInterface) => {
    return (
        <button
            type="button"
            className={`${styles.button} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default ActionButton;