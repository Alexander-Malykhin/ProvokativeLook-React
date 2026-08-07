import { useState } from "react";
// styles
import styles from "./AnswersToQuestions.module.scss";
// layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer";
// components
import AnswerList from "./components/AnswerList/AnswerList";
import AnswerColumn from "./components/AnswerColumn/AnswerColumn";
import AnswersToQuestionsSkeleton from "./components/AnswersToQuestionsSkeleton/AnswersToQuestionsSkeleton";
// api
import { useGetHomeQuery } from "@store/api/home/homeApi";
// types
import type { AnswerItemData } from "./types/types";

const AnswersToQuestions = () => {
  const { data, isLoading, isError } = useGetHomeQuery();

  const [activeId, setActiveId] = useState<number | null>(null);

  if (isLoading) return <AnswersToQuestionsSkeleton />;

  if (isError || !data) return null;

  const answers: AnswerItemData[] = data.answers.map((item) => ({
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
