import { Product, Products } from "interfaces/products.model";
import api from "api/api";

export const getProducts = async (queryParams = ""): Promise<Product[]> => {
  const response = await api.get<Products>(`products${queryParams}`);

  return response.data.products;
};

export const getProduct = async (id: string) => {
  const response = await api.get<{ product: Product }>(`products/${id}`);
  return response.data;
};

export const getHighestPrice = async () => {
  const response = await api.get("products/highest-price");
  return response.data;
};

export const getFeaturedProducts = async (queryParams: string) => {
  const response = await api.get<{ products: Product[] }>(
    `products/featured/${queryParams}`,
  );
  return response.data.products;
};

export const getTrendingProducts = async (queryParams: string) => {
  const response = await api.get<{ products: Product[] }>(
    `products/trending/${queryParams}`,
  );
  return response.data.products;
};
