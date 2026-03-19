"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

interface StripePaymentFormProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
}

export default function StripePaymentForm({ amount, onSuccess }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "An unknown error occurred.");
      toast.error(error.message || "Payment failed");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="text-brand-accent text-xs font-indian tracking-widest text-center uppercase">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-brand-accent py-5 font-black text-2xl tracking-widest hover:bg-black hover:text-white transition-all duration-300 rounded-md flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            SECURELY PROCESSING...
          </div>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            PAY ₹{amount.toLocaleString()} & PLACE ORDER
          </>
        )}
      </button>
    </form>
  );
}
