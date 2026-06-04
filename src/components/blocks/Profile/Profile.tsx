//styles
import styles from './Profile.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
import ProfileData from "@components/blocks/Profile/subpages/ProfileData/ProfileData.tsx";
import {useParams} from "react-router-dom";
import ProfileAside from "@components/blocks/Profile/components/ProfileAside/ProfileAside.tsx";
import ProfileOrders from "@components/blocks/Profile/subpages/ProfileOrders/ProfileOrders.tsx";
import type {ReactNode} from "react";
import ProfileAddresses from "@components/blocks/Profile/subpages/ProfileAddresses/ProfileAddresses.tsx";
import ProfileNotifications from "@components/blocks/Profile/subpages/ProfileNotifications/ProfileNotifications.tsx";
import ProfileReturn from "@components/blocks/Profile/subpages/ProfileReturn/ProfileReturn.tsx";

export interface ProfileNavigationItemInterface {
    id: number;
    url: string;
    title: string;
     component?: (title: string) => ReactNode;
}

export interface ProfileAsideInterface {
    navigation: ProfileNavigationItemInterface[];
}

const navigation = [
    {
        id: 1,
        url: 'data',
        title: 'Мои данные',
        component: (title:string) => <ProfileData title={title}/>,
    },
    {
        id: 2,
        url: 'orders',
        title: 'Мои заказы',
        component: (title:string) => <ProfileOrders title={title}/>,
    },
    {
        id: 3,
        url: 'addresses',
        title: 'Мои адреса',
        component: (title:string) => <ProfileAddresses title={title}/>,
    },
    {
        id: 4,
        url: 'return',
        title: 'Возврат',
        component: (title:string) => <ProfileReturn title={title}/>,
    },
    {
        id: 5,
        url: 'notifications',
        title: 'Уведомления',
        component: (title:string) => <ProfileNotifications title={title}/>,
    },
];

const Profile = () => {
    const {url = 'data'} = useParams();

    const activeSubPage = navigation.find(item => item.url === url);

    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.profile}>
                <div className={styles.profile__column}>
                    <ProfileAside navigation={navigation}/>
                </div>

                {activeSubPage?.component?.(activeSubPage.title)}
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default Profile;