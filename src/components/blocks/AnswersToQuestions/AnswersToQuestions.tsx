import { useState } from 'react';
//components
import MainSliderCards from '@components/MainSliderCards/MainSliderCards';
import AnswerList from "@components/blocks/AnswersToQuestions/components/AnswerList/AnswerList.tsx";

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
        <MainSliderCards title="Ответы #br# на вопросы" withControls={false} withFullContainer mode={'grid'}>
            <AnswerList
                answers={answers}
                activeId={activeId}
                setActiveId={setActiveId}
            />
        </MainSliderCards>
    );
};

export default AnswersToQuestions;