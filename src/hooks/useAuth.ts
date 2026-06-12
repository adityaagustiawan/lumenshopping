import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    supabase.auth.getSession().then(({ data }: any) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    
    const { data: sub } = supabase.auth.onAuthStateChange((_e: any, session: any) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
    });
    
    return () => {
      mounted = false;
      try {
        sub.subscription.unsubscribe();
      } catch (e) {}
    };
  }, []);

  return { user, loading };
}
