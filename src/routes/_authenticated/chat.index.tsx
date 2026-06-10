import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { listThreads, createThread } from "@/lib/threads.functions";
import { LoadingPage } from "@/components/LoadingSpinner";

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
  return <LoadingPage message="Loading chat..." />;
}
