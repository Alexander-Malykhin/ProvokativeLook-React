export interface BreadcrumbsInterface {
  title?: string;
  hideTitleOnMobile?: boolean;
  hideTitle?: boolean;
  items?: BreadcrumbItemInterface[];
}
export interface BreadcrumbItemInterface {
  title: string;
  path: string;
  hidden: boolean;
}
