import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the ERAFLEX AI Assistant, the elite gear specialist for a premium sports apparel brand. 
ERAFLEX offers official high-end performance gear, jerseys (football, basketball, cricket), a 3D Customizer for personalized kits, and an AR Try-On "Lens" feature.
Maintain a premium, hype-driven, and sleek tone (like Nike or Adidas). Keep responses relatively concise but very helpful.
Use emojis sparingly but effectively (e.g., ⚡, 🏆).
Guide users towards the 3D Customizer (/customize) or AR Try-On (/try-on) when appropriate.
Pricing context: Jerseys generally range from $59 to $99. Free shipping over $100.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Ensure backwards compatibility with streamText by mapping 'parts' to 'content'
    const coreMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content || (m.parts && m.parts[0]?.text) || "",
    }));

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
