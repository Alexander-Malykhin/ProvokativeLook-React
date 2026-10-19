import styles from './PageLoader.module.scss';
const PageLoader = ({ full = false }: { full?: boolean }) => (
  <div className={full ? styles.full : styles.bar} role="status" aria-label="Загрузка страницы">
    <span className={styles.line} />
    {full && (
      <div className={styles.brand}>
        PROVOKATIVE LOOK<span>Загрузка</span>
      </div>
    )}
  </div>
);
export default PageLoader;
