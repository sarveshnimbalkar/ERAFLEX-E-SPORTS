import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getClientIp, rateLimit } from "@/lib/server/rateLimit";
import { serverEnv } from "@/lib/server/env";

const stripe = new Stripe(serverEnv.stripeSecretKey);

const MIN_ORDER_AMOUNT = 50;
const MAX_ORDER_AMOUNT = 200000;

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const limiter = rateLimit(`payment-intent:${clientIp}`, 15, 60_000);
    if (!limiter.allowed) {
      return NextResponse.json(
        { error: "Too many payment requests. Please retry shortly." },
        {
          status: 429,
          headers: { "Retry-After": `${limiter.retryAfterSec}` },
        }
      );
    }

    const { amount, currency = "inr" } = await req.json();
    const normalizedAmount = Number(amount);

    if (!Number.isFinite(normalizedAmount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (normalizedAmount < MIN_ORDER_AMOUNT || normalizedAmount > MAX_ORDER_AMOUNT) {
      return NextResponse.json(
        { error: `Amount must be between ${MIN_ORDER_AMOUNT} and ${MAX_ORDER_AMOUNT}` },
        { status: 400 }
      );
    }

    const normalizedCurrency = String(currency).toLowerCase();
    if (normalizedCurrency !== "inr") {
      return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
    }

    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(normalizedAmount * 100), // Stripe expects amount in subunits (e.g., paise for INR)
      currency: normalizedCurrency,
      payment_method_types: ["card", "upi"],
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Payment intent creation failed";
    console.error("Stripe Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
