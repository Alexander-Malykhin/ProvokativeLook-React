import AuthRequired from "@components/auth/AuthRequired";
// layouts
import PageStack from "@layouts/PageStack/PageStack";
//blocks
import Bestsellers from "@components/blocks/Bestsellers/Bestsellers.tsx";
import Profile from "@components/blocks/Profile/Profile.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";

const ProfilePage = () => {
  return (
    <AuthRequired>
      <>
      <Breadcrumbs />
      <PageStack>
        <Profile />
        <Bestsellers />
      </PageStack>
      </>
    </AuthRequired>
  );
};

export default ProfilePage;
