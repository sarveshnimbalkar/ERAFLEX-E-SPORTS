import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    // Chatbot response logic based on keywords
    const botResponse = generateBotResponse(message);

    return NextResponse.json({
      id: Date.now().toString(),
      role: "bot",
      content: botResponse,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

function generateBotResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Jersey/Kit responses
  if (
    lowerMessage.includes("jersey") ||
    lowerMessage.includes("kit") ||
    lowerMessage.includes("shirt")
  ) {
    return "🏆 Popular jerseys: Real Madrid 24/25, PSG, Manchester City, Liverpool. Would you like details on any specific team or player?";
  }

  // Trending products
  if (
    lowerMessage.includes("trending") ||
    lowerMessage.includes("popular") ||
    lowerMessage.includes("best seller")
  ) {
    return "📈 Our trending items this week: Real Madrid Home Jersey, Haaland #9 City Kit, and PSG Away Jersey. Check out the Trending page for more!";
  }

  // Customization
  if (
    lowerMessage.includes("custom") ||
    lowerMessage.includes("customize") ||
    lowerMessage.includes("name")
  ) {
    return "✨ Yes! Our Customizer lets you add names, numbers, and patches to any jersey. Head to the Customize page to create your unique kit!";
  }

  // Search for player
  if (
    lowerMessage.includes("messi") ||
    lowerMessage.includes("ronaldo") ||
    lowerMessage.includes("haaland")
  ) {
    const player = extractPlayerName(lowerMessage);
    return `⚡ Great choice! We have official kits for ${player}. Browse our shop to find available sizes and colors.`;
  }

  // Pricing/Delivery
  if (
    lowerMessage.includes("price") ||
    lowerMessage.includes("cost") ||
    lowerMessage.includes("shipping") ||
    lowerMessage.includes("delivery")
  ) {
    return "💳 Most jerseys are $59-$99. Free shipping on orders over $100. Standard delivery: 5-7 business days. Express: 2-3 days available!";
  }

  // League specific
  if (
    lowerMessage.includes("premier league") ||
    lowerMessage.includes("laliga") ||
    lowerMessage.includes("serie a") ||
    lowerMessage.includes("bundesliga")
  ) {
    return "🌍 We carry official kits from all major leagues: Premier League, La Liga, Serie A, Bundesliga & more. Which team are you looking for?";
  }

  // Default response
  return "🤖 I'm your ERAFLEX AI assistant! I can help you find jerseys, customize kits, or answer questions about trending items. Try asking about a specific team, player, or league!";
}

function extractPlayerName(message: string): string {
  if (message.includes("messi")) return "Messi";
  if (message.includes("ronaldo")) return "Ronaldo";
  if (message.includes("haaland")) return "Haaland";
  return "the player";
}
