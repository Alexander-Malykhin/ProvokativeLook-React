import { useState } from 'react';
//styles
import styles from './AnswersToQuestions.module.scss';
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//components
import AnswerList from "@components/blocks/AnswersToQuestions/components/AnswerList/AnswerList.tsx";
import AnswerColumn from "@components/blocks/AnswersToQuestions/components/AnswerColumn/AnswerColumn.tsx";
import AnswersToQuestionsSkeleton from './components/AnswersToQuestionsSkeleton/AnswersToQuestionsSkeleton';
//api
import { useGetHomeQuery } from "@store/api/home/homeApi.ts";

const AnswersToQuestions = () => {
    const { data, isLoading, isError } = useGetHomeQuery();
    const [activeId, setActiveId] = useState<number | null>(null);

    if (isLoading) return <AnswersToQuestionsSkeleton />;
    if (isError || !data) return null;

    const answers = data.answers.map((item) => ({
        id: item.id,
        title: item.properties.ANSWERS_TITLE,
        text: item.properties.ANSWERS_TEXT,
    }));

    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.answers}>
                <AnswerColumn />

                <AnswerList
                    answers={answers}
                    activeId={activeId ?? answers[0]?.id ?? null}
                    setActiveId={setActiveId}
                />
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default AnswersToQuestions;