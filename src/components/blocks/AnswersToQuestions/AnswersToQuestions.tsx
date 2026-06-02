import { useState } from 'react';
//styles
import styles from './AnswersToQuestions.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//components
import AnswerList from "@components/blocks/AnswersToQuestions/components/AnswerList/AnswerList.tsx";
import AnswerColumn from "@components/blocks/AnswersToQuestions/components/AnswerColumn/AnswerColumn.tsx";

const answers = [
    {
        id: 1,
        title: 'Как сделать заказ?',
        text: 'Lorem ipsum dolor sit amet consectetur. Tristique dolor eu in hendrerit risus adipiscing.',
    },
    {
        id: 2,
        title: 'Как работает доставка?',
        text: 'Lorem ipsum dolor sit amet consectetur. Tristique dolor eu in hendrerit risus adipiscing.',
    },
    {
        id: 3,
        title: 'Как отследить заказ?',
        text: 'Lorem ipsum dolor sit amet consectetur. Tristique dolor eu in hendrerit risus adipiscing.',
    },
    {
        id: 4,
        title: 'Как вернуть заказ?',
        text: 'Lorem ipsum dolor sit amet consectetur. Tristique dolor eu in hendrerit risus adipiscing.',
    },
];

const AnswersToQuestions = () => {
    const [activeId, setActiveId] = useState<number | null>(2);

    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.answers}>
                <AnswerColumn/>
                <AnswerList
                    answers={answers}
                    activeId={activeId}
                    setActiveId={setActiveId}
                />
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default AnswersToQuestions;