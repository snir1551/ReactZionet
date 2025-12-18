import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../api/products';
import './ProductDetailPage.css';

function ProductDetailPage() {
  // Get the id from URL parameters
  const { id } = useParams<{ id: string }>();
  
  // Convert string id to number
  const productId = id ? parseInt(id, 10) : null;
  
  // Dependent query - only runs when productId exists and is valid
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId!),
    enabled: !!productId && !isNaN(productId) // Only run if productId is valid
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="product-detail-container">
        <Link to="/products" className="back-link">← Back to Products</Link>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="product-detail-container">
        <Link to="/products" className="back-link">← Back to Products</Link>
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

  // Show invalid ID error
  if (!productId || isNaN(productId)) {
    return (
      <div className="product-detail-container">
        <Link to="/products" className="back-link">← Back to Products</Link>
        <div className="error">
          <h2>Invalid Product ID</h2>
          <p>Please provide a valid product ID.</p>
        </div>
      </div>
    );
  }

  // Show product details
  return (
    <div className="product-detail-container">
      <Link to="/products" className="back-link">← Back to Products</Link>
      
      {product && (
        <div className="product-detail">
          {product.thumbnail && (
            <div className="product-image-container">
              <img 
                src={product.thumbnail} 
                alt={product.title}
                className="product-detail-image"
              />
            </div>
          )}
          
          <div className="product-detail-info">
            <h1 className="product-detail-title">{product.title}</h1>
            <p className="product-detail-price">${product.price}</p>
            <p className="product-detail-category">Category: {product.category}</p>
            <div className="product-detail-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;