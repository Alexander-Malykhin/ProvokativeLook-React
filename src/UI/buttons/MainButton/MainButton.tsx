//styles
import styles from './MainButton.module.scss'
//types
import type {MainButtonInterface} from "@UI/buttons/MainButton/types/types.ts";
//UI
import Image from "@UI/buttons/Image/Image.tsx";

const MainButton = ({children, icon, onClick, alt, className = '', mode = 'main', color = 'white',}: MainButtonInterface) => {
    return (
        <button
            type="button"
            className={`${styles.button} ${styles[`button__${mode}`]} ${styles[`button__color_${color}`]} ${className}`}
            onClick={onClick}
        >
            {icon && (<Image src={icon} alt={alt} className={styles.button__icon}/>)}

            <span className={styles.button__text}>{children}</span>
        </button>
    );
};


export default MainButton;