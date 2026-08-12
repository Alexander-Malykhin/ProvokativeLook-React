export type OrderStatus = "delivery" | "completed" | "return" | "cancelled";

export interface OrderProductDto {
  id: number;
  offerId?: number | null;
  name: string;
  image: string | null;
  quantity: number;
  size?: string | null;
  color?: string | null;
  price?: number | null;
  oldPrice?: number | null;
  lineTotal?: number | null;
}

export interface OrderMethodDto {
  code: string;
  name: string;
  addressId?: number | null;
  pickupCode?: string | null;
  pickupName?: string | null;
  formattedAddress?: string | null;
  city?: string | null;
  country?: string | null;
  countryId?: number | null;
  countryCode?: string | null;
  postalCode?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
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
  productsTotal?: number;
  discountTotal?: number;
  deliveryPrice?: number;
  paid?: number;
  isPaid: boolean;
  paymentState?: "paid" | "pending" | "unpaid";
  canPay: boolean;
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
      pointCode?: string;
      pointName?: string;
      address?: string;
    };
    payment: {
      code: string;
      name: string;
      required: boolean;
      invoiceId?: number | null;
      amount?: number;
      gateway?: "robokassa" | "modulbank" | string | null;
      url?: string | null;
    };
  };
}

export interface CreateOrderPaymentResponse {
  success: boolean;
  payment: {
    required: boolean;
    invoiceId?: number | null;
    amount?: number;
    gateway?: string | null;
    url?: string | null;
    paid?: boolean;
  };
}
