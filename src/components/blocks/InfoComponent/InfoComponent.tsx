import {useParams} from "react-router-dom";
//styles
import styles from './InfoComponent.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//subpages
import InfoDeliveryPayment from "@components/blocks/InfoComponent/subpages/InfoDeliveryPayment/InfoDeliveryPayment.tsx";
import InfoReturnPolicy from "@components/blocks/InfoComponent/subpages/InfoReturnPolicy/InfoReturnPolicy.tsx";
//components
import InfoAside from "@components/blocks/InfoComponent/components/InfoAside/InfoAside.tsx";
//types
import type {InfoComponentInterface} from "@components/blocks/InfoComponent/types/types.ts";

const pages: InfoComponentInterface[] = [
    {
        id: 1,
        url: 'faq',
        title: 'F.A.Q',
        content: '',
    },
    {
        id: 2,
        url: 'delivery-payment',
        title: 'Доставка и оплата',
        content: <InfoDeliveryPayment />,
    },
    {
        id: 3,
        url: 'loyalty-program',
        title: 'Программа лояльности',
        content: 'Текст про программу лояльности',
    },
    {
        id: 4,
        url: 'return-policy',
        title: 'Условия возврата',
        content: <InfoReturnPolicy />,
    },
    {
        id: 5,
        url: 'gift-certificates',
        title: 'Подарочные сертификаты',
        content: 'Текст про подарочные сертификаты',
    },
];

const InfoComponent = () => {

    const { url } = useParams();

    const activePage = pages.find((item) => item.url === url) || pages[0];

    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.info}>
                <InfoAside pages={pages}/>
                {activePage.content}
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default InfoComponent;