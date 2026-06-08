//styles
import styles from './RunningLine.module.scss';
//components
import RunningLineItem from './components/RunningLineItem/RunningLineItem.tsx';
//hooks
import { useRunningLineItems } from '@hooks/useRunningLineItems.ts';
//types
import type { RunningLineInterface } from './types/types.ts';
//api
import { useGetSettingsQuery } from '@store/api/settings/settingsApi.ts';

const RunningLine = ({text, repeat = 8, speed = 20, className = '',}: RunningLineInterface) => {
    const { data, isLoading } = useGetSettingsQuery();
    const items = useRunningLineItems(repeat);

    if (isLoading) return null;

    const runningText =
        text ||
        data?.delivery_line?.text ||
        'Доставка по России 300 ₽';

    return (
        <div className={`${styles.line} ${className}`}>
            <RunningLineItem
                text={runningText}
                speed={speed}
                items={items}
            />
        </div>
    );
};

export default RunningLine;