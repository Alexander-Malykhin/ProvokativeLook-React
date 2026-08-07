// layouts
import PageStack from "@layouts/PageStack/PageStack";
//blocks
import About from "@components/blocks/About/About.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";

const AboutPage = () => {
  return (
    <>
      <Breadcrumbs title={"О нас"} />
      <PageStack>
        <About />
        <SubscribeNewsLetter />
      </PageStack>
    </>
  );
};

export default AboutPage;
