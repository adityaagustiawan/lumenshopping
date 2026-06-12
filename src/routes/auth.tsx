import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Auth route for login and signup
export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Lumen" }, { name: "description", content: "Sign in to Lumen marketplace." }] }),
  component: AuthPage,
});

/**
 * Helper to get the correct redirect URL for Supabase Auth.
 * It handles localhost, Vercel preview URLs, and production.
 */
const getURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin + "/account";
  }
  
  // Use import.meta.env for Vite projects (client-side)
  // Fall back to process.env for Nitro (server-side)
  let url =
    import.meta.env?.VITE_SITE_URL ??
    import.meta.env?.VITE_VERCEL_URL ??
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:8080";
  
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url + "account";
};

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | null>(null);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password: pw,
          options: { emailRedirectTo: getURL() },
        });
        if (error) throw error;
        toast.success("Account created. You're in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
      }
      navigate({ to: "/account" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setLoading(false); }
  };

  const signInWithProvider = async (provider: 'google') => {
    setSocialLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getURL(),
        },
      });
      if (error) {
        throw error;
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="font-display text-3xl">lumen<span className="text-accent">.</span></Link>
          <h1 className="font-display text-3xl">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p className="text-sm text-muted-foreground">Shop and chat with your AI assistant.</p>
        </div>
        <div className="space-y-3 relative z-10">
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log('Google button clicked');
              signInWithProvider('google');
            }}
            variant="outline"
            disabled={socialLoading !== null}
            className="w-full rounded-full h-11 cursor-pointer hover:bg-accent/10 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M12 11v3.2h5.3c-.2 1.4-1.6 4-5.3 4-3.2 0-5.8-2.7-5.8-5.9s2.6-5.9 5.8-5.9c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.7 3.9 14.6 3 12 3 6.9 3 2.8 7.1 2.8 12.2S6.9 21.4 12 21.4c6.9 0 11.5-4.9 11.5-11.7 0-.8-.1-1.4-.2-2H12z"/></svg>
            {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
          </Button>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5"><Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl" /></div>
          <div className="space-y-1.5"><Label>Password</Label>
            <Input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} className="h-11 rounded-xl" /></div>
          <Button type="submit" disabled={loading} className="w-full h-11 rounded-full">
            {loading ? "Please wait..." : (mode === "signin" ? "Sign in" : "Create account")}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New here?" : "Have an account?"}{" "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-accent underline-offset-4 hover:underline">
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
