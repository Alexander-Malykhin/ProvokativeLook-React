//styles
import styles from './Title.module.scss'
//types
import type {TitleInterface} from "@UI/typography/Title/types/types.ts";


const Title = ({tag: Tag = 'h2', children, size = 'lg', weight = 'extraLight', color = 'black', className = '',}: TitleInterface) => {
    return (
        <Tag
            className={`
                ${styles.title}
                ${styles[`title_${size}`]}
                ${styles[`title_${weight}`]}
                ${styles[`title_${color}`]}
                ${className}
            `}
        >
            {children}
        </Tag>
    );
};

export default Title;