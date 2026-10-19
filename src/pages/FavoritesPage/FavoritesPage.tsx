import PageStack from '@layouts/PageStack/PageStack';
import SubscribeNewsLetter from '@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx';
import Favorites from '@components/blocks/Favorites/Favorites.tsx';
import ViewedProducts from '@components/blocks/ViewedProducts/ViewedProducts.tsx';
import Breadcrumbs from '@components/Breadcrumbs/Breadcrumbs.tsx';
const FavoritesPage = () => {
  return (
    <>
      <Breadcrumbs title="Избранное" />
      <PageStack>
        <Favorites />
        <ViewedProducts />
        <SubscribeNewsLetter />
      </PageStack>
    </>
  );
};
export default FavoritesPage;
