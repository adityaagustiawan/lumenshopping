import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppHeader } from "@/components/AppHeader";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-foreground">404</h1>
        <p className="mt-3 text-muted-foreground">This page doesn't exist.</p>
        <a href="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Go home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lumen — Modern OpenSource Marketplace" },
      { name: "description", content: "Discover thoughtful products from trusted sellers. Shop electronics, fashion, home, beauty and more with an AI assistant by your side." },
      { property: "og:title", content: "Lumen — Modern OpenSource Marketplace" },
      { property: "og:description", content: "Discover thoughtful products from trusted sellers. Shop electronics, fashion, home, beauty and more with an AI assistant by your side." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Lumen — Modern OpenSource Marketplace" },
      { name: "twitter:description", content: "Discover thoughtful products from trusted sellers. Shop electronics, fashion, home, beauty and more with an AI assistant by your side." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f032c06e-9939-4a6a-869e-e6acb712d4fe/id-preview-5e19ebe4--66c6f01c-9a06-4417-988f-f2016bd91ea3.lovable.app-1781011764837.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f032c06e-9939-4a6a-869e-e6acb712d4fe/id-preview-5e19ebe4--66c6f01c-9a06-4417-988f-f2016bd91ea3.lovable.app-1781011764837.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        router.invalidate();
        if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      }
    });

    // Load Coze SDK
    const script = document.createElement("script");
    script.src = "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/oversea/index.js";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.CozeWebSDK) {
        // @ts-ignore
        new window.CozeWebSDK.WebChatClient({
          config: {
            bot_id: "7649776912948330549",
          },
          componentProps: {
            title: "Coze",
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
    };
    document.body.appendChild(script);

    return () => {
      sub.subscription.unsubscribe();
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1"><Outlet /></main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
