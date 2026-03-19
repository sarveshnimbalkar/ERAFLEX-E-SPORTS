"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Edit3, Trash2, Send, Shield, X } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { reviewService } from "@/lib/db";
import { useUserStore } from "@/store/useUserStore";
import type { Review } from "@/types";
import toast from "react-hot-toast";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { CheckCircle2, ChevronDown, Camera, Image as ImageIcon } from "lucide-react";

interface ReviewSectionProps {
  productId: string;
}

export const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const { user } = useUserStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");
  const [isVerified, setIsVerified] = useState(false);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return b.createdAt?.seconds - a.createdAt?.seconds;
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  useEffect(() => {
    loadReviews();
    if (user) {
      checkVerification();
    }
  }, [productId, user]);

  const checkVerification = async () => {
    if (!user) return;
    const verified = await reviewService.isVerifiedBuyer(user.uid, productId);
    setIsVerified(verified);
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getProductReviews(productId);
      setReviews(data);
    } catch (err) {
      console.warn("Could not load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to write a review");
    if (rating === 0) return toast.error("Please select a rating");
    if (!comment.trim()) return toast.error("Please write a comment");

    setSubmitting(true);
    try {
      const imageUrls: string[] = [];
      const uploadPromises = selectedImages.map(async (file) => {
        const storageRef = ref(storage, `reviews/${productId}/${user.uid}_${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return getDownloadURL(snapshot.ref);
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      imageUrls.push(...uploadedUrls);

      const reviewPayload: any = {
        userId: user.uid,
        userName: user.displayName || user.email || "Anonymous",
        productId,
        rating,
        comment: comment.trim(),
        images: imageUrls,
      };
      if (user.photoURL) reviewPayload.userPhoto = user.photoURL;

      await reviewService.addReview(reviewPayload);
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      setSelectedImages([]);
      await loadReviews();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (reviewId: string) => {
    if (editRating === 0 || !editComment.trim()) return;
    try {
      await reviewService.updateReview(reviewId, {
        rating: editRating,
        comment: editComment.trim(),
      });
      toast.success("Review updated!");
      setEditingId(null);
      await loadReviews();
    } catch {
      toast.error("Failed to update review");
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await reviewService.deleteReview(reviewId);
      toast.success("Review deleted");
      await loadReviews();
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <MessageSquare className="w-6 h-6 text-brand-accent" />
          <h3 className="font-display text-3xl italic uppercase tracking-tighter">
            CUSTOMER <span className="text-brand-accent">REVIEWS</span>
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg text-xs font-indian tracking-widest outline-none focus:border-brand-accent transition-all appearance-none pr-8 cursor-pointer"
            >
              <option value="newest">NEWEST FIRST</option>
              <option value="highest">HIGHEST RATING</option>
              <option value="lowest">LOWEST RATING</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <StarRating rating={Math.round(avgRating)} readonly size="md" />
          <span className="font-display text-2xl text-brand-gold">
            {avgRating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500 font-indian tracking-widest">
            ({reviews.length} reviews)
          </span>
        </div>
      </div>



      {/* Review Form */}
      {user && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-brand-surface p-8 rounded-3xl border border-white/5"
        >
          <p className="text-[10px] font-indian tracking-widest text-gray-500 uppercase mb-4">
            Write a review
          </p>
          <div className="mb-4">
            <StarRating rating={rating} onChange={setRating} size="lg" />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={3}
            className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-brand-accent transition-all duration-300 font-indian tracking-wide text-sm resize-none mb-4"
          />

          {/* Image Upload Area */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {selectedImages.map((file, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                  <button 
                    type="button"
                    onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute inset-0 bg-brand-accent/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
              {selectedImages.length < 3 && (
                <label className="w-20 h-20 rounded-xl border border-white/10 border-dashed flex flex-col items-center justify-center gap-1 hover:border-brand-accent transition-colors cursor-pointer bg-black/20 group">
                  <Camera className="w-5 h-5 text-gray-500 group-hover:text-brand-accent transition-colors" />
                  <span className="text-[8px] font-indian text-gray-600 uppercase">Add Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    hidden 
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files);
                        setSelectedImages(prev => [...prev, ...files].slice(0, 3));
                      }
                    }}
                  />
                </label>
              )}
            </div>
            <p className="text-[9px] text-gray-600 font-indian tracking-widest uppercase">Max 3 photos • JPEG/PNG</p>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-brand-accent px-8 py-3 font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
            </button>
          </div>
        </motion.form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="font-display text-xl italic uppercase tracking-widest opacity-30">
              No reviews yet
            </p>
            <p className="text-gray-600 text-xs font-indian tracking-widest mt-2">
              Be the first to review this product
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {sortedReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-black/30 p-6 rounded-2xl border border-white/5 group hover:border-white/10 transition-all"
              >
                {editingId === review.id ? (
                  <div className="space-y-4">
                    <StarRating rating={editRating} onChange={setEditRating} size="md" />
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={2}
                      className="w-full bg-black/40 border border-white/10 p-3 rounded-xl outline-none focus:border-brand-accent text-sm font-indian resize-none"
                    />
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-white/10 rounded-lg hover:border-white/30 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(review.id)}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-brand-accent rounded-lg hover:bg-white hover:text-black transition-all"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center font-display text-sm italic font-bold">
                          {review.userName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-sm flex items-center gap-2">
                            {review.userName}
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-success" />
                          </p>
                          <p className="text-[10px] text-gray-500 font-indian tracking-widest">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} readonly size="sm" />
                        {user?.uid === review.userId && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingId(review.id);
                                setEditRating(review.rating);
                                setEditComment(review.comment);
                              }}
                              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="p-1.5 rounded-lg hover:bg-brand-accent/20 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-brand-accent" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm font-indian tracking-wide leading-relaxed mb-4">
                      {review.comment}
                    </p>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {review.images.map((img, idx) => (
                          <div key={idx} className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 hover:border-brand-accent transition-colors cursor-zoom-in">
                            <img src={img} className="w-full h-full object-cover" alt={`Review ${idx + 1}`} />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};
