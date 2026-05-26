import {Link} from "react-router-dom";
//styles
import styles from './Logo.module.scss';
//UI
import Image from "@UI/buttons/Image/Image.tsx";

const Logo = () => {
    return (
        <Link to={'/'} className={styles.logo}>
            <Image src={`${import.meta.env.BASE_URL}logo.svg`} alt="logo" className={styles.logo__image}/>
        </Link>
    );
};

export default Logo;