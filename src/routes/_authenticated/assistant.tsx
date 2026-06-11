import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { listThreads, createThread } from "@/lib/threads.functions";
import { LoadingPage } from "@/components/LoadingSpinner";

export const Route = createFileRoute("/_authenticated/assistant")({
  component: AssistantPage,
});

function AssistantPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    (async () => {
      try {
        // Get existing threads
        const { threads } = await listThreads();
        
        // Use the first thread or create a new one
        if (threads.length > 0) {
          navigate({
            to: "/chat/$threadId",
            params: { threadId: threads[0].id },
            replace: true
          });
        } else {
          const { id } = await createThread();
          navigate({
            to: "/chat/$threadId",
            params: { threadId: id },
            replace: true
          });
        }
      } catch (error) {
        console.error("Error loading assistant:", error);
      }
    })();
  }, [navigate]);
  
  return <LoadingPage message="Loading AI Assistant..." />;
}

// Made with Bob
