// layouts
import PageStack from "@layouts/PageStack/PageStack";
//blocks
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
import Reviews from "@components/blocks/Reviews/Reviews.tsx";
import Favorites from "@components/blocks/Favorites/Favorites.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";

const FavoritesPage = () => {
  return (
    <>
      <Breadcrumbs title="Избранное" />
      <PageStack>
        <Favorites />
        <Reviews />
        <SubscribeNewsLetter />
      </PageStack>
    </>
  );
};

export default FavoritesPage;
