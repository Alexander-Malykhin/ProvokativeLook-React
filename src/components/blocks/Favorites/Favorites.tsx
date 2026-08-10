import { Link } from "react-router-dom";
import styles from "./Favorites.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
import FavoritesHeader from "@components/blocks/Favorites/components/FavoritesHeader.tsx";
import ProductCard from "@components/ProductCard/ProductCard";
import { useClearFavoritesMutation, useGetFavoritesQuery } from "@store/api/favorites/favoritesApi";
import { catalogProductToListItem } from "@store/api/catalog/format";

const Favorites = () => {
  const { data, isLoading, isFetching } = useGetFavoritesQuery();
  const [clearFavorites, { isLoading: isClearing }] = useClearFavoritesMutation();
  const products = (data?.items ?? []).map(catalogProductToListItem);

  return (
    <SectionLayout>
      <MainLayoutContainer className={styles.favorites}>
        <FavoritesHeader
          count={data?.count ?? 0}
          isClearing={isClearing}
          onClear={() => void clearFavorites()}
        />

        {(isLoading || isFetching) && products.length === 0 ? (
          <div className={styles.favorites__skeleton} aria-label="Загрузка избранного" />
        ) : products.length > 0 ? (
          <div className={styles.favorites__list}>
            {products.map((card) => <ProductCard key={card.id} {...card} />)}
          </div>
        ) : (
          <div className={styles.favorites__empty}>
            <p>Нет избранных товаров</p>
            <Link to="/catalog">Перейти в каталог</Link>
          </div>
        )}
      </MainLayoutContainer>
    </SectionLayout>
  );
};

export default Favorites;
