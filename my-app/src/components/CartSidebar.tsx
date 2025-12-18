import { useCart } from '../hooks/useCart';

export function CartSidebar() {
  const { items, isOpen, closeSidebar, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-backdrop" onClick={closeSidebar} />
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Shopping Cart ({totalItems})</h2>
          <button className="cart-close-btn" onClick={closeSidebar}>
            x
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p className="cart-empty">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                {item.thumbnail && (
                  <img src={item.thumbnail} alt={item.title} className="cart-item-image" />
                )}
                <div className="cart-item-info">
                  <h4>{item.title}</h4>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  <div className="cart-item-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <strong>Total:</strong>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>
            <button className="checkout-btn">Checkout</button>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
