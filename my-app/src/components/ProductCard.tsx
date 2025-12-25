import { Link } from 'react-router-dom';
import type { Product } from '../api/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="product-link">
      <div className="product-card">
        {product.thumbnail && (
          <img 
            src={product.thumbnail} 
            alt={product.title}
            className="product-image"
          />
        )}
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-price">${product.price}</p>
          <p className="product-category">{product.category}</p>
          <p className="product-description">
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...`
              : product.description
            }
          </p>
          {onAddToCart && (
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};
