import api from "api/api";
import { Brands, Brand } from "interfaces/brands.model";

export const getBrands = async () => {
  const response = await api.get<Brands>(`brands`);
  return response.data;
};

export const getBrandById = async (id: number) => {
  const response = await api.get<Brand>(`brands/${id}`);
  return response.data;
};
