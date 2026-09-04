import { useEffect, useState, type FormEvent } from "react";
import Modal from "@UI/overlays/Modal/Modal";
import { useCreateReviewMutation, useLazyGetReviewStatusQuery } from "@store/api/reviews/reviewsApi";
import styles from "./ReviewModal.module.scss";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";

interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
}

const REVIEW_MIN_LENGTH = 4;
const REVIEW_MIN_LENGTH_ERROR = "Минимальная длина отзыва — 4 символа";

const getReviewLength = (value: string): number => Array.from(value.trim()).length;

const getErrorStatus = (error: unknown): number | string | undefined => {
    if (!error || typeof error !== "object" || !("status" in error)) return undefined;
    return (error as { status?: number | string }).status;
};

const ReviewModal = ({ open, onClose }: ReviewModalProps) => {
    const [text, setText] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"error" | "success">("error");
    const [createReview, { isLoading }] = useCreateReviewMutation();
    const [getReviewStatus] = useLazyGetReviewStatusQuery();

    useEffect(() => {
        if (!open) {
            setText("");
            setMessage("");
            setMessageType("error");
            return;
        }

        // Прогреваем Bitrix/Forum-контекст при открытии формы.
        // Ошибка здесь не должна блокировать сам POST отзыва.
        void getReviewStatus(undefined, false);
    }, [open, getReviewStatus]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const value = text.trim();

        if (!value) {
            setMessageType("error");
            setMessage("Введите текст отзыва");
            return;
        }

        if (getReviewLength(value) < REVIEW_MIN_LENGTH) {
            setMessageType("error");
            setMessage(REVIEW_MIN_LENGTH_ERROR);
            return;
        }

        setMessage("");

        try {
            await createReview({ text: value }).unwrap();
            onClose();
            return;
        }
        catch (firstError) {
            const status = getErrorStatus(firstError);

            if (status === 401 || status === 403) {
                setMessageType("error");
                setMessage("Сессия истекла. Войдите в аккаунт ещё раз.");
                return;
            }

            if (status === 400 || status === 422) {
                setMessageType("error");
                setMessage(getRequestErrorMessage(firstError, REVIEW_MIN_LENGTH_ERROR));
                return;
            }

            // Иногда первый запрос к Forum API после долгой жизни SPA падает,
            // хотя сессия пользователя валидна. Обновляем серверный контекст
            // и делаем один контролируемый повтор без перезагрузки страницы.
            try {
                await getReviewStatus(undefined, false).unwrap();
                await createReview({ text: value }).unwrap();
                onClose();
                return;
            }
            catch (secondError) {
                const secondStatus = getErrorStatus(secondError);
                if (secondStatus === 401 || secondStatus === 403) {
                    setMessageType("error");
                    setMessage("Сессия истекла. Войдите в аккаунт ещё раз.");
                    return;
                }
                setMessageType("error");
                setMessage(getRequestErrorMessage(secondError, "Не удалось отправить отзыв. Попробуйте ещё раз."));
            }
        }
    };

    return (
      <Modal open={open} onClose={onClose} overlayClassName={styles.modal} contentClassName={styles.modal__content} ariaLabelledBy="review-modal-title">
        <button type="button" className={styles.modal__close} onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        <h3 id="review-modal-title" className={styles.modal__title}>
          Оставить отзыв
        </h3>
        <form className={styles.modal__form} onSubmit={handleSubmit} noValidate>
          <textarea
            className={`${styles.modal__textarea} ${message && messageType === "error" ? styles.modal__textarea_error : ""}`}
            value={text}
            onChange={(event) => {
                const nextText = event.target.value;
                const nextLength = getReviewLength(nextText);
                setText(nextText);

                if (nextLength > 0 && nextLength < REVIEW_MIN_LENGTH) {
                    setMessageType("error");
                    setMessage(REVIEW_MIN_LENGTH_ERROR);
                } else if (message) {
                    setMessage("");
                    setMessageType("error");
                }
            }}
            onBlur={() => {
                const length = getReviewLength(text);
                if (length > 0 && length < REVIEW_MIN_LENGTH) {
                    setMessageType("error");
                    setMessage(REVIEW_MIN_LENGTH_ERROR);
                }
            }}
            placeholder="Расскажите о ваших впечатлениях"
            rows={6}
            maxLength={3000}
            minLength={REVIEW_MIN_LENGTH}
            aria-invalid={messageType === "error" && Boolean(message)}
            aria-describedby="review-text-help"
            autoFocus
          />
          <p id="review-text-help" className={styles.modal__hint}>Минимум 4 символа</p>
          {message && <p className={`${styles.modal__message} ${messageType === "success" ? styles.modal__message_success : styles.modal__message_error}`} role={messageType === "error" ? "alert" : "status"}>{message}</p>}
          <button type="submit" className={styles.modal__submit} disabled={isLoading}>
            {isLoading ? "Отправляем..." : "Отправить отзыв"}
          </button>
        </form>
      </Modal>
    );
};

export default ReviewModal;
