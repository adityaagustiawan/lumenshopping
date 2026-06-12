import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are the Senior Store Manager of Lumen, a modern AI-powered marketplace.
Your goal is to provide strategic shopping advice and personalized recommendations, not just robotic analysis.
You should act like a knowledgeable manager who understands trends, customer needs, and product value.

Key Guidelines:
1. Tone: Warm, professional, and strategic. Avoid being overly robotic or repetitive.
2. Value-Add: Instead of just listing specs, explain WHY a product is a good fit for the user.
3. Comparison: Use markdown lists to compare products clearly.
4. Boundaries: Keep replies concise and focused on the marketplace. If asked unrelated questions, politely steer back.
5. Currency: All prices are in IDR (Rp).

Help users discover products, suggest gifts, explain features, and manage their shopping experience with a high-level strategic perspective.`;

const mockProducts = [
  { name: "Wireless Bluetooth Earbuds Pro", slug: "wireless-bluetooth-earbuds-pro", description: "High-quality wireless earbuds with active noise cancellation, 30-hour battery life, and premium sound quality.", price_cents: 799000, category_slug: "electronics", rating: 4.8, location: "Jakarta" },
  { name: "Minimalist Cotton T-Shirt", slug: "minimalist-cotton-tshirt", description: "Super soft cotton t-shirt with a modern fit and minimalist design.", price_cents: 199000, category_slug: "fashion", rating: 4.6, location: "Bandung" },
  { name: "Smart Watch Series 5", slug: "smart-watch-series-5", description: "Advanced smartwatch with heart rate monitor, GPS, and 14-day battery life.", price_cents: 2499000, category_slug: "electronics", rating: 4.9, location: "Surabaya" },
  { name: "Organic Vitamin C Face Serum", slug: "organic-face-serum", description: "100% organic face serum for glowing, healthy skin.", price_cents: 349000, category_slug: "beauty", rating: 4.7, location: "Jakarta" },
];

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: unknown; threadId?: string };
        if (!Array.isArray(body.messages)) return new Response("messages required", { status: 400 });
        if (!body.threadId) return new Response("threadId required", { status: 400 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const messages = body.messages as UIMessage[];

        const catalog = mockProducts.map((p) => `- ${p.name} (/${p.slug}) — Rp ${(p.price_cents * 100).toLocaleString("id-ID")} — ${p.category_slug} — ${p.description}`).join("\n");

        const result = streamText({
          model: gateway("mimo-v2.5-pro"),
          system: `${SYSTEM_PROMPT}\n\nCURRENT PRODUCT CATALOG:\n${catalog}`,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages,
        });
      },
    },
  },
});
