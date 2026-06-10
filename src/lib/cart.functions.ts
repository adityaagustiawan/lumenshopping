import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const getCart = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("cart_items")
      .select("id, quantity, product:products(*)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { items: data ?? [] };
  });

export const addToCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ product_id: z.string().uuid(), quantity: z.number().int().min(1).default(1) }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: existing } = await context.supabase
      .from("cart_items").select("id, quantity")
      .eq("user_id", context.userId).eq("product_id", data.product_id).maybeSingle();
    if (existing) {
      const { error } = await context.supabase.from("cart_items")
        .update({ quantity: existing.quantity + data.quantity }).eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase.from("cart_items")
        .insert({ user_id: context.userId, product_id: data.product_id, quantity: data.quantity });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const updateCartItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), quantity: z.number().int().min(1) }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("cart_items").update({ quantity: data.quantity }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeCartItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("cart_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
