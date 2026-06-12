import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingBag, MessageCircle, User as UserIcon, LogOut, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// SVG logo for Lumen (elegant design)
const LumenLogo = () => (
  <svg viewBox="0 0 200 80" className="h-8 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Golden L with star */}
    <path d="M40 15 L40 55 L80 55 Q75 30 65 20 Q55 10 40 15 Z" fill="url(#goldGrad)"/>
    <path d="M50 25 L50 50 L70 50 Q67 35 62 30 Q57 25 50 25 Z" fill="url(#goldDark)"/>
    
    {/* Star */}
    <g transform="translate(85, 30)">
      <polygon points="0,-10 1.5,-3 8.5,-3 2.5,1.5 4,8.5 0,4.5 -4,8.5 -2.5,1.5 -8.5,-3 -1.5,-3" fill="url(#goldGrad)"/>
    </g>
    
    {/* Text */}
    <text x="30" y="72" fontFamily="'Georgia', serif" fontSize="22" fontWeight="bold" letterSpacing="4" fill="#1e3a5f">
      LUMEN
    </text>
    
    {/* Subtitle line */}
    <line x1="40" y1="78" x2="75" y2="78" stroke="#c9a96e" strokeWidth="1.5"/>
    <line x1="125" y1="78" x2="160" y2="78" stroke="#c9a96e" strokeWidth="1.5"/>
    <text x="80" y="78.5" fontFamily="system-ui" fontSize="8" letterSpacing="2" fill="#8b7355" textAnchor="middle">
      MODERN MARKETPLACE
    </text>
    
    <defs>
      <linearGradient id="goldGrad" x1="40" y1="15" x2="80" y2="55">
        <stop offset="0%" stopColor="#f0e68c"/>
        <stop offset="50%" stopColor="#d4af37"/>
        <stop offset="100%" stopColor="#c9a96e"/>
      </linearGradient>
      <linearGradient id="goldDark" x1="50" y1="25" x2="70" y2="50">
        <stop offset="0%" stopColor="#d4af37"/>
        <stop offset="100%" stopColor="#a8893d"/>
      </linearGradient>
    </defs>
  </svg>
);

export function AppHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <LumenLogo />
          <span className="font-display text-2xl text-foreground hidden">
            lumen<span className="text-accent">.</span>
          </span>
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
                <DropdownMenuItem onClick={async () => {
                  try {
                    await supabase.auth.signOut();
                  } catch (e) {}
                  navigate({ to: "/" });
                }}>
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
