//styles
import styles from './AnswerItem.module.scss';

interface AnswerItemProps {
    title: string;
    text: string;
    isActive: boolean;
    onClick: () => void;
}

const AnswerItem = ({ title, text, isActive, onClick }: AnswerItemProps) => {
    return (
        <article className={`${styles.item} ${isActive ? styles.item_active : ''}`}>
            <button type="button" className={styles.item_head} onClick={onClick}>
                <span>{title}</span>
                <span className={styles.item_icon} />
            </button>

            <div className={styles.item_body}>
                <div className={styles.item_body_inner}>
                    <p>{text}</p>
                </div>
            </div>
        </article>
    );
};

export default AnswerItem;