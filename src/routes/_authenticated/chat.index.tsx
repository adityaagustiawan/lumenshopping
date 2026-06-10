import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { listThreads, createThread } from "@/lib/threads.functions";

export const Route = createFileRoute("/_authenticated/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { threads } = await listThreads();
      if (threads.length > 0) {
        navigate({ to: "/chat/$threadId", params: { threadId: threads[0].id }, replace: true });
      } else {
        const { id } = await createThread();
        navigate({ to: "/chat/$threadId", params: { threadId: id }, replace: true });
      }
    })();
  }, [navigate]);
  return <div className="p-8 text-sm text-muted-foreground">Loading chat…</div>;
}
