//styles
import styles from './AnswerColumn.module.scss'


const AnswerColumn = () => {
    return (
        <div className={styles.column}>
            <h2 className={styles.column__title}>
                Ответы <br/> на вопросы
            </h2>
        </div>
    );
};

export default AnswerColumn;