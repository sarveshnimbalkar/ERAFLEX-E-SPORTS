// ─── Product ──────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  team: string;
  price: number;
  image: string;
  category: 'Football' | 'Cricket' | 'Basketball';
  brand?: string;
  rating?: number;
  stock?: number;
  description?: string;
}

// ─── Cart ─────────────────────────────────────────────
export interface CartItem extends Product {
  quantity: number;
}

// ─── User ─────────────────────────────────────────────
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role: 'user' | 'admin';
  createdAt: any; // Firestore Timestamp
}

// ─── Order ────────────────────────────────────────────
export type OrderStatus = 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'stripe' | 'cod';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';

export interface OrderItem {
  productId: string;
  name: string;
  team: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCharges: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  stripePaymentId?: string;
  orderStatus: OrderStatus;
  createdAt: any;
  updatedAt: any;
}

// ─── Review ───────────────────────────────────────────
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: any;
  updatedAt?: any;
}

// ─── Wishlist ─────────────────────────────────────────
export interface WishlistItem {
  productId: string;
  addedAt: any;
}

// ─── Admin Stats ──────────────────────────────────────
export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueByDay: { date: string; revenue: number }[];
  ordersByDay: { date: string; orders: number }[];
  topProducts: { name: string; sold: number; revenue: number }[];
  codOrders: number;
  stripeOrders: number;
}
