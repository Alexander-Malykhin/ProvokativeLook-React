import AuthRequired from "@components/auth/AuthRequired";
// layouts
import PageStack from "@layouts/PageStack/PageStack";
//blocks
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";
import Order from "@components/blocks/Order/Order.tsx";

const OrderPage = () => {
  return (
    <AuthRequired>
      <>
      <Breadcrumbs />
      <PageStack>
        <Order />
        <SubscribeNewsLetter />
      </PageStack>
      </>
    </AuthRequired>
  );
};

export default OrderPage;
