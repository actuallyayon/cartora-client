export interface CartItem {
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
    price: number;
    currency: string;
    stock: number;
  };
  quantity: number;
  selectedVariant?: { name: string; value: string };
  lineTotal: number;
}

export interface Cart {
  id: string | null;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  currency: string;
}
