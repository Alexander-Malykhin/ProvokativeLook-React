import { useParams } from "react-router-dom";
//styles
import styles from "./InfoComponent.module.scss";
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//components
import InfoAside from "@components/blocks/InfoComponent/components/InfoAside/InfoAside.tsx";
//navigation
import {pages} from "@components/blocks/InfoComponent/Navigation.tsx";


const InfoComponent = () => {
  const { url } = useParams();

  const activePage = pages.find((item) => item.url === url) || pages[0];

  return (
    <SectionLayout>
      <MainLayoutContainer className={styles.info}>
        <InfoAside pages={pages} />
        {activePage.content}
      </MainLayoutContainer>
    </SectionLayout>
  );
};

export default InfoComponent;
