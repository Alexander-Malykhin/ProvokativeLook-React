// layouts
import PageStack from "@layouts/PageStack/PageStack";
//blocks
import Basket from "@components/blocks/Basket/Basket.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";

const BasketPage = () => {
  return (
    <>
      <Breadcrumbs />
      <PageStack>
        <Basket />
        <SubscribeNewsLetter />
      </PageStack>
    </>
  );
};

export default BasketPage;
