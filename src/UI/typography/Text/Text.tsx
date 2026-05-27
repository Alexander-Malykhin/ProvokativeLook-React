//styles
import styles from './Text.module.scss'
//types
import type {TextInterface} from "@UI/typography/Text/types/types.ts";

const Text = ({children}: TextInterface) => {
    return (
        <p className={styles.text}>
            {children}
        </p>
    );
};

export default Text;