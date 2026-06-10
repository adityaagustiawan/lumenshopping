import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
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

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: unknown; threadId?: string };
        if (!Array.isArray(body.messages)) return new Response("messages required", { status: 400 });
        if (!body.threadId) return new Response("threadId required", { status: 400 });

        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
        const token = authHeader.slice(7);

        const SUPABASE_URL = process.env.SUPABASE_URL!;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: claims, error: cErr } = await supabase.auth.getClaims(token);
        if (cErr || !claims?.claims?.sub) return new Response("Unauthorized", { status: 401 });
        const userId = claims.claims.sub as string;

        // Load product catalog for grounding
        const { data: products } = await supabase
          .from("products")
          .select("name, slug, description, price_cents, category_slug, rating, location");
        const catalog = (products ?? [])
          .map((p) => `- ${p.name} (/${p.slug}) — Rp ${(p.price_cents * 100).toLocaleString("id-ID")} — ${p.category_slug} — ${p.description}`)
          .join("\n");

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const messages = body.messages as UIMessage[];

        const result = streamText({
          model: gateway("mimo-v2.5-pro"),
          system: `${SYSTEM_PROMPT}\n\nCURRENT PRODUCT CATALOG:\n${catalog}`,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          onFinish: async ({ messages: finalMessages }) => {
            try {
              const last = finalMessages[finalMessages.length - 1];
              const userMsg = messages[messages.length - 1];
              if (userMsg && userMsg.role === "user") {
                await supabase.from("messages").insert({
                  thread_id: body.threadId!,
                  user_id: userId,
                  role: "user",
                  parts: userMsg.parts as unknown as object,
                });
              }
              if (last && last.role === "assistant") {
                await supabase.from("messages").insert({
                  thread_id: body.threadId!,
                  user_id: userId,
                  role: "assistant",
                  parts: last.parts as unknown as object,
                });
              }
              await supabase.from("threads").update({ updated_at: new Date().toISOString() }).eq("id", body.threadId!);
              // Auto-title from first user message if still default
              const text = userMsg?.parts?.map((p) => (p.type === "text" ? p.text : "")).join(" ").trim().slice(0, 60);
              if (text) {
                await supabase.from("threads").update({ title: text }).eq("id", body.threadId!).eq("title", "New chat");
              }
            } catch (e) {
              console.error("persist messages failed", e);
            }
          },
        });
      },
    },
  },
});
