import styles from "./AnswerList.module.scss";
import AnswerItem from "../AnswerItem/AnswerItem";
import type { AnswerListProps } from "@components/blocks/AnswersToQuestions/types/types";
const AnswerList = ({ answers, activeId, setActiveId }: AnswerListProps) => {
    return (<div className={styles.list}>
      {answers.map((item) => {
            const isActive = activeId === item.id;
            return (<AnswerItem key={item.id} title={item.title} text={item.text} isActive={isActive} onClick={() => setActiveId(isActive ? null : item.id)}/>);
        })}
    </div>);
};
export default AnswerList;

