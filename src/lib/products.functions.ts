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
    promo_badge?: string;
    promo_type?: string;
    [key: string]: any;
  };
  // Computed properties for backward compatibility
  platform?: Platform;
  affiliate_link?: string;
  seller_type?: 'affiliate' | 'own-store';
  video_url?: string;
  promo_badge?: string;
  promo_type?: string;
};

export type Category = {
  slug: string;
  name: string;
  icon: string | null;
  sort_order: number;
};

// Mock data for when Supabase is unavailable
const mockCategories: Category[] = [
  { slug: 'electronics', name: 'Electronics', icon: '📱', sort_order: 1 },
  { slug: 'fashion', name: 'Fashion', icon: '👕', sort_order: 2 },
  { slug: 'home', name: 'Home & Living', icon: '🛋️', sort_order: 3 },
  { slug: 'beauty', name: 'Beauty', icon: '✨', sort_order: 4 },
  { slug: 'sports', name: 'Sports', icon: '🏋️', sort_order: 5 },
  { slug: 'books', name: 'Books', icon: '📚', sort_order: 6 },
];

// Real product images from Unsplash
const productImage1 = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"; // Wireless earbuds
const productImage2 = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"; // T-shirt
const productImage3 = "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80"; // Smart watch
const productImage4 = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"; // Face serum
const productImage5 = "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80"; // Yoga mat
const productImage6 = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"; // Floor lamp

const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'wireless-bluetooth-earbuds-pro',
    name: 'Wireless Bluetooth Earbuds Pro',
    description: 'High-quality wireless earbuds with active noise cancellation, 30-hour battery life, and premium sound quality.',
    price_cents: 7900,
    compare_at_cents: 9900,
    image_url: productImage1,
    category_slug: 'electronics',
    rating: 4.8,
    sold_count: 154,
    stock: 32,
    location: 'Jakarta',
    is_featured: true,
    metadata: {
      promo_badge: 'New Arrival',
      promo_type: 'new'
    }
  },
  {
    id: '2',
    slug: 'minimalist-cotton-tshirt',
    name: 'Minimalist Cotton T-Shirt',
    description: 'Super soft cotton t-shirt with a modern fit and minimalist design.',
    price_cents: 2900,
    compare_at_cents: 3900,
    image_url: productImage2,
    category_slug: 'fashion',
    rating: 4.6,
    sold_count: 289,
    stock: 120,
    location: 'Bandung',
    is_featured: true,
  },
  {
    id: '3',
    slug: 'smart-watch-series-5',
    name: 'Smart Watch Series 5',
    description: 'Advanced smartwatch with heart rate monitor, GPS, and 14-day battery life.',
    price_cents: 24900,
    compare_at_cents: null,
    image_url: productImage3,
    category_slug: 'electronics',
    rating: 4.9,
    sold_count: 87,
    stock: 15,
    location: 'Surabaya',
    is_featured: true,
  },
  {
    id: '4',
    slug: 'organic-face-serum',
    name: 'Organic Vitamin C Face Serum',
    description: '100% organic face serum for glowing, healthy skin.',
    price_cents: 3900,
    compare_at_cents: 4900,
    image_url: productImage4,
    category_slug: 'beauty',
    rating: 4.7,
    sold_count: 423,
    stock: 78,
    location: 'Jakarta',
    is_featured: true,
  },
  {
    id: '5',
    slug: 'yoga-mat-premium',
    name: 'Premium Yoga Mat',
    description: 'Extra thick non-slip yoga mat perfect for all types of exercise.',
    price_cents: 5900,
    compare_at_cents: null,
    image_url: productImage5,
    category_slug: 'sports',
    rating: 4.5,
    sold_count: 156,
    stock: 45,
    location: 'Yogyakarta',
    is_featured: false,
  },
  {
    id: '6',
    slug: 'modern-floor-lamp',
    name: 'Modern LED Floor Lamp',
    description: 'Elegant modern floor lamp with adjustable brightness and color temperature.',
    price_cents: 12900,
    compare_at_cents: 16900,
    image_url: productImage6,
    category_slug: 'home',
    rating: 4.8,
    sold_count: 98,
    stock: 22,
    location: 'Semarang',
    is_featured: true,
  },
];

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [cats, featured, all] = await Promise.all([
      supabaseAdmin.from("categories").select("slug,name,icon,sort_order").order("sort_order"),
      supabaseAdmin.from("products").select("*").eq("is_featured", true).limit(8),
      supabaseAdmin.from("products").select("*").order("sold_count", { ascending: false }).limit(12),
    ]);
    if (cats.data && cats.data.length > 0) {
      return {
        categories: (cats.data ?? []) as Category[],
        featured: (featured.data ?? []) as Product[],
        trending: (all.data ?? []) as Product[],
      };
    }
  } catch (e) {
    console.warn('Using mock data due to Supabase error');
  }

  // Fallback to mock data
  return {
    categories: mockCategories,
    featured: mockProducts.filter(p => p.is_featured),
    trending: [...mockProducts].sort((a, b) => b.sold_count - a.sold_count),
  };
});

export const getCategory = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const [cat, prods] = await Promise.all([
        supabaseAdmin.from("categories").select("*").eq("slug", data.slug).maybeSingle(),
        supabaseAdmin.from("products").select("*").eq("category_slug", data.slug).order("sold_count", { ascending: false }),
      ]);
      if (cat.data) {
        return { category: cat.data as Category | null, products: (prods.data ?? []) as Product[] };
      }
    } catch (e) {
      console.warn('Using mock data due to Supabase error');
    }

    return { 
      category: mockCategories.find(c => c.slug === data.slug) || null, 
      products: mockProducts.filter(p => p.category_slug === data.slug) 
    };
  });

export const getProduct = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: prod } = await supabaseAdmin.from("products").select("*").eq("slug", data.slug).maybeSingle();
      if (prod) {
        const { data: related } = await supabaseAdmin
          .from("products").select("*")
          .eq("category_slug", prod.category_slug).neq("id", prod.id).limit(4);
        return { product: prod as Product, related: (related ?? []) as Product[] };
      }
    } catch (e) {
      console.warn('Using mock data due to Supabase error');
    }

    const prod = mockProducts.find(p => p.slug === data.slug);
    if (!prod) return { product: null, related: [] as Product[] };
    const related = mockProducts.filter(p => p.category_slug === prod.category_slug && p.id !== prod.id).slice(0,4);
    return { product: prod, related };
  });
