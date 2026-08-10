export interface OrderFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressId: string;
  delivery: "cdek" | "mail";
  payment: "cash" | "card";
  privacy: boolean;
}
