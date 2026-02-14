import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartState, CartItem } from '../types/cart';
import { saveCart, loadCart, clearCart as clearStoredCart } from '../lib/cartStorage';

interface CartContextValue {
  cart: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: bigint) => void;
  updateQuantity: (productId: bigint, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => bigint;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({ items: [] });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loaded = loadCart();
    setCart(loaded);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      saveCart(cart);
    }
  }, [cart, isInitialized]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existingIndex = prev.items.findIndex((i) => i.productId === item.productId);
      
      if (existingIndex >= 0) {
        const newItems = [...prev.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
        };
        return { items: newItems };
      }
      
      return { items: [...prev.items, { ...item, quantity: 1 }] };
    });
  };

  const removeItem = (productId: bigint) => {
    setCart((prev) => ({
      items: prev.items.filter((item) => item.productId !== productId),
    }));
  };

  const updateQuantity = (productId: bigint, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setCart((prev) => ({
      items: prev.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }));
  };

  const clearCart = () => {
    setCart({ items: [] });
    clearStoredCart();
  };

  const getTotalItems = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cart.items.reduce((sum, item) => sum + item.price * BigInt(item.quantity), BigInt(0));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
