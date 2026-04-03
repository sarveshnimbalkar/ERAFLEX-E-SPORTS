import { streamText, type ModelMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getClientIp, rateLimit } from '@/lib/server/rateLimit';
import { serverEnv } from '@/lib/server/env';

export const maxDuration = 30;

type IncomingMessage = {
  role?: string;
  content?: string;
  parts?: Array<{ text?: string }>;
};

function normalizeRole(role?: string): ModelMessage["role"] {
  if (role === "assistant" || role === "system" || role === "tool") {
    return role;
  }
  return "user";
}

const SYSTEM_PROMPT = `You are the ERAFLEX AI Assistant, the professional gear specialist for ERAFLEX E-SPORTS.
ERAFLEX is more than a brand; it's a movement in performance gear.

YOUR CORE KNOWLEDGE:
1. PRODUCTS:
   - Football Jerseys: Premium breathable mesh, elite fit. Popular: "Vortex FC", "Neon Strike".
   - Basketball Jerseys: Lightweight, sweat-wicking. Popular: "Apex Hoops", "Midnight Pro".
   - Cricket Gear: Classic white and modern colored jerseys.
2. FEATURES:
   - 3D Customizer (/customize): Real-time 2D-render based customizer. Add name, number, choose fonts.
   - AR Try-On (/try-on): Use "ERAFLEX LENS 2.0" to virtually wear jerseys using your camera.
3. SHIPPING & RETURNS:
   - Shipping: FREE on orders above ₹2,000. Flat ₹99 otherwise.
   - Delivery Time: 3-5 business days across India.
   - Returns: 7-day hassle-free returns for non-customized items.
4. BRAND VOICE: Elite, energetic, premium, helpful. Think "Elite Performance".

GUIDELINES:
- Keep it concise.
- Use India-specific context (₹, UPI, Cricket).
- If asked about customization, link to /customize.
- If asked "How do I look?", link to /try-on.
- Be proactive in suggesting gear based on the sport mentioned.`;

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const limiter = rateLimit(`chat:${clientIp}`, 30, 60_000);
    if (!limiter.allowed) {
      return new Response(JSON.stringify({ error: "Too many chat requests. Please retry shortly." }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": `${limiter.retryAfterSec}`,
        },
      });
    }

    if (!serverEnv.openAiApiKey) {
      return new Response(JSON.stringify({ error: "Chat service is not configured." }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid messages payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ensure backwards compatibility with streamText by mapping 'parts' to 'content'
    const coreMessages: ModelMessage[] = (messages as IncomingMessage[])
      .slice(-20)
      .map((m) => {
        const normalizedRole = normalizeRole(m.role);
        if (normalizedRole === "tool") {
          return {
            role: "assistant",
            content: m.content || "",
          };
        }

        return {
          role: normalizedRole,
          content: m.content || (m.parts && m.parts[0]?.text) || "",
        };
      });

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages: coreMessages,
    });
    
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
