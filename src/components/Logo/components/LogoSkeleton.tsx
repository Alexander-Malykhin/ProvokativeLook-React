//styles
import styles from './LogoSkeleton.module.scss';

const LogoSkeleton = () => {
    return <div className={`${styles.logo} ${styles.logo_skeleton}`} />;
};

export default LogoSkeleton;