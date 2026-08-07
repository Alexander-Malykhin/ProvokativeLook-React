import { useState, type FormEvent } from "react";

import Modal from "@UI/overlays/Modal/Modal";
import Image from "@UI/media/Image/Image";
import SearchImage from "@assets/header/search.svg";
import CategoryImage from "@assets/category/category.svg";
import ProductCard from "@components/ProductCard/ProductCard";
import { products } from "@api/static/products";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { close as closeSearch } from "@store/slices/toggleSearchSlice";
import styles from "./SearchModal.module.scss";
import {
  POPULAR_SEARCHES,
  SEARCH_CATEGORIES,
  SEARCH_SUGGESTIONS,
} from "./data";

const SearchModal = () => {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => state.toggleSearch.active);
  const [query, setQuery] = useState("");
  const close = () => dispatch(closeSearch());

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Search API will be connected here without changing the modal UI.
  };

  return (
    <Modal
      open={active}
      onClose={close}
      overlayClassName={styles.search}
      contentClassName={styles.search__content}
      ariaLabelledBy="search-modal-title"
    >
      <form className={styles.search__top} onSubmit={handleSubmit}>
        <div className={styles.search__header}>
          <label className={styles.field}>
            <span id="search-modal-title" className="visually-hidden">
              Поиск по каталогу
            </span>
            <Image src={SearchImage} alt="" className={styles.field__image} />
            <input
              type="search"
              value={query}
              className={styles.field__input}
              placeholder="Поиск по каталогу"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className={styles.search__buttons}>
            <button type="submit" className={styles.button__search}>
              Найти
            </button>
            <button
              type="button"
              className={styles.button__close}
              onClick={close}
            >
              Закрыть
            </button>
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
              onClick={() => setQuery(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className={styles.popular}>
          <aside className={styles.aside}>
            <div className={styles.aside__content}>
              <h2 className={styles.aside__content_title}>
                Популярные запросы
              </h2>
              <div className={styles.aside__list}>
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={styles.aside__list_item}
                    onClick={() => setQuery(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.aside__content}>
              <h2 className={styles.aside__content_title}>Категории</h2>
              <div className={styles.aside__list}>
                {SEARCH_CATEGORIES.map((category) => (
                  <article
                    key={category}
                    className={styles.aside__list_category}
                  >
                    <Image src={CategoryImage} alt="" />
                    {category}
                  </article>
                ))}
              </div>
            </div>
          </aside>

          <div className={styles.grid}>
            <h2 className={styles.aside__content_title}>Популярные товары</h2>
            <div className={styles.grid__content}>
              {products.slice(0, 4).map((card) => (
                <ProductCard
                  key={card.id}
                  image={card.image}
                  title={card.title}
                  sizes={card.sizes}
                  price={card.price}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
