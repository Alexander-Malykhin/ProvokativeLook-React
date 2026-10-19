import { useState } from 'react';
import styles from './ProductDescription.module.scss';
interface ProductDescriptionProps {
  text: string;
}
const ProductDescription = ({ text }: ProductDescriptionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!text.trim()) return null;
  return (
    <div className={styles.description}>
      <div className={`${styles.description__text} ${isOpen ? styles.description__text_open : ''}`}>
        <span className={styles.description__accent}>Описание</span>:
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </div>

      <button type="button" className={styles.description__button} onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? 'Скрыть' : 'Читать полностью'}
      </button>
    </div>
  );
};
export default ProductDescription;
