//styles
import styles from './AnswerList.module.scss';
//components
import AnswerItem from '../AnswerItem/AnswerItem';

interface Answer {
    id: number;
    title: string;
    text: string;
}

interface AnswerListProps {
    answers: Answer[];
    activeId: number | null;
    setActiveId: (id: number | null) => void;
}

const AnswerList = ({ answers, activeId, setActiveId }: AnswerListProps) => {
    return (
        <div className={styles.list}>
            {answers.map((item) => {
                const isActive = activeId === item.id;

                return (
                    <AnswerItem
                        key={item.id}
                        title={item.title}
                        text={item.text}
                        isActive={isActive}
                        onClick={() => setActiveId(isActive ? null : item.id)}
                    />
                );
            })}
        </div>
    );
};

export default AnswerList;