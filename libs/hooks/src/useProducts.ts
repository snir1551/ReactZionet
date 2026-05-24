import { useQuery } from '@tanstack/react-query';
import type { Product, ProductsResponse, Category } from './api-types';

// API functions
const BASE_URL = 'https://dummyjson.com';

const fetchApi = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchProducts = async (limit = 20, skip = 0): Promise<ProductsResponse> => {
  return fetchApi(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
};

export const searchProducts = async (query: string, limit = 20, skip = 0): Promise<ProductsResponse> => {
  return fetchApi(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
};

export const fetchProductsByCategory = async (category: string, limit = 20, skip = 0): Promise<ProductsResponse> => {
  return fetchApi(`${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`);
};

export const fetchProductById = async (id: number): Promise<Product> => {
  return fetchApi(`${BASE_URL}/products/${id}`);
};

export const fetchCategories = async (): Promise<Category[]> => {
  return fetchApi(`${BASE_URL}/products/categories`);
};

// TanStack Query Hooks
export function useProducts(limit = 20, skip = 0) {
  return useQuery({
    queryKey: ['products', limit, skip],
    queryFn: () => fetchProducts(limit, skip),
  });
}

export function useSearchProducts(query: string, limit = 20, skip = 0) {
  return useQuery({
    queryKey: ['products', 'search', query, limit, skip],
    queryFn: () => searchProducts(query, limit, skip),
    enabled: !!query,
  });
}

export function useProductsByCategory(category: string, limit = 20, skip = 0) {
  return useQuery({
    queryKey: ['products', 'category', category, limit, skip],
    queryFn: () => fetchProductsByCategory(category, limit, skip),
    enabled: !!category,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
}
