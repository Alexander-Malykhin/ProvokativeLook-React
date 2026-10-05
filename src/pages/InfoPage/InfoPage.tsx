import PageStack from "@layouts/PageStack/PageStack";
import AnswersToQuestions from "@components/blocks/AnswersToQuestions/AnswersToQuestions.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
import InfoComponent from "@components/blocks/InfoComponent/InfoComponent.tsx";
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";
const InfoPage = () => {
    return (<>
      <Breadcrumbs />
      <PageStack>
        <InfoComponent />
        <AnswersToQuestions />
        <SubscribeNewsLetter />
      </PageStack>
    </>);
};
export default InfoPage;

