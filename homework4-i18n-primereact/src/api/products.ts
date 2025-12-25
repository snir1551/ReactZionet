import type { Product, ProductsResponse } from './types';

const BASE_URL = 'https://dummyjson.com';

export async function fetchProducts(): Promise<ProductsResponse> {
  const response = await fetch(`${BASE_URL}/products?limit=100`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
}
