export interface AnswerApiItem {
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

export interface AnswerItemData {
  id: number;
  title: string;
  text: string;
}

export interface AnswerItemProps {
  title: string;
  text: string;
  isActive: boolean;
  onClick: () => void;
}

export interface AnswerListProps {
  answers: AnswerItemData[];
  activeId: number | null;
  setActiveId: (id: number | null) => void;
}
