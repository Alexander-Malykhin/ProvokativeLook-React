//layouts
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//styles
import styles from "./FooterCitySelect.module.scss";

const FooterCitySelect = () => {
    return (
        <MainLayoutContainer>
            <label className={styles.select}>
                <span className={styles.select__label}>Доставка в</span>

                <select className={styles.select__field} defaultValue="rostov">
                    <option value="rostov">г. РОСТОВ-НА-ДОНУ</option>
                    <option value="moscow">Москва</option>
                    <option value="spb">Санкт-Петербург</option>
                    <option value="krasnodar">Краснодар</option>
                    <option value="other">Другой город...</option>
                </select>
            </label>
        </MainLayoutContainer>
    );
};

export default FooterCitySelect;