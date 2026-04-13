import { streamText, type ModelMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
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

const SYSTEM_PROMPT = `You are the ERAFLEX AI Assistant — the elite gear specialist for ERAFLEX E-SPORTS, India's premier multi-sport jersey platform.

## PRODUCT CATALOG (75 Jerseys Total)

### ⚽ FOOTBALL JERSEYS (25 kits, ₹2,999–₹5,999)
Real Madrid CF, Arsenal FC, FC Barcelona, Manchester United, Bayern Munich, PSG, Juventus, AC Milan, Liverpool FC, Chelsea FC, Manchester City, Inter Milan, Borussia Dortmund, Atletico Madrid, Tottenham Hotspur, Napoli, AS Roma, Ajax, Benfica, Bayer Leverkusen, Aston Villa, Newcastle, Sporting CP, Porto, Marseille
→ Shop at /shop (filter by Football)

### 🏀 BASKETBALL JERSEYS (25 kits, ₹2,999–₹5,999)
LA Lakers, Golden State Warriors, Chicago Bulls, Boston Celtics, Miami Heat, Brooklyn Nets, Milwaukee Bucks, Phoenix Suns, Philadelphia 76ers, Dallas Mavericks, Denver Nuggets, LA Clippers, New York Knicks, Toronto Raptors, Houston Rockets, San Antonio Spurs, Cleveland Cavaliers, Atlanta Hawks, Memphis Grizzlies, New Orleans Pelicans, Sacramento Kings, Minnesota Timberwolves, Utah Jazz, Indiana Pacers, Oklahoma City Thunder
→ Shop at /shop (filter by Basketball)

### 🏏 CRICKET JERSEYS (25 kits, ₹2,999–₹5,999)
Team India, Australia, England, New Zealand, South Africa, Pakistan, Sri Lanka, West Indies, Bangladesh, Afghanistan — plus IPL teams: Chennai Super Kings, Mumbai Indians, Royal Challengers Bangalore, Kolkata Knight Riders, Delhi Capitals, Rajasthan Royals, Sunrisers Hyderabad, Punjab Kings, Lucknow Super Giants, Gujarat Titans, and more
→ Shop at /shop (filter by Cricket)

## PLATFORM FEATURES

- **2D Design Studio** (/customize): Personalize any jersey with your name, squad number, and font. Real-time preview. ₹299 customization fee.
- **AR Try-On** (/try-on): Use "ERAFLEX LENS 2.0" — point your camera and virtually try any jersey in real-time. No downloads needed.
- **Trending Section** (/trending): Auto-refreshes 3 random top picks per sport every page load.

## ORDERS & SHIPPING

- FREE shipping above ₹2,000 | Flat ₹99 otherwise
- 3–5 business days delivery pan-India
- Express 24h delivery available (select pincodes)
- 7-day hassle-free returns (non-customized items only)
- Payment: Credit/Debit Card, UPI, Net Banking, Stripe

## RESPONSE GUIDELINES

- Respond concisely (2–4 sentences max per reply)
- Use **bold** for product names and prices
- Use ₹ (Indian Rupee) for all prices
- When suggesting products, mention the team name, sport, and price range
- For navigation help, mention the exact page path (e.g., "Visit /shop → Football")
- If asked about sizing: we stock XS–3XL; recommend going one size up for loose/athletic fit
- If asked about stock/availability: direct to /shop to check live stock
- Be enthusiastic, premium, and expert — like a sports brand personal shopper`;


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

    const customOpenAI = createOpenAI({
      apiKey: serverEnv.openAiApiKey,
    });

    const result = streamText({
      model: customOpenAI('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages: coreMessages,
    });
    
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to process chat message", 
      details: error instanceof Error ? error.message : String(error) 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
