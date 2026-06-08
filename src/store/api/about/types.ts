export interface AboutBlock {
    title: string;
    text: string;
}

export interface AboutResponse {
    id: number;
    code: string;
    title: string;
    image: string | null;
    text: string;
    blocks: AboutBlock[];
}