import { useState } from 'react';
// styles
import styles from './AnswersToQuestions.module.scss';
// layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
// helpers
import { convertAliasTitle } from "@helpers/convertAliasTitle.tsx";
// components
import AnswerList from "./components/AnswerList/AnswerList";
// types
import type { AnswersToQuestionsInterface } from "@components/blocks/AnswersToQuestions/types/types.ts";

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

const AnswersToQuestions = ({ title }: AnswersToQuestionsInterface) => {
    const [activeId, setActiveId] = useState<number | null>(0);

    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.answers}>
                <div className={styles.column}>
                    <h2 className={styles.column__title}>
                        {convertAliasTitle(title)}
                    </h2>
                </div>

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