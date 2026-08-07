import type {InfoComponentInterface} from "@components/blocks/InfoComponent/types/types.ts";
import InfoDeliveryPayment from "@components/blocks/InfoComponent/subpages/InfoDeliveryPayment/InfoDeliveryPayment.tsx";
import InfoReturnPolicy from "@components/blocks/InfoComponent/subpages/InfoReturnPolicy/InfoReturnPolicy.tsx";

export const pages: InfoComponentInterface[] = [
    {
        id: 1,
        url: "delivery-payment",
        title: "Доставка и оплата",
        content: <InfoDeliveryPayment />,
    },
    {
        id: 2,
        url: "return-policy",
        title: "Условия возврата",
        content: <InfoReturnPolicy />,
    },
];