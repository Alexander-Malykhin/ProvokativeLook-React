//styles
import styles from './RunningLine.module.scss';
//types
import type {RunningLineInterface} from './types/types.ts';
//hooks
import {useRunningLineItems} from "@hooks/useRunningLineItems.ts";

const RunningLine = ({text, repeat = 8, speed = 20, className = '',}: RunningLineInterface) => {

    const items = useRunningLineItems(repeat);

    return (
        <div className={`${styles.line} ${className}`}>
            <article
                className={styles.line__track}
                style={{animationDuration: `${speed}s`}}
            >
                {[...items, ...items].map((_, index) => (
                    <span key={index} className={styles.line__item}>
                        <span className={styles.line__item_text}>{text}</span>
                        <span className={styles.line__dot}/>
                    </span>
                ))}
            </article>
        </div>
    );
};

export default RunningLine;