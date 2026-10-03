export interface Category {
  _id: string;
  name: string;
  isTopCategory: boolean;
}

export interface Categories {
  categories: Category[];
  page?: number;
  pages?: number;
  total?: number;
}
