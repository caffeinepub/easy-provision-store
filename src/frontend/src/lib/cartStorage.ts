import { CartState } from '../types/cart';

const CART_STORAGE_KEY = 'easy-provision-cart';

export function saveCart(cart: CartState): void {
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
}

export function loadCart(): CartState {
  try {
    const stored = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return { items: [] };
    
    const parsed = JSON.parse(stored);
    return {
      items: parsed.items.map((item: any) => ({
        ...item,
        productId: BigInt(item.productId),
        price: BigInt(item.price),
      })),
    };
  } catch (error) {
    console.error('Failed to load cart:', error);
    return { items: [] };
  }
}

export function clearCart(): void {
  try {
    sessionStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart:', error);
  }
}
