import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const seedSampleProducts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Check if there are already products to avoid duplicates
    const { data: existing } = await supabaseAdmin.from("products").select("id").limit(1);
    if (existing && existing.length > 0) {
      return { success: true, message: "Products already exist!", count: existing.length };
    }

    // Sample products (Indonesian market-focused, as per your site)
    const products = [
      {
        name: "Wireless Bluetooth Earbuds Pro",
        slug: "wireless-bluetooth-earbuds-pro",
        description: "High-quality wireless earbuds with active noise cancellation, 30-hour battery life, and premium sound quality.",
        price_cents: 15000000,
        compare_at_cents: 20000000,
        image_url: "https://images.unsplash.com/photo-1600267214827-459246976967?w=400&q=80",
        category_slug: "electronics",
        rating: 4.8,
        sold_count: 154,
        stock: 32,
        location: "Jakarta",
        is_featured: true
      },
      {
        name: "Minimalist Cotton T-Shirt",
        slug: "minimalist-cotton-t-shirt",
        description: "Comfortable 100% organic cotton t-shirt, perfect for everyday wear. Available in multiple colors.",
        price_cents: 8900000,
        compare_at_cents: 12900000,
        image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
        category_slug: "fashion",
        rating: 4.5,
        sold_count: 231,
        stock: 85,
        location: "Bandung",
        is_featured: true
      },
      {
        name: "Ergonomic Office Chair",
        slug: "ergonomic-office-chair",
        description: "Premium ergonomic chair with lumbar support, adjustable height, and breathable mesh for all-day comfort.",
        price_cents: 25000000,
        compare_at_cents: 35000000,
        image_url: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0a1?w=400&q=80",
        category_slug: "home",
        rating: 4.7,
        sold_count: 78,
        stock: 12,
        location: "Surabaya",
        is_featured: true
      },
      {
        name: "Korean Skincare Bundle",
        slug: "korean-skincare-bundle",
        description: "Complete 5-step Korean skincare routine: cleanser, toner, serum, moisturizer, and sunscreen.",
        price_cents: 22500000,
        compare_at_cents: 30000000,
        image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
        category_slug: "beauty",
        rating: 4.9,
        sold_count: 345,
        stock: 47,
        location: "Jakarta",
        is_featured: false
      },
      {
        name: "Adjustable Dumbbell Set",
        slug: "adjustable-dumbbell-set",
        description: "Space-saving adjustable dumbbells from 10kg to 40kg, perfect for home gyms.",
        price_cents: 17500000,
        compare_at_cents: 22500000,
        image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
        category_slug: "sports",
        rating: 4.6,
        sold_count: 112,
        stock: 18,
        location: "Yogyakarta",
        is_featured: false
      },
      {
        name: "Bestselling Novel Collection",
        slug: "bestselling-novel-collection",
        description: "Set of 5 top Indonesian novels from 2024, perfect for book lovers.",
        price_cents: 4500000,
        compare_at_cents: 6000000,
        image_url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80",
        category_slug: "books",
        rating: 4.4,
        sold_count: 203,
        stock: 64,
        location: "Jakarta",
        is_featured: false
      },
      {
        name: "Smart Watch Series X",
        slug: "smart-watch-series-x",
        description: "Feature-packed smartwatch with heart-rate monitoring, GPS, and 14-day battery life.",
        price_cents: 32500000,
        compare_at_cents: 45000000,
        image_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80",
        category_slug: "electronics",
        rating: 4.7,
        sold_count: 87,
        stock: 23,
        location: "Bandung",
        is_featured: true
      },
      {
        name: "Indoor Plant Pot Set",
        slug: "indoor-plant-pot-set",
        description: "Beautiful ceramic pot set of 3, perfect for your indoor jungle.",
        price_cents: 2900000,
        compare_at_cents: 3900000,
        image_url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80",
        category_slug: "home",
        rating: 4.5,
        sold_count: 176,
        stock: 41,
        location: "Malang",
        is_featured: false
      }
    ];

    // Insert the sample products
    const { error } = await supabaseAdmin.from("products").insert(products);
    
    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: "Sample products added successfully!", count: products.length };
  });
