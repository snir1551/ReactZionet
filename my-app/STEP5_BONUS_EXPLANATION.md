# Step 5 Bonus Features Implementation

## Implemented Features

### 1. Query Keys with Filters ✅

**What I implemented:**
- Search input for finding products by name
- Category dropdown filter for filtering by category  
- Dynamic query keys that include filter values
- Automatic page reset when filters change

**Key TanStack Query Concepts Demonstrated:**

```typescript
// Query key includes all filter values
const { data, isLoading, error } = useQuery({
  queryKey: ['products', page, searchQuery, selectedCategory],
  queryFn: getQueryFn()
});
```

**Cache Behavior Observations:**
- **Different Filters = Different Cache**: Each unique combination of `[page, searchQuery, selectedCategory]` creates a separate cache entry
- **Filter Change = New Query**: When you change from "All Categories" to "Electronics", it triggers a new API call
- **Back to Previous Filter = Cached Data**: If you switch back to a previous filter combination, data loads instantly from cache
- **Search + Category = Unique Cache**: Searching "phone" in "Electronics" has different cache than "phone" in "All Categories"

### 2. Global Fetching Indicator ✅

**What I implemented:**
- Fixed banner at top of screen showing "Loading..." during any API call
- Uses `useIsFetching()` hook to detect ANY active queries
- Appears for all queries: product lists, categories, product details, search results

**Key TanStack Query Concepts Demonstrated:**

```typescript
// Detects ANY query that's currently fetching
const isFetching = useIsFetching();
```

**Observable Behaviors:**
- **Page Load**: Banner appears when loading product list
- **Filter Changes**: Banner shows during search/category filtering  
- **Navigation**: Banner appears when clicking to product detail page
- **Pagination**: Banner shows when clicking Previous/Next
- **Multiple Queries**: If categories and products load simultaneously, banner stays until both complete

## How to Test Cache Behavior

1. **Load products** → Notice initial loading banner
2. **Search for "phone"** → New query, banner appears, new cache entry
3. **Select "Electronics" category** → Another new query and cache
4. **Clear filters** → Returns to original query, may use cache if still fresh
5. **Search "phone" again** → Instant load from cache!
6. **Navigate to product detail** → Banner appears for detail query
7. **Go back to products** → Previous search results may load from cache

## Technical Implementation Details

### Query Key Strategy
```typescript
// Before: Simple key
queryKey: ['products', page]

// After: Filter-aware key  
queryKey: ['products', page, searchQuery, selectedCategory]
```

### Dynamic Query Functions
```typescript
const getQueryFn = () => {
  const skip = (page - 1) * productsPerPage;
  
  if (searchQuery.trim()) {
    return () => searchProducts(searchQuery.trim(), productsPerPage, skip);
  }
  if (selectedCategory) {
    return () => fetchProductsByCategory(selectedCategory, productsPerPage, skip);
  }
  return () => fetchProducts(productsPerPage, skip);
};
```

### Global State Detection
```typescript
// Monitors ALL queries across the entire app
const isFetching = useIsFetching();
```

## Learning Outcomes

1. **Query Keys are Powerful**: They control caching, invalidation, and refetching behavior
2. **Granular Caching**: Each unique key combination gets its own cache slot
3. **Global State Management**: TanStack Query provides hooks to monitor overall loading state
4. **User Experience**: Proper caching dramatically improves perceived performance
5. **Filter UX**: Resetting page when filters change prevents confusing empty results

## Performance Benefits

- **Instant Filter Switching**: Previously searched terms load immediately
- **Reduced API Calls**: Cache prevents unnecessary refetching
- **Better UX**: Global loading indicator provides clear feedback
- **Smart Invalidation**: Only relevant data gets refetched when filters change