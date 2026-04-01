import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/emailService";

export async function POST(req: NextRequest) {
  try {
    const { userName, userEmail } = await req.json();

    if (!userName || !userEmail) {
      return NextResponse.json(
        { error: "Missing userName or userEmail" },
        { status: 400 }
      );
    }

    const result = await sendWelcomeEmail(userName, userEmail);

    if (result.success) {
      return NextResponse.json({ message: "Welcome email sent successfully" });
    } else {
      // Log but return 200-level so the client knows signup is fine
      console.error("Email sending failed:", result.error);
      return NextResponse.json(
        { message: "Signup successful, but email could not be sent", error: result.error },
        { status: 207 }
      );
    }
  } catch (error: any) {
    console.error("Welcome email API error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
