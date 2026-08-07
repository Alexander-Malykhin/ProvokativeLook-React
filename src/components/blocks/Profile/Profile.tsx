// styles
import styles from "./Profile.module.scss";
// layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
// components
import ProfileAside from "@components/blocks/Profile/components/ProfileAside/ProfileAside.tsx";
// hooks
import { useParams } from "react-router-dom";
//navigation
import {navigation} from "@components/blocks/Profile/Navigation.tsx";

const Profile = () => {
  const { url = "data" } = useParams<{ url?: string }>();

  const activeSubPage =
    navigation.find((item) => item.url === url) ?? navigation[0];

  return (
    <SectionLayout>
      <MainLayoutContainer className={styles.profile}>
        <div className={styles.profile__column}>
          <ProfileAside navigation={navigation} />
        </div>

        {activeSubPage.component?.(activeSubPage.title)}
      </MainLayoutContainer>
    </SectionLayout>
  );
};

export default Profile;
