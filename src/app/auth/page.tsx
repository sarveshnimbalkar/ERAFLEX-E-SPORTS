"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Mail, Lock, User, ArrowRight, Github, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { TermsModal } from "@/components/auth/TermsModal";

const getErrorMessage = (err: any) => {
  if (err.code === "auth/email-already-in-use") return "This email is already registered. Please sign in instead.";
  if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") return "Invalid email or password.";
  if (err.code === "auth/weak-password") return "Password should be at least 6 characters.";
  if (err.code === "auth/invalid-email") return "Please enter a valid email address.";
  if (err.code === "auth/popup-closed-by-user") return "Sign in popup was closed.";
  
  if (err.message) {
    return err.message.replace(/Firebase:\s*/i, "").replace(/\s*\([^)]+\)\.?/, "");
  }
  return "An error occurred during authentication.";
};

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const router = useRouter();

  const handleAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // For registration, we always show terms first
    if (mode === "register" && !showTerms) {
      setShowTerms(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        // Create user doc in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          name,
          email,
          createdAt: serverTimestamp(),
          role: "user",
          termsAccepted: true,
          acceptedTimestamp: serverTimestamp()
        });

        // Send welcome email (fire-and-forget — never blocks signup)
        try {
          fetch("/api/send-welcome-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userName: name, userEmail: email }),
          }).catch((err) => console.error("Welcome email request failed:", err));
        } catch (emailErr) {
          console.error("Welcome email error:", emailErr);
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Check if user doc exists, and create it if missing (handles partial registrations or manually created auth users)
        const userDocRef = doc(db, "users", userCredential.user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            uid: userCredential.user.uid,
            name: userCredential.user.displayName || email.split('@')[0],
            email: userCredential.user.email || email,
            createdAt: serverTimestamp(),
            role: "user",
            termsAccepted: true,
            acceptedTimestamp: serverTimestamp()
          });
        }
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // Check if this is a first-time Google user
      const userDocRef = doc(db, "users", result.user.uid);
      const existingDoc = await getDoc(userDocRef);
      const isNewUser = !existingDoc.exists();

      await setDoc(userDocRef, {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        createdAt: serverTimestamp(),
        role: "user",
        termsAccepted: true,
        acceptedTimestamp: serverTimestamp()
      }, { merge: true });

      // Send welcome email only for first-time Google signups
      if (isNewUser) {
        try {
          fetch("/api/send-welcome-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userName: result.user.displayName || "Champion",
              userEmail: result.user.email,
            }),
          }).catch((err) => console.error("Welcome email request failed:", err));
        } catch (emailErr) {
          console.error("Welcome email error:", emailErr);
        }
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-brand-dark flex flex-col items-center">
      <Header />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-brand-surface p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden glass">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-accent/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl" />

          <div className="flex gap-8 mb-10 relative z-20">
            <button 
              type="button"
              onClick={() => setMode("login")}
              className={cn(
                "relative font-display text-4xl italic tracking-tighter transition-all duration-300",
                mode === "login" ? "text-white" : "text-white/30 hover:text-white"
              )}
            >
              LOGIN
              {mode === "login" && (
                <motion.div 
                  layoutId="auth-tab" 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-brand-accent rounded-full"
                />
              )}
            </button>
            <button 
              type="button"
              onClick={() => setMode("register")}
              className={cn(
                "relative font-display text-4xl italic tracking-tighter transition-all duration-300",
                mode === "register" ? "text-white" : "text-white/30 hover:text-white"
              )}
            >
              REGISTER
              {mode === "register" && (
                <motion.div 
                  layoutId="auth-tab" 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-brand-accent rounded-full"
                />
              )}
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6 relative z-10">
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase mb-2 block">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
                    <input 
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 p-4 pl-12 rounded-xl focus:border-brand-accent outline-none transition-all duration-300"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase mb-2 block">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
                <input 
                  type="email"
                  required
                  placeholder="alex@eraflex.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 p-4 pl-12 rounded-xl focus:border-brand-accent outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-indian tracking-widest text-gray-500 uppercase mb-2 block">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-accent transition-colors" />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 p-4 pl-12 rounded-xl focus:border-brand-accent outline-none transition-all duration-300"
                />
              </div>
            </div>

            {error && (
              <p className="text-brand-accent text-xs font-indian tracking-wide text-center uppercase">
                {error}
              </p>
            )}

            <button 
              disabled={loading}
              className="w-full bg-brand-accent py-5 font-black text-xl hover:bg-white hover:text-black transition-all duration-500 group hover-trigger flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
              {!loading && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />}
            </button>
          </form>

          <div className="mt-8 relative z-10 text-center">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-white/5 flex-1" />
              <span className="text-[10px] font-indian tracking-[0.3em] text-gray-600 uppercase">Or continue with</span>
              <div className="h-px bg-white/5 flex-1" />
            </div>

            <div className="flex justify-center gap-4">
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-4 rounded-xl border border-white/10 flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all duration-500 hover-trigger"
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.658 29.358 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.087 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z" />
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.087 6.053 29.268 4 24 4c-7.682 0-14.374 4.337-17.694 10.691z" />
                  <path fill="#4CAF50" d="M24 44c5.172 0 9.918-1.979 13.49-5.207l-6.223-5.246C29.193 35.091 26.715 36 24 36c-5.337 0-9.618-3.322-11.287-7.946l-6.522 5.03C9.474 39.556 16.227 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.341 3.796-4.079 6.711-7.025 8.547l.002-.001 6.223 5.246C33.656 41.196 40 36 40 24c0-1.341-.138-2.651-.389-3.917z" />
                </svg>
                <span className="font-bold text-sm tracking-widest">GOOGLE</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <TermsModal 
        isOpen={showTerms}
        onAccept={() => {
          setShowTerms(false);
          handleAuth();
        }}
        onClose={() => setShowTerms(false)}
      />

      <Footer />
    </main>
  );
}
