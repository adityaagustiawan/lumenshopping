import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare, ShoppingBag, LayoutDashboard, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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

  const connectedProviders = user?.app_metadata?.providers || [];
  const isFacebookConnected = connectedProviders.includes("facebook");

  const connectFacebook = async () => {
    try {
      const { error } = await supabase.auth.linkIdentity({
        provider: "facebook",
        options: {
          redirectTo: window.location.origin + "/account",
        },
      });
      if (error) throw error;
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

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
        <Link to="/dashboard" className="rounded-2xl bg-card border border-border/60 p-5 hover:border-accent transition flex items-center gap-3">
          <LayoutDashboard className="w-5 h-5 text-accent" />
          <div><p className="font-medium">Dashboard</p><p className="text-xs text-muted-foreground">Store analytics & stats</p></div>
        </Link>
        <Link to="/chat" className="rounded-2xl bg-card border border-border/60 p-5 hover:border-accent transition flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-accent" />
          <div><p className="font-medium">AI Assistant</p><p className="text-xs text-muted-foreground">Chat with Lumen</p></div>
        </Link>
        <Link to="/cart" className="rounded-2xl bg-card border border-border/60 p-5 hover:border-accent transition flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-accent" />
          <div><p className="font-medium">Cart</p><p className="text-xs text-muted-foreground">View your items</p></div>
        </Link>
      </div>

      <div className="bg-card border border-border/60 rounded-2xl p-6">
        <h2 className="font-display text-xl mb-4">Connected Accounts</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.991 4.388 10.954 10.125 11.854v-8.384H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.494 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.384C19.612 23.027 24 18.064 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </div>
            {isFacebookConnected ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <Button 
                onClick={connectFacebook} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Connect
              </Button>
            )}
          </div>
        </div>
      </div>

      <Button variant="outline" onClick={() => supabase.auth.signOut()} className="rounded-full">
        <LogOut className="w-4 h-4 mr-2" /> Sign out
      </Button>
    </div>
  );
}
