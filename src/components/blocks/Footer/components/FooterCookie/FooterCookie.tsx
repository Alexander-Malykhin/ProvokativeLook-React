//UI
import Text from "@UI/typography/Text/Text.tsx";
import TextAccent from "@UI/typography/TextAccent/TextAccent.tsx";
//styles
import styles from "./FooterCookie.module.scss";

const FooterCookie = () => {
    return (
        <div className={styles.cookie}>
            <Text>
                Мы используем файлы cookie, чтобы обеспечить наилучшее обслуживание.{" "}
                <TextAccent mode="link" path="#">Подробнее</TextAccent>
            </Text>

            <button className={styles.cookie__button}>
                <span className={styles.cookie__button_line}></span>
                <span className={styles.cookie__button_line}></span>
            </button>
        </div>
    );
};

export default FooterCookie;