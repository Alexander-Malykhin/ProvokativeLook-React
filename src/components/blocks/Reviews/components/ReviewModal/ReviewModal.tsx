import { useEffect, useState, type FormEvent } from "react";
import Modal from "@UI/overlays/Modal/Modal";
import { useCreateReviewMutation } from "@store/api/reviews/reviewsApi";
import styles from "./ReviewModal.module.scss";
interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
}
const ReviewModal = ({ open, onClose }: ReviewModalProps) => {
    const [text, setText] = useState("");
    const [message, setMessage] = useState("");
    const [createReview, { isLoading }] = useCreateReviewMutation();
    useEffect(() => {
        if (!open) {
            setText("");
            setMessage("");
        }
    }, [open]);
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const value = text.trim();
        if (!value) {
            setMessage("Введите текст отзыва");
            return;
        }
        try {
            await createReview({ text: value }).unwrap();
            setText("");
            setMessage("");
            onClose();
        }
        catch {
            setMessage("Не удалось отправить отзыв. Попробуйте ещё раз.");
        }
    };
    return (<Modal open={open} onClose={onClose} overlayClassName={styles.modal} contentClassName={styles.modal__content} ariaLabelledBy="review-modal-title">
      <button type="button" className={styles.modal__close} onClick={onClose} aria-label="Закрыть">
        ×
      </button>
      <h3 id="review-modal-title" className={styles.modal__title}>
        Оставить отзыв
      </h3>
      <form className={styles.modal__form} onSubmit={handleSubmit}>
        <textarea className={styles.modal__textarea} value={text} onChange={(event) => {
            setText(event.target.value);
            if (message)
                setMessage("");
        }} placeholder="Расскажите о ваших впечатлениях" rows={6} maxLength={3000} autoFocus/>
        {message && <p className={styles.modal__message}>{message}</p>}
        <button type="submit" className={styles.modal__submit} disabled={isLoading}>
          {isLoading ? "Отправляем..." : "Отправить отзыв"}
        </button>
      </form>
    </Modal>);
};
export default ReviewModal;

