import {Link} from "react-router-dom";
//styles
import styles from './TextAccent.module.scss'
//types
import type {TextAccentInterface} from "@UI/typography/TextAccent/types/types.ts";


const TextAccent = ({children, path, mode = 'main'}: TextAccentInterface) => {
    if (mode === 'link' && path) {
        return (
            <Link to={path}>
               <span className={styles.text}>
                    {children}
               </span>
            </Link>
        );
    }

    return (
        <span className={styles.text}>
            {children}
        </span>
    );
};

export default TextAccent;