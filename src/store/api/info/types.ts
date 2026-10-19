export interface InfoPageItem {
  id: number;
  code: string;
  title: string;
  sort: number;
  content: string;
}

export interface InfoPagesResponse {
  iblockId: number;
  pages: InfoPageItem[];
}
