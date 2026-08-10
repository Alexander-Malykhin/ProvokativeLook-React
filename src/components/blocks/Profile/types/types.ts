import type { InputHTMLAttributes, ReactNode } from "react";

export interface ProfilePageProps {
  title: string;
}

export interface ProfileNavigationItemInterface {
  id: number;
  url: string;
  title: string;
  component?: (title: string) => ReactNode;
}

export interface ProfileAsideInterface {
  navigation: ProfileNavigationItemInterface[];
}

export interface ProfileDataFieldInterface {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string | null;
}

export type OrderStatus = "delivery" | "completed" | "return" | "cancelled";

export interface OrderProductInterface {
  id: number;
  image: string | null;
}

export interface OrderInterface {
  id: number;
  number: string;
  date: string;
  status: OrderStatus;
  statusText: string;
  total: number;
  productsCount: number;
  products: OrderProductInterface[];
}

export interface ReturnProductInterface {
  id: number;
  image: string;
}

export interface ReturnItemInterface {
  id: number;
  status: string;
  date: string;
  orderNumber: string;
  total: number;
  productsCount: number;
  products: ReturnProductInterface[];
}

export interface ProfileFieldRadioInterface {
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  register?: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "name" | "value" | "checked" | "onChange">;
  children: ReactNode;
  mode?: "static" | "dynamic";
}
