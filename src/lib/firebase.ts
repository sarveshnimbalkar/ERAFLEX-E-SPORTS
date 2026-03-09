import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCjwSro0y3VLc5L8p-0E9XFGOs9UcntSo",
  authDomain: "eraflex-1f6d3.firebaseapp.com",
  projectId: "eraflex-1f6d3",
  storageBucket: "eraflex-1f6d3.firebasestorage.app",
  messagingSenderId: "245361961645",
  appId: "1:245361961645:web:1cb9c48b510cfb4b237424"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
