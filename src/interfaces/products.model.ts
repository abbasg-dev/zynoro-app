import { Brand } from "./brands.model";
import { Category } from "./categories.model";
import { Review } from "./review.model";

export interface Product {
  _id: string;

  name: string;
  description: string;
  richDescription?: string;

  image: string;
  images: string[];

  brand: Brand;
  category: Category | string;

  originalPrice: number;
  discount: number;
  priceAfterDiscount: number;

  countInStock: number;

  isFeatured: boolean;
  shipping: boolean;
  returnable: boolean;
  trend: boolean;

  returnPeriod?: string;
  shippingInfo?: string;

  color?: string[];
  ram?: string[];
  weight?: string[];
  sizes?: string[];

  rating: number;
  numReviews: number;
  orderCount: number;

  reviews: Review[];

  createdAt: string;
  updatedAt: string;
}

export interface Products {
  count: number;
  products: Product[];
}
