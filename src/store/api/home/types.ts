import type {BannerCategoryItemInterface} from "@components/blocks/Banner/components/BannerCategory/types";
import type {PromoCategoryItemInterface} from "@components/blocks/CategoryPromo/types";
import type {AnswersToQuestionsInterface} from "@components/blocks/AnswersToQuestions/types";
import type {ReviewInterface} from "@components/blocks/Reviews/types";
import type {CategoryPromoInterface} from "@components/blocks/CatalogPromo/types.ts";
import type {FooterInformationInterface} from "@components/blocks/Footer/components/FooterContacts/types";
import type {FooterNavigationInterface} from "@components/blocks/Footer/components/FooterNavigation/types";
import type {FooterSocialInterface} from "@components/blocks/Footer/components/FooterSocials/types";


export interface HomeResponse {
    id: number;
    code: string;
    title: string;
    bannerText: string[];
    bannerImageLeft: string | null;
    bannerImageRight: string | null;

    categoryList: BannerCategoryItemInterface[];
    promoCategory: PromoCategoryItemInterface[];
    categories: CategoryPromoInterface[];

    answers: AnswersToQuestionsInterface[];
    reviews: ReviewInterface[];

    footerInformation: FooterInformationInterface[];
    footerNavigation: FooterNavigationInterface[];
    footerSocials: FooterSocialInterface[];
}