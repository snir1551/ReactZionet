import type { Product, ProductsResponse, Category } from './types';

const BASE_URL = 'https://dummyjson.com';

// Fetch function with error handling
const fetchApi = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Get all products with pagination
export const fetchProducts = async (limit = 20, skip = 0): Promise<ProductsResponse> => {
  return fetchApi(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
};

// Search products by query
export const searchProducts = async (query: string, limit = 20, skip = 0): Promise<ProductsResponse> => {
  return fetchApi(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
};

// Get products by category
export const fetchProductsByCategory = async (category: string, limit = 20, skip = 0): Promise<ProductsResponse> => {
  return fetchApi(`${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`);
};

// Get all categories
export const fetchCategories = async (): Promise<Category[]> => {
  return fetchApi(`${BASE_URL}/products/categories`);
};

// Get single product by ID
export const fetchProductById = async (id: number): Promise<Product> => {
  return fetchApi(`${BASE_URL}/products/${id}`);
};