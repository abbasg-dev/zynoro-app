export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface UserOrder {
  id: string;
  date: string;
  total: number;
  paid: boolean;
  delivered: boolean;
  status: OrderStatus;
}

export interface MyOrdersResponse {
  orders: UserOrder[];
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItemInput[];
  createPaymentIntent?: boolean;
}
