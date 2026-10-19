import PageStack from '@layouts/PageStack/PageStack';
import NotFound from '@components/blocks/NotFound/NotFound.tsx';
import SubscribeNewsLetter from '@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx';
const NotFoundPage = () => {
  return (
    <>
      <PageStack>
        <NotFound />
        <SubscribeNewsLetter />
      </PageStack>
    </>
  );
};
export default NotFoundPage;
