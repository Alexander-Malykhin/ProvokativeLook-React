//styles
import styles from './FormRow.module.scss';
//types
import type {FormRowInterface} from "@components/blocks/Basket/UI/FormRow/types/types.ts";

const FormRow = ({label, value, mode = 'description', children,}: FormRowInterface) => {
    const textClass = mode === 'description' ? styles.row__description : styles.row__price;

    return (
        <div className={styles.row}>
            <span className={textClass}>{label}</span>

            {children ? (
                children
            ) : (
                <span className={textClass}>{value}</span>
            )}
        </div>
    );
};

export default FormRow;