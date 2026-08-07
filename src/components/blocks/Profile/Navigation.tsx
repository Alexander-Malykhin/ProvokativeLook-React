import type {ProfileNavigationItemInterface} from "@components/blocks/Profile/types/types.ts";
// subpages
import ProfileData from "@components/blocks/Profile/subpages/ProfileData/ProfileData.tsx";
import ProfileOrders from "@components/blocks/Profile/subpages/ProfileOrders/ProfileOrders.tsx";
import ProfileAddresses from "@components/blocks/Profile/subpages/ProfileAddresses/ProfileAddresses.tsx";
import ProfileNotifications from "@components/blocks/Profile/subpages/ProfileNotifications/ProfileNotifications.tsx";

export const navigation: ProfileNavigationItemInterface[] = [
    {
        id: 1,
        url: "data",
        title: "Мои данные",
        component: (title) => <ProfileData title={title} />,
    },
    {
        id: 2,
        url: "orders",
        title: "Мои заказы",
        component: (title) => <ProfileOrders title={title} />,
    },
    {
        id: 3,
        url: "addresses",
        title: "Мои адреса",
        component: (title) => <ProfileAddresses title={title} />,
    },
    {
        id: 5,
        url: "notifications",
        title: "Уведомления",
        component: (title) => <ProfileNotifications title={title} />,
    },
];