import { AxiosResponse } from "axios";
import { Rate } from "interfaces/review.model";
import api from "api/api";

export const getReviewByUser = async (productId: string) => {
  const response = await api.get(`reviews/${productId}/user`);
  return response.data;
};

export const getReviews = async (productId: string) => {
  const response = await api.get(`reviews/${productId}`);
  return response.data;
};

export const filterReviews = async ({
  productId,
  rating,
  sort = "newest",
}: {
  productId: string;
  rating?: number;
  sort?: "newest" | "highest" | "lowest";
}) => {
  const params = new URLSearchParams();
  if (rating) params.append("rating", rating.toString());
  if (sort) params.append("sort", sort);

  const response = await api.get(
    `reviews/${productId}/filter?${params.toString()}`,
  );
  return response.data;
};

export const createReview = async (data: Rate): Promise<AxiosResponse> => {
  const { productId, user, ...reviewData } = data;
  const response = await api.post(`reviews/${productId}`, reviewData);
  return response.data;
};

export const updateReview = async ({
  productId,
  reviewId,
  data,
}: {
  productId: string;
  reviewId: string;
  data: Partial<Rate>;
}): Promise<AxiosResponse> => {
  const response = await api.put(`reviews/${productId}/${reviewId}`, data);
  return response.data;
};

export const deleteReview = async ({
  productId,
  reviewId,
}: {
  productId: string;
  reviewId: string;
}) => {
  const response = await api.delete(`reviews/${productId}/${reviewId}`);
  return response.data;
};

export const likeReview = async ({
  productId,
  reviewId,
}: {
  productId: string;
  reviewId: string;
}) => {
  const response = await api.post(`reviews/${productId}/${reviewId}/like`);
  return response.data;
};

export const dislikeReview = async ({
  productId,
  reviewId,
}: {
  productId: string;
  reviewId: string;
}) => {
  const response = await api.post(`reviews/${productId}/${reviewId}/dislike`);
  return response.data;
};
