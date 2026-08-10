import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import PageStack from '@layouts/PageStack/PageStack';
import CatalogProducts from '@components/blocks/CatalogProducts/CatalogProducts.tsx';
import AnswersToQuestions from '@components/blocks/AnswersToQuestions/AnswersToQuestions.tsx';
import Reviews from '@components/blocks/Reviews/Reviews.tsx';
import SubscribeNewsLetter from '@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx';
import Breadcrumbs from '@components/Breadcrumbs/Breadcrumbs.tsx';

import { useGetCategoriesQuery } from '@store/api/categories/categoriesApi';
import { getCatalogCategory } from '@components/blocks/CatalogProducts/catalogConfig';
import { getCatalogCategorySlug, normalizeCatalogTitle } from '@/helpers/catalog';

const toPageTitle = (value: string) => {
  const normalized = normalizeCatalogTitle(value).toLocaleLowerCase('ru-RU');

  return normalized.replace(/^./u, (letter) => letter.toLocaleUpperCase('ru-RU'));
};

const CatalogCategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { pathname } = useLocation();
  const { data: categoriesData } = useGetCategoriesQuery();

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

    const apiCategory = categoriesData?.items.find(
      (item) => getCatalogCategorySlug(item) === resolvedSlug,
    );

    if (apiCategory) {
      return toPageTitle(apiCategory.name);
    }

    return toPageTitle(getCatalogCategory(resolvedSlug).title);
  }, [categoriesData, resolvedSlug]);

  return (
    <>
      <Breadcrumbs title={title} hideTitleOnMobile />
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
