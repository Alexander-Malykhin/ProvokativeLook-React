import PageStack from "@layouts/PageStack/PageStack";
import Reviews from "@components/blocks/Reviews/Reviews.tsx";
import AnswersToQuestions from "@components/blocks/AnswersToQuestions/AnswersToQuestions.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
import Category from "@components/blocks/Category/Category.tsx";
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";
const CatalogPage = () => {
    return (<>
      <Breadcrumbs />
      <PageStack>
        <Category />
        <Reviews />
        <AnswersToQuestions />
        <SubscribeNewsLetter />
      </PageStack>
    </>);
};
export default CatalogPage;

