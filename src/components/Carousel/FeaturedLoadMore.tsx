import styles from './FeaturedLoadMore.module.scss';

interface FeaturedLoadMoreProps {
  isFetching: boolean;
  isError: boolean;
  hasNextPage: boolean;
  onLoad: () => void;
}

const FeaturedLoadMore = ({ isFetching, isError, hasNextPage, onLoad }: FeaturedLoadMoreProps) => {
  if (!isFetching && !isError && !hasNextPage) return null;
  return (
    <div className={styles.more}>
      <span role="status">{isFetching ? 'Загружаем товары…' : isError ? 'Не удалось загрузить товары.' : ''}</span>
      {!isFetching && (hasNextPage || isError) && (
        <button type="button" onClick={onLoad} className={styles.more__button}>
          {isError ? 'Повторить загрузку' : 'Показать ещё'}
        </button>
      )}
    </div>
  );
};

export default FeaturedLoadMore;
