import styles from './AnswerColumn.module.scss';
const AnswerColumn = () => {
  return (
    <div className={styles.column}>
      <h2 className={styles.column__title}>
        Ответы <br className={styles.column__break} /> на вопросы
      </h2>
    </div>
  );
};
export default AnswerColumn;
