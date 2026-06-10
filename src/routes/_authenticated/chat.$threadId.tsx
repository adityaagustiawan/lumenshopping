import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { listThreads, createThread, deleteThread } from "@/lib/threads.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: ChatPage,
});

function ChatPage() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const threadsQ = useQuery({ queryKey: ["threads"], queryFn: () => listThreads() });
  const [isCozeLoaded, setIsCozeLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Load Coze SDK
    const script = document.createElement("script");
    script.src = "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/oversea/index.js";
    script.async = true;
    script.onload = () => {
      setIsCozeLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (isCozeLoaded && typeof window !== "undefined") {
      // @ts-ignore
      if (window.CozeWebSDK) {
        // @ts-ignore
        new window.CozeWebSDK.WebChatClient({
          config: {
            bot_id: "7649776912948330549",
          },
          componentProps: {
            title: "Lumen AI Assistant",
          },
          auth: {
            type: "token",
            token: "pat_3CaXfkjyolIFkWAKOPbiyC9xqdKKc9kcws1XrVWpQxQus4aWiRoxqczGGkq8JupU",
            onRefreshToken: function () {
              return "pat_3CaXfkjyolIFkWAKOPbiyC9xqdKKc9kcws1XrVWpQxQus4aWiRoxqczGGkq8JupU";
            },
          },
        });
      }
    }
  }, [isCozeLoaded]);

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

      {/* Coze AI Chat Widget Container */}
      <section className="flex flex-col bg-card border border-border/60 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-display text-xl">Lumen AI Assistant</h2>
          <p className="text-sm text-muted-foreground mt-1">Ask me about products, recommendations, or anything else!</p>
        </div>
        <div id="coze-chat-container" className="flex-1"></div>
      </section>
    </div>
  );
}
