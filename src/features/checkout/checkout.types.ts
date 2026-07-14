export interface ShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface CheckoutPayload {
  shippingAddress: ShippingAddress;
  couponCode?: string;
}

export interface CheckoutResult {
  clientSecret: string;
  orderNumber: string;
  total: number;
}

export interface ValidateCouponPayload {
  code: string;
  subtotal: number;
}

export interface ValidateCouponResult {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discount: number;
}

export interface OrderItem {
  id: string;
  name: string;
  thumbnail: string;
  sku: string;
  selectedVariant?: { name: string; value: string };
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  itemsCount: number;
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  appliedCoupon?: { code: string; discount: number };
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  placedAt: string;
  createdAt: string;
}
