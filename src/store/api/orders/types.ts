export type OrderStatus = "delivery" | "completed" | "return" | "cancelled";

export interface OrderProductDto {
  id: number;
  offerId?: number | null;
  name: string;
  image: string | null;
  quantity: number;
}

export interface OrderMethodDto {
  code: string;
  name: string;
}

export interface OrderStageDto {
  id: string;
  name: string;
  sort?: number;
  semantics?: string;
  color?: string;
}

export interface OrderDto {
  id: number;
  orderId?: number | null;
  number: string;
  title: string;
  date: string | null;
  status: OrderStatus;
  statusText: string;
  stage: OrderStageDto;
  total: number;
  currency: string;
  delivery?: OrderMethodDto | null;
  payment?: OrderMethodDto | null;
  productsCount: number;
  products: OrderProductDto[];
}

export interface OrdersResponse {
  success: boolean;
  data: {
    items: OrderDto[];
    pagination: {
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

export interface CreateOrderRequest {
  recipient: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  addressId: number;
  delivery: "cdek" | "mail";
  payment: "cash" | "card";
  privacy: boolean;
}

export interface CreateOrderResponse {
  success: boolean;
  order: {
    orderId: number;
    accountNumber: string;
    dealId: number;
    total: number;
    currency: string;
    delivery: {
      code: string;
      name: string;
    };
    payment: {
      code: string;
      name: string;
    };
  };
}
