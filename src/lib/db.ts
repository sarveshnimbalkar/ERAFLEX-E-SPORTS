import { db } from "./firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit
} from "firebase/firestore";

// User Database Service
export const dbService = {
  // User Profiles
  async getUserProfile(uid: string) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  async updateUserProfile(uid: string, data: any) {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, data);
  },

  // Products
  async getAllProducts() {
    const q = query(collection(db, "products"), orderBy("category"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Orders
  async getUserOrders(uid: string) {
    const q = query(
      collection(db, "orders"), 
      where("userId", "==", uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
