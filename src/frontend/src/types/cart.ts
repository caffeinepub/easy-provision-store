export interface CartItem {
  productId: bigint;
  name: string;
  price: bigint;
  quantity: number;
  category: string;
}

export interface CartState {
  items: CartItem[];
}
