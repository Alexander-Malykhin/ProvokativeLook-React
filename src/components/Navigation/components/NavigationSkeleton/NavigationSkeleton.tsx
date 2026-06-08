//styles
import styles from './NavigationSkeleton.module.scss';

const NavigationSkeleton = () => {
    return (
        <nav className={styles.navigation}>
            {[1,2,3,4,5].map((i) => (
                <div
                    key={i}
                    className={styles.navigation__item_skeleton}
                />
            ))}
        </nav>
    );
};

export default NavigationSkeleton;