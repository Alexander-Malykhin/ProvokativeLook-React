import { animateModalClose } from "@UI/overlays/Modal/animateModalClose";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Modal from "@UI/overlays/Modal/Modal";
import { useCreateReviewMutation } from "@store/api/reviews/reviewsApi";
import styles from "./ReviewModal.module.scss";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";
interface Props { open: boolean; productId: number; onClose: () => void; }
const PhotoPreview = ({ file }: { file: File }) => {
    const ref = useRef<HTMLImageElement>(null);
    useEffect(() => {
        const url = URL.createObjectURL(file);
        if (ref.current) ref.current.src = url;
        return () => URL.revokeObjectURL(url);
    }, [file]);
    return <img ref={ref} alt={file.name}/>;
};
const ReviewModal = ({ open, productId, onClose: finishClose }: Props) => {
    const onClose = () => animateModalClose(finishClose);
    const [text, setText] = useState("");
    const [photos, setPhotos] = useState<File[]>([]);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const dragDepth = useRef(0);
    const fileInput = useRef<HTMLInputElement>(null);
    const [createReview, { isLoading }] = useCreateReviewMutation();
    const addPhotos = (files: File[]) => {
        if (isLoading || files.length === 0) return;
        if (photos.length + files.length > 2) { setError("Можно приложить не больше двух фото"); return; }
        if (files.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024)) {
            setError("Выберите JPEG, PNG или WebP до 5 МБ каждый"); return;
        }
        setPhotos((current) => [...current, ...files]);
        setError("");
    };
    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (isLoading || sent) return;
        if (Array.from(text.trim()).length < 4) { setError("Минимум 4 символа в отзыве"); return; }
        if (photos.length < 1 || photos.length > 2) { setError("Прикрепите от 1 до 2 фотографий"); return; }
        setError("");
        try {
            const result = await createReview({ text: text.trim(), productId, photos }).unwrap();
            if (!result.success) throw new Error("Не удалось отправить отзыв");
            setSent(true);
        } catch (reason) { setError(getRequestErrorMessage(reason, "Не удалось отправить отзыв")); }
    };
    return <Modal open={open} onClose={onClose} closeDisabled={isLoading} overlayClassName={styles.modal} contentClassName={styles.modal__content} ariaLabelledBy="review-modal-title">
        <button type="button" className={styles.modal__close} onClick={onClose} disabled={isLoading} aria-label="Закрыть">×</button>
        <h3 id="review-modal-title" className={styles.modal__title}>Оставить отзыв</h3>
        {sent ? <div role="status"><p>Ваш отзыв успешно оставлен.</p><button className={styles.modal__submit} onClick={onClose}>Готово</button></div> : <form className={styles.modal__form} onSubmit={submit}>
            <textarea aria-label="Текст отзыва" className={styles.modal__textarea} value={text} onChange={(event) => setText(event.target.value)} minLength={4} maxLength={3000} required disabled={isLoading} placeholder="Расскажите о ваших впечатлениях" rows={5}/>
            <div className={styles.modal__photoHeading}><span>Фотографии</span><span aria-live="polite">{photos.length} / 2</span></div>
            <input ref={fileInput} className={styles.modal__fileInput} type="file" aria-label="Выбрать фотографии" accept="image/jpeg,image/png,image/webp" multiple disabled={isLoading} onChange={(event) => {
                addPhotos(Array.from(event.target.files ?? []));
                event.target.value = "";
            }}/>
            <button type="button" disabled={isLoading} className={`${styles.modal__dropzone} ${isDragging ? styles.modal__dropzone_active : ""}`} onClick={() => fileInput.current?.click()}
                onDragEnter={(event) => {
                    event.preventDefault();
                    if (isLoading || !Array.from(event.dataTransfer.types).includes("Files")) return;
                    dragDepth.current += 1; setIsDragging(true);
                }}
                onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = isLoading ? "none" : "copy"; }}
                onDragLeave={(event) => { event.preventDefault(); dragDepth.current = Math.max(0, dragDepth.current - 1); if (!dragDepth.current) setIsDragging(false); }}
                onDrop={(event) => {
                    event.preventDefault(); dragDepth.current = 0; setIsDragging(false);
                    addPhotos(Array.from(event.dataTransfer.files));
                }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 16V3m-5 5 5-5 5 5M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/></svg>
                <span className={styles.modal__uploadTitle}>{isDragging ? "Отпустите, чтобы добавить" : "Выбрать фотографии"}</span>
                <span className={styles.modal__uploadHint}>или перетащите сюда · от 1 до 2 фото</span>
            </button>
            <p className={styles.modal__hint}>JPEG, PNG или WebP, до 5 МБ и 20 мегапикселей на фото.</p>
            {photos.length > 0 && <div className={styles.modal__photos}>{photos.map((photo, index) => <div key={index}><PhotoPreview file={photo}/><button type="button" disabled={isLoading} onClick={() => { setPhotos((current) => current.filter((_, i) => i !== index)); setError(""); }} aria-label={"Удалить фото " + (index + 1)}>Удалить</button></div>)}</div>}
            {error && <p role="alert" className={styles.modal__message_error}>{error}</p>}
            <button className={styles.modal__submit} type="submit" disabled={isLoading}>{isLoading ? "Отправляем…" : "Отправить"}</button>
        </form>}
    </Modal>;
};
export default ReviewModal;
