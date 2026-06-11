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

    // Sample products (Indonesian market-focused)
    const products = [
      // --- OWN STORE PRODUCTS ---
      {
        name: "Wireless Bluetooth Earbuds Pro",
        slug: "wireless-bluetooth-earbuds-pro",
        description: "High-quality wireless earbuds with active noise cancellation, 30-hour battery life, and premium sound quality.",
        price_cents: 79900000,
        compare_at_cents: 99900000,
        image_url: "https://images.unsplash.com/photo-1600267214827-459246976967?w=400&q=80",
        category_slug: "electronics",
        rating: 4.8,
        sold_count: 154,
        stock: 32,
        location: "Jakarta",
        is_featured: true,
        metadata: {
          promo_badge: "New Arrival",
          promo_type: "new"
        }
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
        is_featured: true,
        metadata: {
          promo_badge: "Flash Sale",
          promo_type: "flash_sale"
        }
      },

      // --- AFFILIATE PRODUCTS FROM MAJOR PLATFORMS ---
      {
        name: "Sony WH-1000XM5 Noise Cancelling Headphones",
        slug: "sony-wh-1000xm5-headphones",
        description: "Industry-leading noise cancelling headphones with exceptional sound quality and 30-hour battery life.",
        price_cents: 599900000,
        compare_at_cents: 749900000,
        image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
        category_slug: "electronics",
        rating: 4.9,
        sold_count: 1247,
        stock: 0,
        location: "Indonesia",
        is_featured: true,
        metadata: {
          platform: 'tokopedia',
          seller_type: 'affiliate',
          affiliate_link: 'https://www.tokopedia.com/search?q=sony+wh-1000xm5',
          promo_badge: "Premium Audio",
          promo_type: "premium"
        }
      },
      {
        name: "Adidas Ultraboost Running Shoes",
        slug: "adidas-ultraboost-running-shoes",
        description: "Premium running shoes with Boost technology for ultimate comfort and energy return.",
        price_cents: 249900000,
        compare_at_cents: 329900000,
        image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
        category_slug: "fashion",
        rating: 4.7,
        sold_count: 856,
        stock: 0,
        location: "Indonesia",
        is_featured: true,
        metadata: {
          platform: 'shopee',
          seller_type: 'affiliate',
          affiliate_link: 'https://shopee.co.id/search?keyword=adidas+ultraboost',
          promo_badge: "Sport Essential",
          promo_type: "essential"
        }
      },
      {
        name: "iPhone 15 Pro Max 256GB",
        slug: "iphone-15-pro-max-256gb",
        description: "Apple's latest flagship smartphone with A17 Pro chip, titanium design, and 48MP camera.",
        price_cents: 2199900000,
        compare_at_cents: 2499900000,
        image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80",
        category_slug: "electronics",
        rating: 4.8,
        sold_count: 2341,
        stock: 0,
        location: "Indonesia",
        is_featured: true,
        metadata: {
          platform: 'lazada',
          seller_type: 'affiliate',
          affiliate_link: 'https://www.lazada.co.id/catalog/?q=iphone+15+pro+max',
          promo_badge: "Hot Item",
          promo_type: "hot"
        }
      },
      {
        name: "Cuisinart Air Fryer 5.5L",
        slug: "cuisinart-air-fryer-5-5l",
        description: "Healthy air fryer with large capacity, perfect for the whole family.",
        price_cents: 189900000,
        compare_at_cents: 239900000,
        image_url: "https://images.unsplash.com/photo-1585044602846-68f4a1e7a45c?w=400&q=80",
        category_slug: "home",
        rating: 4.6,
        sold_count: 543,
        stock: 0,
        location: "Indonesia",
        is_featured: false,
        metadata: {
          platform: 'bukalapak',
          seller_type: 'affiliate',
          affiliate_link: 'https://www.bukalapak.com/products?search%5Bkeywords%5D=air+fryer',
          promo_badge: "Kitchen Must-Have",
          promo_type: "essential"
        }
      },
      {
        name: "Innisfree Green Tea Cleanser",
        slug: "innisfree-green-tea-cleanser",
        description: "Gentle, hydrating cleanser with organic green tea from Jeju Island.",
        price_cents: 19900000,
        compare_at_cents: 24900000,
        image_url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80",
        category_slug: "beauty",
        rating: 4.5,
        sold_count: 1892,
        stock: 0,
        location: "Indonesia",
        is_featured: false,
        metadata: {
          platform: 'blibli',
          seller_type: 'affiliate',
          affiliate_link: 'https://www.blibli.com/cari?search=innisfree+green+tea',
          promo_badge: "K-Beauty",
          promo_type: "trending"
        }
      },
      {
        name: "Adjustable Dumbbell Set 40kg",
        slug: "adjustable-dumbbell-set-40kg",
        description: "Space-saving adjustable dumbbells perfect for home workouts.",
        price_cents: 175000000,
        compare_at_cents: 225000000,
        image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
        category_slug: "sports",
        rating: 4.6,
        sold_count: 112,
        stock: 0,
        location: "Indonesia",
        is_featured: false,
        metadata: {
          platform: 'amazon',
          seller_type: 'affiliate',
          affiliate_link: 'https://www.amazon.com/s?k=adjustable+dumbbells',
          promo_badge: "Home Gym",
          promo_type: "fitness"
        }
      },
      {
        name: "Korean Drama Novel Collection",
        slug: "korean-drama-novel-collection",
        description: "Popular K-drama adaptations in novel form, perfect for book lovers.",
        price_cents: 4500000,
        compare_at_cents: 6000000,
        image_url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80",
        category_slug: "books",
        rating: 4.4,
        sold_count: 203,
        stock: 0,
        location: "Indonesia",
        is_featured: false,
        metadata: {
          platform: 'ebay',
          seller_type: 'affiliate',
          affiliate_link: 'https://www.ebay.com/sch/i.html?_nkw=korean+novel',
          promo_badge: "Trending Read",
          promo_type: "trending"
        }
      },
      {
        name: "Smart Watch Series X with GPS",
        slug: "smart-watch-series-x-with-gps",
        description: "Feature-packed smartwatch with all health and fitness tracking.",
        price_cents: 325000000,
        compare_at_cents: 450000000,
        image_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80",
        category_slug: "electronics",
        rating: 4.7,
        sold_count: 87,
        stock: 0,
        location: "Indonesia",
        is_featured: true,
        metadata: {
          platform: 'shopee',
          seller_type: 'affiliate',
          affiliate_link: 'https://shopee.co.id/search?keyword=smart+watch',
          promo_badge: "Tech Deal",
          promo_type: "deal"
        }
      },
      {
        name: "Indoor Plant Pot Ceramic Set",
        slug: "indoor-plant-pot-ceramic-set",
        description: "Beautiful ceramic pots to make your indoor garden shine.",
        price_cents: 29000000,
        compare_at_cents: 39000000,
        image_url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80",
        category_slug: "home",
        rating: 4.5,
        sold_count: 176,
        stock: 0,
        location: "Indonesia",
        is_featured: false,
        metadata: {
          platform: 'tokopedia',
          seller_type: 'affiliate',
          affiliate_link: 'https://www.tokopedia.com/search?q=pot+tanaman+keramik',
          promo_badge: "Home Decor",
          promo_type: "decor"
        }
      }
    ];

    // Insert the sample products
    const { error } = await supabaseAdmin.from("products").insert(products);
    
    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: "Sample products (including affiliate products) added successfully!", count: products.length };
  });
