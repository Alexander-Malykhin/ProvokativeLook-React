//styles
import styles from './Image.module.scss';
//types
import type {ImageInterface} from "@UI/buttons/Image/types/types.ts";

const Image = ({ src, alt = '', className = '' }: ImageInterface) => {
    return (
        <img
            src={src}
            alt={alt}
            className={`${styles.image} ${className}`}
        />
    );
};

export default Image;