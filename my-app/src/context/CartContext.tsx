import type { ReactNode } from 'react';
import { useLocalStorage } from '@workspace/hooks';
import { useToastStore } from '../stores/toastStore';
import { CartContext } from './cart';
import type { CartContextType, CartItem } from './cart';

// Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart-items', []);
  const [isOpen, setIsOpen] = useLocalStorage<boolean>('sidebar-open', false);
  const { addToast } = useToastStore();

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems: CartItem[]) => {
      const existingItem = prevItems.find((item: CartItem) => item.id === newItem.id);
      
      if (existingItem) {
        // Item exists, increase quantity
        addToast({
          type: 'success',
          message: `Added another ${newItem.title} to cart`,
        });
        return prevItems.map((item: CartItem) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New item, add with quantity 1
        addToast({
          type: 'success',
          message: `${newItem.title} added to cart!`,
        });
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  const removeItem = (id: number) => {
    const item = items.find((item: CartItem) => item.id === id);
    if (item) {
      addToast({
        type: 'info',
        message: `${item.title} removed from cart`,
      });
    }
    setItems((prevItems: CartItem[]) => prevItems.filter((item: CartItem) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prevItems: CartItem[]) =>
      prevItems.map((item: CartItem) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    if (items.length > 0) {
      addToast({
        type: 'warning',
        message: 'Cart cleared',
      });
    }
    setItems([]);
  };

  const toggleSidebar = () => {
    setIsOpen((prev: boolean) => !prev);
  };

  const openSidebar = () => {
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Computed values
  const totalItems = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const value: CartContextType = {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
