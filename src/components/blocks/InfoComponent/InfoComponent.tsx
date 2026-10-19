import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styles from './InfoComponent.module.scss';
import SectionLayout from '@layouts/SectionLayout/SectionLayout.tsx';
import MainLayoutContainer from '@layouts/MainLayoutContainer/MainLayoutContainer.tsx';
import InfoAside from '@components/blocks/InfoComponent/components/InfoAside/InfoAside.tsx';
import { useGetDeliveryPaymentPagesQuery } from '@store/api/info/infoApi';

const InfoComponent = () => {
  const { url } = useParams();
  const { data, isLoading, isFetching, isError } = useGetDeliveryPaymentPagesQuery();

  const pages = useMemo(
    () =>
      (data?.pages ?? []).map((page) => ({
        id: page.id,
        url: page.code,
        title: page.title,
      })),
    [data?.pages],
  );

  const activePage = useMemo(() => {
    if (!data?.pages?.length) return null;
    return data.pages.find((page) => page.code === url) ?? data.pages[0];
  }, [data, url]);

  const showSkeleton = isLoading || (isFetching && !data);

  return (
    <SectionLayout>
      <MainLayoutContainer className={styles.info}>
        {showSkeleton ? (
          <aside className={styles.info__asideSkeleton} aria-hidden="true">
            <span />
            <span />
          </aside>
        ) : pages.length > 0 ? (
          <InfoAside pages={pages} />
        ) : (
          <div />
        )}

        <div className={styles.info__content} aria-busy={showSkeleton || isFetching}>
          {showSkeleton ? (
            <div className={styles.info__skeleton} aria-label="Загрузка страницы">
              <span className={styles.info__skeletonWide} />
              <span className={styles.info__skeletonWide} />
              <span className={styles.info__skeletonMedium} />
              <span className={styles.info__skeletonSpacer} />
              <span className={styles.info__skeletonWide} />
              <span className={styles.info__skeletonWide} />
              <span className={styles.info__skeletonShort} />
            </div>
          ) : isError || !activePage ? (
            <div className={styles.info__error}>Не удалось загрузить содержимое страницы.</div>
          ) : (
            <>
              {isFetching && <div className={styles.info__loadingBar} aria-hidden="true" />}
              <div className={styles.info__html} dangerouslySetInnerHTML={{ __html: activePage.content }} />
            </>
          )}
        </div>
      </MainLayoutContainer>
    </SectionLayout>
  );
};

export default InfoComponent;
