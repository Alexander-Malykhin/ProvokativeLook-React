import {Link} from "react-router-dom";
import type {UseFormRegisterReturn} from "react-hook-form";
import {type ReactNode} from 'react';
//styles
import styles from './OrderCheckBox.module.scss';

interface OrderCheckBoxInterface {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    register?: UseFormRegisterReturn;
    mode?: 'static' | 'dynamic';
    description?: ReactNode;
}

const OrderCheckBox = ({checked, onChange, register}: OrderCheckBoxInterface) => {
    return (
        <label className={styles.checkbox}>
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange?.(e.target.checked)}
                className={styles.checkbox__input}
                {...register}
            />

            <span className={styles.checkbox__box}/>

            <span className={styles.checkbox__content}>Соглашаюсь на обработку моих <Link to={'#'} className={styles.checkbox__link}>персональных данных</Link> в соответствии с <Link to={'#'} className={styles.checkbox__link}>политикой конфиденциальности</Link></span>
        </label>
    );
};

export default OrderCheckBox;