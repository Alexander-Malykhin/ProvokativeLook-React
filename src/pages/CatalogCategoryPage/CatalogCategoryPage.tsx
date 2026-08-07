// layouts
import PageStack from "@layouts/PageStack/PageStack";
//blocks
import CatalogProducts from "@components/blocks/CatalogProducts/CatalogProducts.tsx";
import AnswersToQuestions from "@components/blocks/AnswersToQuestions/AnswersToQuestions.tsx";
import Reviews from "@components/blocks/Reviews/Reviews.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//footer
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";

const CatalogCategoryPage = () => {
  return (
    <>
      <Breadcrumbs />
      <PageStack>
        <CatalogProducts />
        <Reviews />
        <AnswersToQuestions />
        <SubscribeNewsLetter />
      </PageStack>
    </>
  );
};

export default CatalogCategoryPage;
