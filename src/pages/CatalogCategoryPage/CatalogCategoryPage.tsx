import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PageStack from '@layouts/PageStack/PageStack';
import CatalogProducts from '@components/blocks/CatalogProducts/CatalogProducts.tsx';
import AnswersToQuestions from '@components/blocks/AnswersToQuestions/AnswersToQuestions.tsx';
import SubscribeNewsLetter from '@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx';
import Breadcrumbs from '@components/Breadcrumbs/Breadcrumbs.tsx';
import { useGetCatalogSectionsQuery } from '@store/api/catalog/catalogApi';
import { normalizeCatalogTitle, slugifyCatalogValue } from '@/helpers/catalog';
const toPageTitle = (value: string) => {
    const normalized = normalizeCatalogTitle(value).toLocaleLowerCase('ru-RU');
    return normalized.replace(/^./u, (letter) => letter.toLocaleUpperCase('ru-RU'));
};
const CatalogCategoryPage = () => {
    const { categorySlug } = useParams<{
        categorySlug: string;
    }>();
    const { pathname } = useLocation();
    const { data: sectionsData } = useGetCatalogSectionsQuery();
    const resolvedSlug = useMemo(() => {
        if (categorySlug) {
            return categorySlug;
        }
        return pathname.split('/').filter(Boolean).at(-1) ?? 'all';
    }, [categorySlug, pathname]);
    const title = useMemo(() => {
        if (resolvedSlug === 'all') {
            return 'Все товары';
        }
        const actualSection = (sectionsData?.sections ?? []).find((section) => slugifyCatalogValue(section.name) === resolvedSlug || slugifyCatalogValue(section.code) === resolvedSlug);
        if (actualSection) {
            return toPageTitle(actualSection.name);
        }
        return 'Каталог';
    }, [resolvedSlug, sectionsData?.sections]);
    return (<>
      <Breadcrumbs title={title} hideTitleOnMobile hideTitle/>
      <PageStack>
        <CatalogProducts />
        <AnswersToQuestions />
        <SubscribeNewsLetter />
      </PageStack>
    </>);
};
export default CatalogCategoryPage;
