import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Platform = 'shopee' | 'tokopedia' | 'lazada' | 'bukalapak' | 'blibli' | 'amazon' | 'ebay' | 'aliexpress' | 'woocommerce' | 'own-store';

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  compare_at_cents: number | null;
  image_url: string;
  category_slug: string;
  rating: number;
  sold_count: number;
  stock: number;
  location: string;
  is_featured: boolean;
  product_source_id?: string | null;
  external_id?: string | null;
  metadata?: {
    platform?: Platform;
    affiliate_link?: string;
    seller_type?: 'affiliate' | 'own-store';
    additional_images?: string[];
    video_url?: string;
    [key: string]: any;
  };
  // Computed properties for backward compatibility
  platform?: Platform;
  affiliate_link?: string;
  seller_type?: 'affiliate' | 'own-store';
  video_url?: string;
};

export type Category = {
  slug: string;
  name: string;
  icon: string | null;
  sort_order: number;
};

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [cats, featured, all] = await Promise.all([
    supabaseAdmin.from("categories").select("slug,name,icon,sort_order").order("sort_order"),
    supabaseAdmin.from("products").select("*").eq("is_featured", true).limit(8),
    supabaseAdmin.from("products").select("*").order("sold_count", { ascending: false }).limit(12),
  ]);
  return {
    categories: (cats.data ?? []) as Category[],
    featured: (featured.data ?? []) as Product[],
    trending: (all.data ?? []) as Product[],
  };
});

export const getCategory = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [cat, prods] = await Promise.all([
      supabaseAdmin.from("categories").select("*").eq("slug", data.slug).maybeSingle(),
      supabaseAdmin.from("products").select("*").eq("category_slug", data.slug).order("sold_count", { ascending: false }),
    ]);
    return { category: cat.data as Category | null, products: (prods.data ?? []) as Product[] };
  });

export const getProduct = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: prod } = await supabaseAdmin.from("products").select("*").eq("slug", data.slug).maybeSingle();
    if (!prod) return { product: null, related: [] as Product[] };
    const { data: related } = await supabaseAdmin
      .from("products").select("*")
      .eq("category_slug", prod.category_slug).neq("id", prod.id).limit(4);
    return { product: prod as Product, related: (related ?? []) as Product[] };
  });
