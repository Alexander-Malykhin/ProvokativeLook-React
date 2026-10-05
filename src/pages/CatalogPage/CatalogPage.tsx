import PageStack from "@layouts/PageStack/PageStack";
import AnswersToQuestions from "@components/blocks/AnswersToQuestions/AnswersToQuestions.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";
import CatalogCategories from "@components/CatalogCategories/CatalogCategories.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import { useGetCatalogSectionsQuery } from "@store/api/catalog/catalogApi";
import { slugifyCatalogValue } from "@/helpers/catalog";
const CatalogPage = () => {
    const { data, isLoading } = useGetCatalogSectionsQuery();
    const cards = (data?.sections ?? []).map((section) => ({
        id: section.id,
        title: section.name,
        image: section.image,
        imageScale: section.imageScale,
        imagePositionX: section.imagePositionX,
        imagePositionY: section.imagePositionY,
        path: `/catalog/${slugifyCatalogValue(section.code || section.name)}`,
    }));
    return (<>
      <Breadcrumbs />
      <PageStack>
        <SectionLayout>
          <MainLayoutContainer>
            <CatalogCategories cards={cards} variant="grid" isLoading={isLoading}/>
          </MainLayoutContainer>
        </SectionLayout>
        <AnswersToQuestions />
        <SubscribeNewsLetter />
      </PageStack>
    </>);
};
export default CatalogPage;
