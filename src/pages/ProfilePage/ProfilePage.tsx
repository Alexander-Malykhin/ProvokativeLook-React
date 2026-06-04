//styles
import styles from './ProfilePage.module.scss'
//blocks
import Bestsellers from "@components/blocks/Bestsellers/Bestsellers.tsx";
import Profile from "@components/blocks/Profile/Profile.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";

const ProfilePage = () => {
    return (
        <>
            <Breadcrumbs/>
            <main className={styles.page__main}>
                <Profile/>
                <Bestsellers/>
            </main>
        </>
    );
};

export default ProfilePage;