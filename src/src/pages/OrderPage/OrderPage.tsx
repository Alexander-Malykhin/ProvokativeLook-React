import PageStack from "@layouts/PageStack/PageStack";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";
import Order from "@components/blocks/Order/Order.tsx";
const OrderPage = () => {
    return (<>
      <Breadcrumbs />
      <PageStack>
        <Order />
        <SubscribeNewsLetter />
      </PageStack>
    </>);
};
export default OrderPage;

