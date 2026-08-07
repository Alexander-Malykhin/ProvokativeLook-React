import { useState } from "react";
// styles
import styles from "./ContactMap.module.scss";

const MAP_URL =
  "https://yandex.ru/map-widget/v1/?oid=241281444612&ol=biz&ll=39.741426%2C47.295219&z=18.77";

const ContactMap = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={styles.map}>
      {!isLoaded && (
        <div className={styles.map__loader}>
          <span className={styles.map__loader_text}>Загружаем карту</span>

          <span className={styles.map__loader_icon} />
        </div>
      )}

      <iframe
        src={MAP_URL}
        title="Офис на карте"
        loading="lazy"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
        className={`
                    ${styles.map__iframe}
                    ${isLoaded ? styles.map__iframe_loaded : ""}
                `}
      />
    </div>
  );
};

export default ContactMap;
