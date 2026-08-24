import { useSearchParams } from "react-router-dom";
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs";
import CatalogList from "@components/blocks/CatalogProducts/components/CatalogList/CatalogList";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import { useSearchCatalogQuery } from "@store/api/catalog/catalogApi";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";
import styles from "./SearchResultsPage.module.scss";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const canSearch = query.length >= 2;
  const { data, isLoading, isFetching, error } = useSearchCatalogQuery(
    { q: query, limit: 50 },
    { skip: !canSearch },
  );
  const products = data?.products ?? [];

  return (
    <>
      <Breadcrumbs title="Результаты поиска" hideTitleOnMobile />
      <SectionLayout className={styles.searchResults}>
        <MainLayoutContainer className={styles.searchResults__content}>
          <div className={styles.searchResults__header}>
            <h1>Результаты поиска</h1>
            {canSearch && (
              <p>
                По запросу «{query}» найдено: <strong>{products.length}</strong>
              </p>
            )}
          </div>

          {canSearch ? (
            <CatalogList
              products={products}
              isLoading={isLoading}
              isFetching={isFetching}
              errorMessage={error ? getRequestErrorMessage(error, "Не удалось выполнить поиск") : null}
            />
          ) : (
            <div className={styles.searchResults__empty}>Введите минимум 2 символа для поиска.</div>
          )}
        </MainLayoutContainer>
      </SectionLayout>
    </>
  );
};

export default SearchResultsPage;
