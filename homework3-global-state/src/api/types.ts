// Type definitions for DummyJSON API
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface ApiError {
  message: string;
  status?: number;
}