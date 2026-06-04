//styles
import styles from './BurgerButton.module.scss'
//store
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '@store/store';
import {toggle} from '@store/slices/toggleMenuNavigationSlice';


const BurgerButton = () => {

    const dispatch = useDispatch()

    const active = useSelector((state: RootState) => state.toggleMenuNavigation.active)

    return (
        <button
            className={`${styles.burger} ${active ? styles.burger_active : ''}`}
            onClick={() => dispatch(toggle())}
        >
            <span className={styles.burger__line}></span>
            <span className={styles.burger__line}></span>
            <span className={styles.burger__line}></span>
        </button>
    );
};

export default BurgerButton;