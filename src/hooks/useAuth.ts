import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

// Safe wrapper for Supabase that never throws errors
function safeSupabase() {
  try {
    const { supabase } = require("@/integrations/supabase/client");
    return supabase;
  } catch (e) {
    // Return fully safe dummy object instead of throwing!
    return {
      auth: {
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } }
        }),
        getSession: async () => ({ data: { session: null } }),
        signOut: async () => ({ error: null })
      }
    };
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    try {
      const sb = safeSupabase();
      sb.auth.getSession().then(({ data }: any) => {
        if (!mounted) return;
        setUser(data.session?.user ?? null);
        setLoading(false);
      });
      const { data: sub } = sb.auth.onAuthStateChange((_e: any, session: any) => {
        setUser(session?.user ?? null);
      });
      return () => {
        mounted = false;
        try {
          sub.subscription.unsubscribe();
        } catch (e) {}
      };
    } catch (e) {
      // If anything fails, just set loading to false without user
      if (mounted) {
        setLoading(false);
      }
    }
  }, []);

  return { user, loading };
}
