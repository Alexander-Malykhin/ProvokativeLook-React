import { useEffect, useMemo } from 'react';
import { useGetFeaturedProductsInfiniteQuery } from '@store/api/catalog/catalogApi';
import { catalogProductToListItem } from '@store/api/catalog/format';
import type { FeaturedProductType } from '@store/api/catalog/types';
import { useCarousel } from './useCarousel';

export const useFeaturedCarousel = (type: FeaturedProductType) => {
  const { data, hasNextPage, fetchNextPage, isFetching, isError, refetch } = useGetFeaturedProductsInfiniteQuery(type);
  const products = useMemo(() => {
    const unique = new Map(data?.pages.flatMap((page) => page.products).map((product) => [product.id, product]));
    return [...unique.values()].filter((product) => product.image?.trim()).map(catalogProductToListItem);
  }, [data]);
  const carousel = useCarousel({ itemCount: products.length });
  const { activeIndex } = carousel;
  useEffect(() => {
    if (hasNextPage && !isFetching && !isError && activeIndex >= Math.max(1, products.length - 5)) {
      void fetchNextPage();
    }
  }, [activeIndex, products.length, hasNextPage, isFetching, isError, fetchNextPage]);
  const loadMore = () => {
    if (isFetching) return;
    if (hasNextPage) void fetchNextPage();
    else if (isError) void refetch();
  };
  return { products, carousel, hasNextPage, isFetching, isError, loadMore };
};
