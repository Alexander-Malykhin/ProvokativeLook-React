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
import { useGetCatalogProductsQuery, useGetCatalogSectionsQuery, useSearchCatalogQuery } from "@store/api/catalog/catalogApi";
import { catalogProductToListItem } from "@store/api/catalog/format";
import { slugifyCatalogValue } from "@/helpers/catalog";
import styles from "./SearchModal.module.scss";
import { POPULAR_SEARCHES, SEARCH_SUGGESTIONS } from "./data";

const formatCategoryTitle = (value: string): string => value
    .replace(/#br#/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const SearchModal = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const active = useAppSelector((state) => state.toggleSearch.active);
    const [query, setQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("plRecentSearches") ?? "[]");
            return Array.isArray(saved) ? saved.filter((item): item is string => typeof item === "string").slice(0, 10) : [];
        } catch {
            return [];
        }
    });
    const normalizedQuery = query.trim();
    const debouncedQuery = useDebouncedValue(normalizedQuery, 300);
    const searchQuery = submittedQuery === normalizedQuery && submittedQuery.length >= 2
        ? submittedQuery
        : debouncedQuery;
    const canSearch = searchQuery.length >= 2;
    const canSubmit = query.trim().length >= 2;
    const { data: sectionsData } = useGetCatalogSectionsQuery(undefined, { skip: !active });
    const { data: searchData, isFetching: isSearching } = useSearchCatalogQuery({ q: searchQuery, limit: 50 }, { skip: !active || !canSearch });
    const { data: popularData, isFetching: isLoadingPopular } = useGetCatalogProductsQuery({ limit: 4, offset: 0, sort: "popular" }, { skip: !active || canSearch });
    const products = canSearch
        ? searchData?.products ?? []
        : popularData?.products ?? [];
    const productCards = useMemo(() => products.map(catalogProductToListItem), [products]);
    const searchSections = canSearch ? searchData?.sections ?? [] : [];
    const fallbackCategories = useMemo(() => sectionsData?.sections ?? [], [sectionsData?.sections]);
    const searchCategoryLinks = useMemo(() => searchSections.map((section) => {
        return {
            ...section,
            name: formatCategoryTitle(section.name),
            path: `/catalog/${slugifyCatalogValue(section.code || section.name)}`,
        };
    }), [searchSections]);
    const close = () => {
        setQuery("");
        setSubmittedQuery("");
        dispatch(closeSearch());
    };
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const value = query.trim();
        if (value.length < 2)
            return;
        goToSearch(value);
    };
    const goToSearch = (value: string) => {
        const normalized = value.trim();
        if (normalized.length < 2)
            return;
        const nextRecent = [normalized, ...recentSearches.filter((item) => item.toLocaleLowerCase("ru-RU") !== normalized.toLocaleLowerCase("ru-RU"))].slice(0, 10);
        setRecentSearches(nextRecent);
        localStorage.setItem("plRecentSearches", JSON.stringify(nextRecent));
        setQuery("");
        setSubmittedQuery("");
        dispatch(closeSearch());
        navigate(`/search?q=${encodeURIComponent(normalized)}`);
    };
    const isBusy = (isSearching || isLoadingPopular) && productCards.length === 0;
    return (<Modal open={active} onClose={close} overlayClassName={styles.search} contentClassName={styles.search__content} ariaLabelledBy="search-modal-title">
      <div className={styles.search__mobileTitle}>
        <button type="button" className={styles.search__mobileBack} onClick={close} aria-label="Закрыть поиск">
          <span aria-hidden="true"/>
        </button>
        <span>Поиск</span>
      </div>

      <form className={styles.search__top} onSubmit={handleSubmit}>
        <div className={styles.search__header}>
          <label className={styles.field}>
            <span id="search-modal-title" className="visually-hidden">Поиск по каталогу</span>
            <Image src={SearchImage} alt="" className={styles.field__image}/>
            <input type="search" value={query} className={styles.field__input} placeholder="Поиск по каталогу" autoFocus onChange={(event) => { setSubmittedQuery(""); setQuery(event.target.value); }}/>
            {query && (<button type="button" className={styles.field__clear} onClick={() => { setSubmittedQuery(""); setQuery(""); }} aria-label="Очистить поиск">
                ×
              </button>)}
          </label>

          <div className={styles.search__buttons}>
            <button type="submit" className={styles.button__search} disabled={!canSubmit}>Найти</button>
            <button type="button" className={styles.button__close} onClick={close}>Закрыть</button>
          </div>
        </div>
      </form>

      <div className={styles.search__bottom}>
        <div className={styles.search__category}>
          {(recentSearches.length > 0 ? recentSearches : SEARCH_SUGGESTIONS).map((suggestion) => (<button key={suggestion} type="button" className={styles.search__category_item} onClick={() => goToSearch(suggestion)}>
              {suggestion}
            </button>))}
        </div>

        <div className={styles.popular}>
          <aside className={styles.aside}>
            <div className={styles.aside__content}>
              <h2 className={styles.aside__content_title}>{recentSearches.length ? "Последние запросы" : "Популярные запросы"}</h2>
              <div className={styles.aside__list}>
                {(recentSearches.length ? recentSearches : POPULAR_SEARCHES).map((item) => (<button key={item} type="button" className={styles.aside__list_item} onClick={() => goToSearch(item)}>
                    {item}
                  </button>))}
              </div>
            </div>

            <div className={styles.aside__content}>
              <h2 className={styles.aside__content_title}>Категории</h2>
              <div className={styles.aside__list}>
                {searchCategoryLinks.length > 0
            ? searchCategoryLinks.map((section) => (<Link key={`${section.id}-${section.path}`} to={section.path} className={styles.aside__list_category} onClick={close}>
                        <Image src={CategoryImage} alt=""/>
                        {section.name}
                      </Link>))
            : fallbackCategories.map((category) => (<Link key={category.id} to={`/catalog/${slugifyCatalogValue(category.code || category.name)}`} className={styles.aside__list_category} onClick={close}>
                        <Image src={CategoryImage} alt=""/>
                        {formatCategoryTitle(category.name)}
                      </Link>))}
              </div>
            </div>

            {canSearch && (<Link to={`/search?q=${encodeURIComponent(normalizedQuery)}`} className={styles.aside__all} onClick={close}>
                Все результаты поиска →
              </Link>)}
          </aside>

          <div className={styles.grid}>
            <h2 className={styles.aside__content_title}>
              {canSearch
            ? `Результаты${searchData ? ` (${productCards.length})` : ""}`
            : "Популярные товары"}
            </h2>

            {isBusy ? (<div className={styles.grid__skeleton}>
                {Array.from({ length: 4 }).map((_, index) => (<div key={index} className={styles.grid__skeletonCard}/>))}
              </div>) : productCards.length > 0 ? (<div className={styles.grid__content} onClick={(event) => {
                if ((event.target as HTMLElement).closest("a"))
                    close();
            }}>
                {productCards.map((card, index) => <ProductCard key={`${card.id}-${index}`} {...card} variant="search"/>)}
              </div>) : canSearch ? (<div className={styles.grid__empty}>По вашему запросу товары не найдены</div>) : null}
          </div>
        </div>
      </div>
    </Modal>);
};
export default SearchModal;
