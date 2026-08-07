// styles
import styles from './ProfileFieldRadio.module.scss';
// types
import type {ProfileFieldRadioInterface,} from '@components/blocks/Profile/types/types.ts';

const ProfileFieldRadio = ({name, value, checked, onChange, register, children, mode = 'static',}: ProfileFieldRadioInterface) => {
    return (
        <label className={styles.radio}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={() => onChange?.(value)}
                className={styles.radio__input}
                {...register}
            />

            <span className={styles.radio__dot} />

            {mode === 'static' ? (
                <span className={styles.radio__text}>
                    {children}
                </span>
            ) : (
                <div className={styles.radio__content}>
                    {children}
                </div>
            )}
        </label>
    );
};

export default ProfileFieldRadio;