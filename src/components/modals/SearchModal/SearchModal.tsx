import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import Modal from "@UI/overlays/Modal/Modal";
import Image from "@UI/media/Image/Image";
import SearchImage from "@assets/header/search.svg";
import CategoryImage from "@assets/category/category.svg";
import ProductCard from "@components/ProductCard/ProductCard";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { close as closeSearch } from "@store/slices/toggleSearchSlice";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import {
  useGetCatalogProductsQuery,
  useSearchCatalogQuery,
} from "@store/api/catalog/catalogApi";
import { useGetCategoriesQuery } from "@store/api/categories/categoriesApi";
import { catalogProductToListItem } from "@store/api/catalog/format";
import styles from "./SearchModal.module.scss";
import { POPULAR_SEARCHES, SEARCH_SUGGESTIONS } from "./data";

const SearchModal = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const active = useAppSelector((state) => state.toggleSearch.active);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  const canSearch = debouncedQuery.length >= 2;

  const { data: categoriesData } = useGetCategoriesQuery(undefined, { skip: !active });
  const { data: searchData, isFetching: isSearching } = useSearchCatalogQuery(
    { q: debouncedQuery, limit: 12 },
    { skip: !active || !canSearch },
  );
  const { data: popularData, isFetching: isLoadingPopular } = useGetCatalogProductsQuery(
    { limit: 4, offset: 0, sort: "popular" },
    { skip: !active || canSearch },
  );

  const products = (canSearch ? searchData?.products : popularData?.products) ?? [];
  const productCards = useMemo(() => products.map(catalogProductToListItem), [products]);

  const searchSections = canSearch ? searchData?.sections ?? [] : [];
  const fallbackCategories = useMemo(
    () => (categoriesData?.items ?? []).filter((item) => item.catalog?.show !== false).slice(0, 5),
    [categoriesData?.items],
  );

  const close = () => {
    setQuery("");
    dispatch(closeSearch());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSearch) return;

    if (productCards.length === 1) {
      const id = productCards[0].id;
      close();
      navigate(`/product/${id}`);
    }
  };

  const applyQuery = (value: string) => setQuery(value);
  const isBusy = isSearching || isLoadingPopular;

  return (
    <Modal
      open={active}
      onClose={close}
      overlayClassName={styles.search}
      contentClassName={styles.search__content}
      ariaLabelledBy="search-modal-title"
    >
      <div className={styles.search__mobileTitle}>
        <button type="button" className={styles.search__mobileBack} onClick={close} aria-label="Закрыть поиск">
          ←
        </button>
        <span>Поиск</span>
      </div>

      <form className={styles.search__top} onSubmit={handleSubmit}>
        <div className={styles.search__header}>
          <label className={styles.field}>
            <span id="search-modal-title" className="visually-hidden">Поиск по каталогу</span>
            <Image src={SearchImage} alt="" className={styles.field__image} />
            <input
              type="search"
              value={query}
              className={styles.field__input}
              placeholder="Поиск по каталогу"
              autoFocus
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className={styles.field__clear}
                onClick={() => setQuery("")}
                aria-label="Очистить поиск"
              >
                ×
              </button>
            )}
          </label>

          <div className={styles.search__buttons}>
            <button type="submit" className={styles.button__search} disabled={!canSearch}>Найти</button>
            <button type="button" className={styles.button__close} onClick={close}>Закрыть</button>
          </div>
        </div>
      </form>

      <div className={styles.search__bottom}>
        <div className={styles.search__category}>
          {SEARCH_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className={styles.search__category_item}
              onClick={() => applyQuery(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className={styles.popular}>
          <aside className={styles.aside}>
            <div className={styles.aside__content}>
              <h2 className={styles.aside__content_title}>Популярные запросы</h2>
              <div className={styles.aside__list}>
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={styles.aside__list_item}
                    onClick={() => applyQuery(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.aside__content}>
              <h2 className={styles.aside__content_title}>Категории</h2>
              <div className={styles.aside__list}>
                {searchSections.length > 0
                  ? searchSections.map((section) => (
                      <Link
                        key={section.id}
                        to={section.code ? `/catalog/${section.code}` : "/catalog"}
                        className={styles.aside__list_category}
                        onClick={close}
                      >
                        <Image src={CategoryImage} alt="" />
                        {section.name}
                      </Link>
                    ))
                  : fallbackCategories.map((category) => (
                      <Link
                        key={category.id}
                        to={category.link || `/catalog/${category.code}`}
                        className={styles.aside__list_category}
                        onClick={close}
                      >
                        <Image src={CategoryImage} alt="" />
                        {category.name}
                      </Link>
                    ))}
              </div>
            </div>

            {canSearch && (
              <Link to="/catalog" className={styles.aside__all} onClick={close}>
                Все результаты поиска →
              </Link>
            )}
          </aside>

          <div className={styles.grid}>
            <h2 className={styles.aside__content_title}>
              {canSearch
                ? `Результаты${searchData ? ` (${searchData.products.length})` : ""}`
                : "Популярные товары"}
            </h2>

            {isBusy ? (
              <div className={styles.grid__skeleton}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className={styles.grid__skeletonCard} />
                ))}
              </div>
            ) : productCards.length > 0 ? (
              <div
                className={styles.grid__content}
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest("a")) close();
                }}
              >
                {productCards.map((card) => <ProductCard key={card.id} {...card} />)}
              </div>
            ) : canSearch ? (
              <div className={styles.grid__empty}>По вашему запросу товары не найдены</div>
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
