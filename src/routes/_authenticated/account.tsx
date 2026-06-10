import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "Account — Lumen" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user } = useAuth();
  const profile = useQuery({
    queryKey: ["profile", user?.id], enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center font-display text-2xl text-accent">
          {(profile.data?.display_name ?? user?.email ?? "?")[0].toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-3xl">{profile.data?.display_name ?? "Welcome"}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Link to="/chat" className="rounded-2xl bg-card border border-border/60 p-5 hover:border-accent transition flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-accent" />
          <div><p className="font-medium">AI Assistant</p><p className="text-xs text-muted-foreground">Chat with Lumen</p></div>
        </Link>
        <Link to="/cart" className="rounded-2xl bg-card border border-border/60 p-5 hover:border-accent transition flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-accent" />
          <div><p className="font-medium">Cart</p><p className="text-xs text-muted-foreground">View your items</p></div>
        </Link>
      </div>
      <Button variant="outline" onClick={() => supabase.auth.signOut()} className="rounded-full">
        <LogOut className="w-4 h-4 mr-2" /> Sign out
      </Button>
    </div>
  );
}
