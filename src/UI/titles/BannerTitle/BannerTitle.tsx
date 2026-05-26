//styles
import styles from './BannerTitle.module.scss'
//types
import type {BannerTitleInterface} from "@UI/titles/BannerTitle/types/types.ts";

const BannerTitle = ({children, className}: BannerTitleInterface) => {
    return (
        <h1 className={`${styles.title} ${className}`}>
            {children}
        </h1>
    );
};

export default BannerTitle;