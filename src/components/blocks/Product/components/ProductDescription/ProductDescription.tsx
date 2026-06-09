import { useState } from 'react';
import styles from './ProductDescription.module.scss';

const ProductDescription = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.description}>
            <p
                className={`${styles.description__text} ${
                    isOpen ? styles.description__text_open : ''
                }`}
            >
                <span className={styles.description__accent}>Описание</span>: Кардиган имеет элегантный силуэт, который подчеркивает фигуру,
                а его длина позволяет носить его как с джинсами, так и с платьями.
                Дизайнерские элементы, такие как оригинальные пуговицы и аккуратные швы,
                придают изделию уникальный шарм. Кардиган имеет элегантный силуэт,
                который подчеркивает фигуру.
            </p>

            <button
                type="button"
                className={styles.description__button}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {isOpen ? 'Скрыть' : 'Читать полностью'}
            </button>
        </div>
    );
};

export default ProductDescription;