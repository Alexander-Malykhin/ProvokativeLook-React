import { useNavigate } from "react-router-dom";

import styles from './NotAddress.module.scss';

const NotAddress = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notAddress}>
      <p className={styles.notAddress__text}>Нет сохраненных адресов.</p>
      <button
        type="button"
        className={styles.notAddress__button}
        onClick={() => navigate("/catalog")}
      >
        Перейти в каталог
      </button>
    </div>
  );
};

export default NotAddress;
