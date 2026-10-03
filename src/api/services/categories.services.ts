import api from "api/api";
import { Categories } from "interfaces/categories.model";

export const getCategories = async () => {
  const response = await api.get<Categories>(`categories`);
  return response.data;
};

export const getTopCategories = async () => {
  const response = await api.get<Categories>(`categories/top`);
  return response.data;
};
