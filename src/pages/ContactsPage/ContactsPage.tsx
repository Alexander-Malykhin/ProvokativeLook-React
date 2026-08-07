// layouts
import PageStack from "@layouts/PageStack/PageStack";
//blocks
import ContactUs from "@components/blocks/ContactUs/ContactUs.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";

const ContactsPage = () => {
  return (
    <>
      <Breadcrumbs title={"Связаться с нами"} />
      <PageStack>
        <ContactUs />
        <SubscribeNewsLetter />
      </PageStack>
    </>
  );
};

export default ContactsPage;
