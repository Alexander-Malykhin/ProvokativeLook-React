//styles
import styles from './MainLayoutContainer.module.scss'
//types
import type {MainLayoutContainerInterface} from "@layouts/MainLayoutContainer/types/types.ts";

const MainLayoutContainer = ({children, className = ''}: MainLayoutContainerInterface) => {
    return (
        <div className={`${styles.container} ${className}`}>
            {children}
        </div>
    );
};

export default MainLayoutContainer;