import api from "api/api";
import {
  MyOrdersResponse,
  UserOrder,
  CreateOrderPayload,
} from "interfaces/orders.model";

export const createOrder = async (orderPayload: CreateOrderPayload) => {
  const response = await api.post(`orders/new`, orderPayload);
  return response.data;
};

export const getMyOrders = async (): Promise<UserOrder[]> => {
  const response = await api.get<MyOrdersResponse>(`orders/mine`);
  return response.data.orders;
};

export const markOrderAsPaid = async ({
  orderId,
  paymentIntentId,
}: {
  orderId: string;
  paymentIntentId?: string;
}) => {
  const response = await api.patch(`orders/${orderId}/pay`, {
    paymentIntentId,
  });
  return response.data;
};
