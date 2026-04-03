import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import type {
  UserProfile,
  Order,
  OrderStatus,
  PaymentStatus,
  Review,
  Product,
  ShippingAddress,
  OrderItem,
  PaymentMethod,
} from "@/types";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// USER SERVICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const userService = {
  async getProfile(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as unknown as UserProfile) : null;
  },

  async updateProfile(uid: string, data: Partial<UserProfile>) {
    await updateDoc(doc(db, "users", uid), { ...data });
  },

  async getAllUsers(): Promise<UserProfile[]> {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), uid: d.id } as unknown as UserProfile));
  },

  async setUserRole(uid: string, role: "user" | "admin") {
    await updateDoc(doc(db, "users", uid), { role });
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ORDER SERVICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const orderService = {
  async createOrder(data: {
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
    upiTransactionId?: string;
  }): Promise<string> {
    const docRef = await addDoc(collection(db, "orders"), {
      ...data,
      orderStatus: "Processing" as OrderStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const snap = await getDoc(doc(db, "orders", orderId));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as unknown as Order) : null;
  },

  async getUserOrders(uid: string): Promise<Order[]> {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Order));
  },

  async getAllOrders(): Promise<Order[]> {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Order));
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    await updateDoc(doc(db, "orders", orderId), {
      orderStatus: status,
      updatedAt: serverTimestamp(),
    });
  },

  async updatePaymentStatus(orderId: string, status: PaymentStatus) {
    await updateDoc(doc(db, "orders", orderId), {
      paymentStatus: status,
      updatedAt: serverTimestamp(),
    });
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Order));
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REVIEW SERVICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const reviewService = {
  async addReview(data: {
    userId: string;
    userName: string;
    userPhoto?: string;
    productId: string;
    rating: number;
    comment: string;
    images?: string[];
  }): Promise<string> {
    const docRef = await addDoc(collection(db, "reviews"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async isVerifiedBuyer(userId: string, productId: string): Promise<boolean> {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      where("paymentStatus", "==", "Paid")
    );
    const snap = await getDocs(q);
    const orders = snap.docs.map(doc => doc.data() as Order);
    
    return orders.some(order => 
      Array.isArray(order.items) && order.items.some(item => item.productId === productId)
    );
  },

  async getProductReviews(productId: string): Promise<Review[]> {
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", productId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Review));
  },

  async getUserReviews(userId: string): Promise<Review[]> {
    const q = query(
      collection(db, "reviews"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Review));
  },

  async updateReview(reviewId: string, data: { rating: number; comment: string }) {
    await updateDoc(doc(db, "reviews", reviewId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteReview(reviewId: string) {
    await deleteDoc(doc(db, "reviews", reviewId));
  },

  async getAverageRating(productId: string): Promise<{ avg: number; count: number }> {
    const reviews = await this.getProductReviews(productId);
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return { avg: sum / reviews.length, count: reviews.length };
  },

  async getRecentHighReviews(limitCount: number = 5): Promise<Review[]> {
    const q = query(
      collection(db, "reviews"),
      where("rating", "==", 5),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Review));
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WISHLIST SERVICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const wishlistService = {
  async addToWishlist(userId: string, productId: string) {
    await setDoc(doc(db, "users", userId, "wishlist", productId), {
      productId,
      addedAt: serverTimestamp(),
    });
  },

  async removeFromWishlist(userId: string, productId: string) {
    await deleteDoc(doc(db, "users", userId, "wishlist", productId));
  },

  async getWishlist(userId: string): Promise<string[]> {
    const snap = await getDocs(collection(db, "users", userId, "wishlist"));
    return snap.docs.map((d) => d.data().productId as string);
  },

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const snap = await getDoc(doc(db, "users", userId, "wishlist", productId));
    return snap.exists();
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRODUCT SERVICE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const productService = {
  async getAllProducts(): Promise<Product[]> {
    const q = query(collection(db, "products"), orderBy("category"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Product));
  },

  async addProduct(data: Omit<Product, "id">) {
    await addDoc(collection(db, "products"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  },

  async updateProduct(id: string, data: Partial<Product>) {
    await updateDoc(doc(db, "products", id), { ...data });
  },

  async deleteProduct(id: string) {
    await deleteDoc(doc(db, "products", id));
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN ANALYTICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const analyticsService = {
  async getDashboardStats() {
    const [ordersSnap, usersSnap] = await Promise.all([
      getDocs(collection(db, "orders")),
      getDocs(collection(db, "users")),
    ]);

    const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Order));
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "Paid")
      .reduce((sum, o) => sum + (o.total || 0), 0);

    // Revenue by day (last 7 days)
    const revenueByDay: Record<string, number> = {};
    const ordersByDay: Record<string, number> = {};
    const productSales: Record<string, { name: string; sold: number; revenue: number }> = {};

    let codOrders = 0;
    let stripeOrders = 0;

    orders.forEach((order) => {
      const date = order.createdAt?.toDate
        ? order.createdAt.toDate().toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      revenueByDay[date] = (revenueByDay[date] || 0) + (order.total || 0);
      ordersByDay[date] = (ordersByDay[date] || 0) + 1;

      if (order.paymentMethod === "cod") codOrders++;
      else stripeOrders++;

      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = { name: item.name, sold: 0, revenue: 0 };
          }
          productSales[item.productId].sold += item.quantity;
          productSales[item.productId].revenue += item.price * item.quantity;
        });
      }
    });

    const sortedDays = Object.keys(revenueByDay).sort().slice(-7);

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalUsers: usersSnap.size,
      totalProducts: 0, // set manually or fetch
      revenueByDay: sortedDays.map((d) => ({ date: d, revenue: revenueByDay[d] })),
      ordersByDay: sortedDays.map((d) => ({ date: d, orders: ordersByDay[d] || 0 })),
      topProducts: Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
      codOrders,
      stripeOrders,
    };
  },
};
