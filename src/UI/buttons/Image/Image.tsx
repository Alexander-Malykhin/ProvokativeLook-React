//styles
import styles from './Image.module.scss';
//types
import type { ImageInterface } from "@UI/buttons/Image/types/types.ts";

const API_HOST = 'https://24.provokativelook.ru';

const Image = ({ src, alt = '', className = '' }: ImageInterface) => {
    const imageSrc =
        src?.startsWith('/upload/')
            ? `${API_HOST}${src}`
            : src;

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={`${styles.image} ${className}`}
        />
    );
};

export default Image;