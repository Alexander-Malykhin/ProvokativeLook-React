import styles from './LegalPage.module.scss';
import SectionLayout from '@layouts/SectionLayout/SectionLayout';
import NotFound from '@components/blocks/NotFound/NotFound';
import SubscribeNewsLetter from '@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter';
import { useGetLegalPageQuery } from '@store/api/legal/legalApi';
interface LegalPageProps {
  pageCode: string;
}
const LegalPage = ({ pageCode }: LegalPageProps) => {
  const { data, isLoading, isFetching, isError, error } = useGetLegalPageQuery(pageCode, {
    skip: !pageCode,
  });
  const errorStatus = error && typeof error === 'object' && 'status' in error ? error.status : null;
  const isNotFound = !pageCode || errorStatus === 404 || errorStatus === 422;
  if (isLoading) {
    return (
      <SectionLayout>
        <article className={`${styles.legal} ${styles.legal_skeleton}`} aria-busy="true" aria-label="Загрузка страницы">
          <div className={`${styles.legal__skeletonLine} ${styles.legal__skeletonTitle}`} />

          <div className={styles.legal__skeletonIntro}>
            <div className={`${styles.legal__skeletonLine} ${styles.legal__skeletonWide}`} />
            <div className={`${styles.legal__skeletonLine} ${styles.legal__skeletonMedium}`} />
          </div>

          {[0, 1, 2, 3].map((section) => (
            <section className={styles.legal__skeletonSection} key={section}>
              <div className={`${styles.legal__skeletonLine} ${styles.legal__skeletonHeading}`} />
              <div className={`${styles.legal__skeletonLine} ${styles.legal__skeletonWide}`} />
              <div className={`${styles.legal__skeletonLine} ${styles.legal__skeletonWide}`} />
              <div className={`${styles.legal__skeletonLine} ${styles.legal__skeletonMedium}`} />
            </section>
          ))}
        </article>
      </SectionLayout>
    );
  }
  if (isNotFound) {
    return (
      <>
        <NotFound />
        <SubscribeNewsLetter />
      </>
    );
  }
  if (isError || !data) {
    return (
      <SectionLayout>
        <div className={styles.legal}>
          <div className={styles.legal__error}>
            Не удалось загрузить страницу. Обновите страницу и попробуйте снова.
          </div>
        </div>
      </SectionLayout>
    );
  }
  return (
    <SectionLayout>
      <article className={styles.legal}>
        {isFetching && <div className={styles.legal__loadingBar} aria-hidden="true" />}

        <h1 className={styles.legal__title}>{data.title}</h1>

        {data.intro && <p className={styles.legal__intro}>{data.intro}</p>}

        {data.content && <div className={styles.legal__content} dangerouslySetInnerHTML={{ __html: data.content }} />}

        {data.updatedAt && <p className={styles.legal__updated}>Дата последнего обновления: {data.updatedAt}</p>}
      </article>
    </SectionLayout>
  );
};
export default LegalPage;
