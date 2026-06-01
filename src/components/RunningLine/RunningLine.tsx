//styles
import styles from './RunningLine.module.scss';
//components
import RunningLineItem from './components/RunningLineItem/RunningLineItem.tsx';
//hooks
import { useRunningLineItems } from '@hooks/useRunningLineItems.ts';
//types
import type { RunningLineInterface } from './types/types.ts';

const RunningLine = ({text = 'Доставка по России 300 ₽', repeat = 8, speed = 20, className = '',}: RunningLineInterface) => {
    const items = useRunningLineItems(repeat);

    return (
        <div className={`${styles.line} ${className}`}>
            <RunningLineItem
                text={text}
                speed={speed}
                items={items}
            />
        </div>
    );
};

export default RunningLine;