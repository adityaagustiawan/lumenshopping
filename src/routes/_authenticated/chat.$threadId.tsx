import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Send, Trash2, Sparkles, MessageSquare } from "lucide-react";
import { listThreads, createThread, deleteThread, getThread } from "@/lib/threads.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: ChatPage,
});

function ChatPage() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const threadsQ = useQuery({ queryKey: ["threads"], queryFn: () => listThreads() });
  const threadQ = useQuery({
    queryKey: ["thread", threadId],
    queryFn: () => getThread({ data: { id: threadId } }),
  });

  const initial = (threadQ.data?.messages ?? []) as UIMessage[];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 grid lg:grid-cols-[260px_1fr] gap-6 h-[calc(100vh-4rem-3rem)]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col bg-card border border-border/60 rounded-2xl p-3 overflow-hidden">
        <Button
          onClick={async () => {
            const { id } = await createThread();
            qc.invalidateQueries({ queryKey: ["threads"] });
            navigate({ to: "/chat/$threadId", params: { threadId: id } });
          }}
          className="rounded-full mb-3"
        >
          <Plus className="w-4 h-4 mr-1" /> New chat
        </Button>
        <div className="flex-1 overflow-y-auto space-y-1">
          {threadsQ.data?.threads.map((t) => (
            <div key={t.id} className={`group flex items-center gap-1 rounded-lg pr-1 ${t.id === threadId ? "bg-secondary" : "hover:bg-secondary/60"}`}>
              <Link
                to="/chat/$threadId" params={{ threadId: t.id }}
                className="flex-1 min-w-0 px-2.5 py-2 text-sm truncate"
              >
                {t.title}
              </Link>
              <button
                onClick={async () => {
                  await deleteThread({ data: { id: t.id } });
                  qc.invalidateQueries({ queryKey: ["threads"] });
                  if (t.id === threadId) navigate({ to: "/chat" });
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive"
                aria-label="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat */}
      {threadQ.isLoading ? (
        <div className="flex items-center justify-center text-muted-foreground">Loading…</div>
      ) : (
        <ChatWindow key={threadId} threadId={threadId} initial={initial} onSent={() => qc.invalidateQueries({ queryKey: ["threads"] })} />
      )}
    </div>
  );
}

function ChatWindow({ threadId, initial, onSent }: { threadId: string; initial: UIMessage[]; onSent: () => void }) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = new DefaultChatTransport({
    api: "/api/chat",
    body: { threadId },
    fetch: async (url, init) => {
      const { data } = await supabase.auth.getSession();
      const headers = new Headers(init?.headers);
      if (data.session?.access_token) headers.set("Authorization", `Bearer ${data.session.access_token}`);
      return fetch(url as string, { ...init, headers });
    },
  });

  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initial,
    transport,
  });

  useEffect(() => { inputRef.current?.focus(); }, [threadId]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, status]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || status === "submitted" || status === "streaming") return;
    setInput("");
    await sendMessage({ text });
    onSent();
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const busy = status === "submitted" || status === "streaming";

  return (
    <section className="flex flex-col bg-card border border-border/60 rounded-2xl overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <div className="inline-flex w-12 h-12 rounded-full bg-accent/15 items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-display text-2xl">Hi, I'm Lumen</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Ask me for product recommendations, comparisons, gift ideas, or help with your order.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {["Recommend wireless earbuds under Rp 100k", "Best gift for a coffee lover", "Compare your two best smart watches"].map((s) => (
                <button key={s} onClick={() => setInput(s)} className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70">{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
              {m.parts.map((p, i) => p.type === "text" ? <span key={i}>{p.text}</span> : null)}
            </div>
          </div>
        ))}
        {status === "submitted" && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center"><Sparkles className="w-4 h-4 text-accent" /></div>
            <div className="bg-secondary rounded-2xl px-4 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>
      <form onSubmit={send} className="border-t border-border p-3 flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about products…"
          className="flex-1 bg-secondary rounded-full px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
        <Button type="submit" disabled={busy || !input.trim()} className="rounded-full h-11 px-5">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </section>
  );
}
