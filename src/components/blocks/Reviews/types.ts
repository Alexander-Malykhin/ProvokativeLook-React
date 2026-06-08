export interface ReviewInterface {
    id: number;
    iblockId: number;
    title: string;
    code: string;
    sort: number;
    properties: {
        REVIEW_COMMENT: string;
        REVIEW_NAME: string;
        REVIEW_TEXT: string;
        REVIEW_DATE: string;
    };
}