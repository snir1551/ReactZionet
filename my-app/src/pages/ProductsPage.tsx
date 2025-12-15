import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchProducts, searchProducts, fetchProductsByCategory, fetchCategories } from '../api/products';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

function ProductsPage() {
  // State for pagination and filters
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const productsPerPage = 20;
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Dynamic query function based on filters
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
  
  // Using TanStack Query with filter-aware query keys
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['products', page, searchQuery, selectedCategory],
    queryFn: getQueryFn(),
    placeholderData: (previousData) => previousData, // Keep previous data while loading new data
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
  });

  // Show loading state only for initial load
  if (isLoading && !data) {
    return (
      <div className="products-container">
        <h1>Product Catalog</h1>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="products-container">
        <h1>Product Catalog</h1>
        <div className="error">
          <h2>Something went wrong!</h2>
          <p>Error: {error.message}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show products data
  return (
    <div className="products-container">
      <h1>Product Catalog</h1>
      
      {/* Filter Controls */}
      <form 
        onSubmit={(e) => e.preventDefault()}
        className="filters-container"
      >
        <div className="filter-group">
          <label htmlFor="search">Search Products:</label>
          <input
            id="search"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              console.log('Search input changed:', e.target.value);
              setSearchQuery(e.target.value);
              setPage(1); // Reset page when search changes
            }}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="category">Filter by Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1); // Reset page when category changes
            }}
            className="category-select"
          >
            <option value="">All Categories</option>
            {Array.isArray(categories) && categories?.map((category, index) => (
              <option key={category.slug || index} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Clear Filters */}
        {(searchQuery || selectedCategory) && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
            }}
            className="clear-filters-button"
          >
            Clear Filters
          </button>
        )}
      </form>
      
      <p className="products-count">
        Showing {data?.products.length || 0} of {data?.total || 0} products
        {searchQuery && <span> for "{searchQuery}"</span>}
        {selectedCategory && <span> in "{selectedCategory}"</span>}
      </p>
      
      <div className="products-grid-container">
        {isFetching && data && (
          <div className="products-loading-overlay">
            <div className="loading-spinner"></div>
            <span>Updating products...</span>
          </div>
        )}
        
        <div className="products-grid">
          {data?.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      {/* Pagination */}
      {data && (
        <div className="pagination-container">
          <button 
            className="pagination-button"
            onClick={() => setPage(prev => prev - 1)}
            disabled={page === 1 || isLoading}
          >
            Previous
          </button>
          
          <div className="pagination-info">
            <span className="page-info">Page {page}</span>
            <span className="products-info">
              Showing {(page - 1) * productsPerPage + 1}-{Math.min(page * productsPerPage, data.total)} of {data.total} products
            </span>
          </div>
          
          <button 
            className="pagination-button"
            onClick={() => setPage(prev => prev + 1)}
            disabled={page * productsPerPage >= data.total || isLoading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;