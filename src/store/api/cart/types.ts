export interface CartItem {
  id: number;
  productId: number;
  offerId: number;
  name: string;
  article: string;
  image: string | null;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
  sum: number;
  currency: string;
  availableQuantity: number;
  isAvailable: boolean;
  availabilityMessage: string | null;
}

export interface Cart {
  items: CartItem[];
  total: number;
  quantity: number;
  count: number;
  currency: string;
}

export interface CartResponse {
  success: boolean;
  cart: Cart;
}

export interface AddCartItemRequest {
  productId: number;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  id: number;
  quantity: number;
}

export interface RemoveCartItemRequest {
  id: number;
}
