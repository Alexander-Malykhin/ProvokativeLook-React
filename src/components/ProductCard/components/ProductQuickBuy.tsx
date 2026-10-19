import { useId, useRef } from 'react';
import Modal from '@UI/overlays/Modal/Modal';
import { animateModalClose } from '@UI/overlays/Modal/animateModalClose';
import ProductCardPurchase from './ProductCardPurchase';
import styles from './ProductQuickBuy.module.scss';
interface Props {
  slug: string;
  sectionSlug: string;
  fallbackPrice: string;
  title: string;
  onClose: () => void;
}
const ProductQuickBuy = (props: Props) => {
  const titleId = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const close = () => animateModalClose(props.onClose, titleRef.current?.closest<HTMLElement>('[data-modal-overlay]'));
  return (
    <Modal
      open
      onClose={close}
      overlayClassName={styles.overlay}
      contentClassName={styles.dialog}
      ariaLabelledBy={titleId}
    >
      <button type="button" className={styles.close} aria-label="Закрыть быстрый заказ" onClick={close}>
        ×
      </button>
      <h2 id={titleId} ref={titleRef}>
        {props.title}
      </h2>
      <ProductCardPurchase {...props} onClose={close} />
    </Modal>
  );
};
export default ProductQuickBuy;
