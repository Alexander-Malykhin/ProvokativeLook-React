export interface BannerCategoryItem {
  id: number;
  iblockId: number;
  title: string;
  code: string;
  sort: number;
  properties: {
    CATEGORY_NAME_BANNER: string;
    CATEGORY_IMAGE_BANNER: string | null;
    CATEGORY_LINK: string;
    CATEGORY_SHOW_BANNER: string;
  };
}

export interface PromoCategoryItem {
  id: number;
  iblockId: number;
  title: string;
  code: string;
  sort: number;
  properties: {
    CATEGORY_NAME_PROMO: string;
    CATEGORY_IMAGE_PROMO: string | null;
    CATEGORY_LINK: string;
    CATEGORY_SHOW_PROMO: string;
  };
}

export interface HomeCategoryItem {
  id: number;
  iblockId: number;
  title: string;
  code: string;
  sort: number;
  properties: {
    CATEGORY_NAME_BANNER: string;
    CATEGORY_IMAGE_BANNER: string | null;
    CATEGORY_NAME_PROMO: string;
    CATEGORY_IMAGE_PROMO: string | null;
    CATEGORY_NAME_CATALOG: string;
    CATEGORY_IMAGE_CATALOG: string | null;
    CATEGORY_LINK: string;
    CATEGORY_SHOW_BANNER: string;
    CATEGORY_SHOW_PROMO: string;
    CATEGORY_SHOW_CATALOG: string;
  };
}

export interface HomeAnswerItem {
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

export interface HomeReviewItem {
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

export interface FooterInformationItem {
  id: number;
  key: string;
  text: string;
}

export interface FooterNavigationItem {
  id: number;
  navigationTitle: string;
  navigationList: Array<{
    title: string;
    link: string;
  }>;
}

export interface FooterSocialItem {
  id: number;
  title: string;
  properties: {
    MESSENGERS_ICON: string | null;
    MESSENGERS_LINK: string;
  };
}

export interface HomeResponse {
  id: number;
  code: string;
  title: string;
  bannerText: string[];
  bannerImageLeft: string | null;
  bannerImageRight: string | null;
  categoryList: BannerCategoryItem[];
  promoCategory: PromoCategoryItem[];
  categories: HomeCategoryItem[];
  answers: HomeAnswerItem[];
  reviews: HomeReviewItem[];
  footerInformation: FooterInformationItem[];
  footerNavigation: FooterNavigationItem[];
  footerSocials: FooterSocialItem[];
}
