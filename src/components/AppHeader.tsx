import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingBag, MessageCircle, User as UserIcon, LogOut, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function AppHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/" className="font-display text-2xl text-foreground shrink-0">
          lumen<span className="text-accent">.</span>
        </Link>
        <form
          className="flex-1 max-w-xl relative hidden sm:block"
          onSubmit={(e) => { e.preventDefault(); /* search placeholder */ }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for products, brands and more"
            className="pl-9 h-10 rounded-full bg-secondary border-transparent focus-visible:bg-card"
          />
        </form>
        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" aria-label="Shorts">
            <Link to="/shorts"><Play className="w-5 h-5" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="AI Assistant">
            <Link to={user ? "/chat" : "/auth"}><MessageCircle className="w-5 h-5" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Cart">
            <Link to="/cart"><ShoppingBag className="w-5 h-5" /></Link>
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><UserIcon className="w-5 h-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/account" })}>Account</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/chat" })}>AI Assistant</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm" className="ml-1 rounded-full">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
