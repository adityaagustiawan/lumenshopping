import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";


export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("threads").select("id, title, updated_at, created_at")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { threads: data ?? [] };
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("threads").insert({ user_id: context.userId, title: "New chat" })
      .select("id").single();
    if (error) throw new Error(error.message);
    return { id: data.id as string };
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("threads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getThread = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const [{ data: thread, error: te }, { data: msgs, error: me }] = await Promise.all([
      context.supabase.from("threads").select("*").eq("id", data.id).maybeSingle(),
      context.supabase.from("messages").select("*").eq("thread_id", data.id).order("created_at"),
    ]);
    if (te) throw new Error(te.message);
    if (me) throw new Error(me.message);
    return { thread, messages: JSON.parse(JSON.stringify(msgs ?? [])) as Array<{ id: string; role: string; parts: any }> };
  });
