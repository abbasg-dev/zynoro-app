export interface Brand {
  _id: string;
  name: string;
}

export interface Brands {
  brands: Brand[];
  page?: number;
  pages?: number;
  total?: number;
}
