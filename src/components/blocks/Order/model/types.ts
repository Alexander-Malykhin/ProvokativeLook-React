export interface OrderFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressId: string;
  payment: "cash" | "card";
  privacy: boolean;
}
