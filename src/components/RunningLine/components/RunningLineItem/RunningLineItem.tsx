//styles
import styles from './RunningLineItem.module.scss';
//types
import type {RunningLineItemInterface} from "@components/RunningLine/components/RunningLineItem/types/types.ts";

const RunningLineItem = ({ text, speed, items }: RunningLineItemInterface) => {
    return (
        <article
            className={styles.track}
            style={{ animationDuration: `${speed}s` }}
        >
            {[...items, ...items].map((_, index) => (
                <span key={index} className={styles.track__item}>
                    <span className={styles.track__item_text}>{text}</span>
                    <span className={styles.track__dot} />
                </span>
            ))}
        </article>
    );
};

export default RunningLineItem;