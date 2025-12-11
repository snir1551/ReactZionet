# SESSION 2 - TanStack React Query

## What is TanStack React Query?

TanStack React Query (formerly React Query) is a powerful data-fetching library for React applications that manages server state efficiently. It handles the complex aspects of data fetching, caching, synchronization, and updates.

### Key Benefits:
- 🚀 **Auto Caching**: Intelligent caching with automatic invalidation
- 🔄 **Background Updates**: Keeps data fresh with background refetching
- ⚡ **Optimistic Updates**: UI updates immediately for better UX
- 📡 **Real-time Sync**: Auto refetch on window focus, network reconnect
- 🎯 **Parallel & Dependent Queries**: Handle complex data dependencies
- 💾 **Offline Support**: Works seamlessly offline with cached data

---

## Core Concepts We Used

### 1. **QueryClient & QueryClientProvider**

**Setup in `main.tsx`:**
```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

**Purpose**: Provides React Query context to the entire app, manages global cache and configuration.

### 2. **useQuery Hook**

**Basic Usage:**
```tsx
const { data, isLoading, error, isFetching } = useQuery({
  queryKey: ['products'],
  queryFn: () => fetchProducts()
});
```

**What we used:**
- **queryKey**: Unique identifier for caching `['products', page, searchQuery, category]`
- **queryFn**: Function that returns a Promise (our API calls)
- **placeholderData**: Keep previous data while loading new data
- **staleTime**: How long data stays fresh (5 minutes in our case)
- **enabled**: Conditional query execution (dependent queries)

### 3. **Query Keys - Caching Strategy**

**Our Implementation:**
```tsx
queryKey: ['products', page, searchQuery, selectedCategory]
```

**How it works:**
- Each unique key combination = separate cache entry
- `['products', 1, '', '']` ≠ `['products', 1, 'phone', '']`
- Changing any part of the key triggers new fetch
- Going back to previous key = instant load from cache

**Cache Examples:**
- Page 1, no filters: `['products', 1, '', '']`
- Page 2, search "phone": `['products', 2, 'phone', '']`
- Page 1, electronics: `['products', 1, '', 'electronics']`

---

## API Integration (DummyJSON)

### **API Endpoints Used:**
- **Products List**: `GET /products?limit=20&skip=0`
- **Product Detail**: `GET /products/:id`
- **Search Products**: `GET /products/search?q=query`
- **Products by Category**: `GET /products/category/electronics`
- **Categories**: `GET /products/categories`

### **API Functions (`src/api/products.ts`):**
```typescript
// Get all products with pagination
export const fetchProducts = async (limit = 20, skip = 0): Promise<ProductsResponse> => {
  return fetchApi(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
};

// Get single product by ID
export const fetchProductById = async (id: number): Promise<Product> => {
  return fetchApi(`${BASE_URL}/products/${id}`);
};

// Search products by query
export const searchProducts = async (query: string, limit = 20, skip = 0): Promise<ProductsResponse> => {
  return fetchApi(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
};
```

---

## Key Features Implemented

### 1. **Products List Page (`ProductsPage.tsx`)**

**Features:**
- ✅ Product grid with images, titles, prices
- ✅ Search functionality with real-time filtering
- ✅ Category dropdown filter
- ✅ Pagination (Previous/Next buttons)
- ✅ Loading states and error handling
- ✅ Cache-aware filtering

**Query Implementation:**
```tsx
const { data, isLoading, error, isFetching } = useQuery({
  queryKey: ['products', page, searchQuery, selectedCategory],
  queryFn: getQueryFn(),
  placeholderData: (previousData) => previousData,
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

### 2. **Product Detail Page (`ProductDetailPage.tsx`)**

**Features:**
- ✅ Dependent query (only runs when ID exists)
- ✅ URL parameter reading with `useParams`
- ✅ Product detail display with image
- ✅ Navigation back to products list
- ✅ Error handling for invalid IDs

**Dependent Query:**
```tsx
const { data: product, isLoading, error } = useQuery({
  queryKey: ['product', productId],
  queryFn: () => fetchProductById(productId!),
  enabled: !!productId && !isNaN(productId) // Only run if valid ID
});
```

### 3. **Global Fetching Indicator (`GlobalFetchingIndicator.tsx`)**

**Purpose**: Shows loading banner during ANY query across the app

**Implementation:**
```tsx
function GlobalFetchingIndicator() {
  const isFetching = useIsFetching(); // Monitors ALL queries
  
  if (!isFetching) return null;
  
  return (
    <div className="global-fetching-indicator">
      <div className="fetching-spinner"></div>
      <span>Loading...</span>
    </div>
  );
}
```

**Usage**: Placed in `App.tsx` at the root level

---

## React Query Hooks Used

### 1. **`useQuery`**
- **Purpose**: Fetch and cache data
- **When to use**: GET requests, data fetching
- **Returns**: `{ data, isLoading, error, isFetching, isSuccess }`

### 2. **`useIsFetching`**
- **Purpose**: Global loading state detection
- **When to use**: Global loading indicators
- **Returns**: Number of currently running queries

---

## Loading States & UX Patterns

### **1. Initial Loading**
```tsx
if (isLoading && !data) {
  return <div className="loading">Loading products...</div>;
}
```

### **2. Background Loading (with previous data)**
```tsx
{isFetching && data && (
  <div className="products-loading-overlay">
    <span>Updating products...</span>
  </div>
)}
```

### **3. Error Handling**
```tsx
if (error) {
  return (
    <div className="error">
      <h2>Something went wrong!</h2>
      <p>Error: {error.message}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );
}
```

---

## Cache Behavior Observations

### **Filter Changes = New Cache Entries**
- Search "phone" → `['products', 1, 'phone', '']`
- Switch to electronics → `['products', 1, '', 'electronics']`
- Each combination gets separate cache

### **Instant Loading on Return**
- Go back to previous search → Loads instantly from cache
- No API call needed if data is still fresh (staleTime)

### **Background Refetching**
- Data becomes stale after 5 minutes
- React Query automatically refetches in background
- User sees cached data immediately, then fresh data loads

---

## TypeScript Integration

### **Type Definitions (`src/api/types.ts`):**
```typescript
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
```

### **Type-Safe Imports:**
```typescript
import type { Product, ProductsResponse } from './types';
```

---

## Performance Optimizations

### **1. Placeholder Data**
```tsx
placeholderData: (previousData) => previousData
```
- Shows previous results while loading new data
- Prevents blank states during searches

### **2. Stale Time Configuration**
```tsx
staleTime: 1000 * 60 * 5 // 5 minutes
```
- Data stays "fresh" for 5 minutes
- Reduces unnecessary API calls

### **3. Intelligent Query Keys**
- Granular caching with filter-aware keys
- Each filter combination cached separately
- Instant switching between cached states

---

## Key Learning Outcomes

### **1. Server State Management**
- Learned difference between client state and server state
- React Query handles server state complexity automatically

### **2. Caching Strategy**
- Understanding query keys as cache identifiers
- How changing keys affects data fetching and caching

### **3. Loading States**
- Multiple loading patterns: initial, background, global
- Better UX with placeholder data and loading indicators

### **4. Dependent Queries**
- Conditional query execution with `enabled` option
- URL parameter validation and handling

### **5. Global State Monitoring**
- Using `useIsFetching` for app-wide loading indicators
- Monitoring multiple queries simultaneously

---

## Best Practices Applied

✅ **No useEffect for data fetching** - Use `useQuery` instead  
✅ **Proper query key structure** - Include all dependencies  
✅ **Error boundaries** - Comprehensive error handling  
✅ **Loading states** - Multiple loading patterns for better UX  
✅ **Type safety** - Full TypeScript integration  
✅ **Performance** - Caching and background updates  
✅ **User experience** - Smooth transitions and feedback  

---

## Resources

- **Official Docs**: https://tanstack.com/query/latest
- **API Used**: https://dummyjson.com/
- **React Router**: https://reactrouter.com/
- **TypeScript**: https://www.typescriptlang.org/