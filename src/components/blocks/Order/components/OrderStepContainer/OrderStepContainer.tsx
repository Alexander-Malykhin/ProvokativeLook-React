//styles
import styles from './OrderStepContainer.module.scss'
import type {ReactNode} from "react";

interface OrderStepContainerInterface {
    title: string;
    children: ReactNode;
    mode?: 'fields' | 'radio';
}

const OrderStepContainer = ({title, children, mode}: OrderStepContainerInterface) => {

    const getModeClass = () => {
        switch (mode) {
            case 'fields':
                return styles.container__fields;

            case 'radio':
                return styles.container__ratio;

            default:
                return '';
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.container__title}>
                {title}
            </h2>
            <div className={getModeClass()}>
                {children}
            </div>
        </div>
    );
};

export default OrderStepContainer;