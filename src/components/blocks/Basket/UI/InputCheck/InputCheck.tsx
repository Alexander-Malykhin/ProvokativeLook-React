import styles from "./InputCheck.module.scss";
import type { InputCheckInterface } from "@components/blocks/Basket/UI/InputCheck/types/types.ts";
const InputCheck = ({ checked, disabled = false, onChange }: InputCheckInterface) => {
    return (<label className={styles.check}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} className={styles.check__input}/>

      <span className={styles.check__box}></span>
    </label>);
};
export default InputCheck;
