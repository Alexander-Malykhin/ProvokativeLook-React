import {useState} from "react";
//styles
import styles from './OrderBonuses.module.scss'
//UI
import SwitchInput from "@UI/inputs/SwitchInput/SwitchInput.tsx";
import FormRow from "@components/blocks/Basket/UI/FormRow/FormRow.tsx";

const OrderBonuses = () => {

    const [isPromoOpen, setIsPromoOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);

    return (
        <div className={styles.bonuses}>
            <FormRow label={'Списать бонусы: 1000'}>
                <SwitchInput
                    checked={isActive}
                    onChange={(checked) => setIsActive(checked)}
                />
            </FormRow>

            <button
                className={`${styles.bonuses__button} ${isPromoOpen && styles.bonuses__button_active}`}
                onClick={() => setIsPromoOpen(!isPromoOpen)}
            >
                Ввести промокод
            </button>

            {isPromoOpen && (
                <div className={`${styles.bonuses__promo} ${isPromoOpen ? styles.bonuses__promo_active : ''}`}>
                    <input type="text" placeholder={'Промокод'} className={styles.bonuses__promo_input}/>
                    <button className={styles.bonuses__promo_button}>
                        Ок
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderBonuses;