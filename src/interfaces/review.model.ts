import { User } from "./users.model";

export interface Review {
  _id: string;
  user: string;
  rating: number;
  comment: string;
  likes: string[];
  dislikes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Rate {
  _id?: string;
  productId?: string;
  user?: User | string;
  rating?: number;
  comment?: string;
  likes?: string[];
  dislikes?: string[];
  isOwner?: boolean;
  isLiked?: boolean;
  isDisliked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
