export interface OrderFormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addressId: string;
    delivery: '' | 'delivery' | 'pickup';
    payment: "cash" | "card";
    privacy: boolean;
}

