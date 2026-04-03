import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/emailService";
import { getClientIp, rateLimit } from "@/lib/server/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const limiter = rateLimit(`welcome-email:${clientIp}`, 6, 60_000);
    if (!limiter.allowed) {
      return NextResponse.json(
        { error: "Too many email attempts. Please retry shortly." },
        {
          status: 429,
          headers: { "Retry-After": `${limiter.retryAfterSec}` },
        }
      );
    }

    const { userName, userEmail } = await req.json();

    if (!userName || !userEmail) {
      return NextResponse.json(
        { error: "Missing userName or userEmail" },
        { status: 400 }
      );
    }

    const normalizedName = String(userName).trim();
    const normalizedEmail = String(userEmail).trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (normalizedName.length < 2 || normalizedName.length > 80) {
      return NextResponse.json({ error: "Invalid userName" }, { status: 400 });
    }

    if (!emailPattern.test(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid userEmail" }, { status: 400 });
    }

    const result = await sendWelcomeEmail(normalizedName, normalizedEmail);

    if (result.success) {
      return NextResponse.json({ message: "Welcome email sent successfully" });
    } else {
      console.error("Email sending failed:", result.error);
      return NextResponse.json(
        { message: "Signup successful, but email could not be sent", error: result.error },
        { status: result.error?.includes("Email is not configured") ? 503 : 500 }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Welcome email API error:", message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
