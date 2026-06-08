export interface AnswersToQuestionsInterface {
    id: number;
    iblockId: number;
    title: string;
    code: string;
    sort: number;
    properties: {
        ANSWERS_TITLE: string;
        ANSWERS_TEXT: string;
    };
}