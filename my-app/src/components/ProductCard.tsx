import { Link } from 'react-router-dom';
import type { Product } from '../api/types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
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
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
