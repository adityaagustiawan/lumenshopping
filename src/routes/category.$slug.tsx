import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getCategory } from "@/lib/products.functions";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/products.functions";

// Sample products data for all categories - real e-commerce inspired!
const sampleProducts: Record<string, Product[]> = {
  electronics: [
    {
      id: "e1",
      slug: "sony-wh1000xm5",
      name: "Sony WH-1000XM5 Noise Cancelling Headphones",
      description: "Industry-leading noise cancellation with exceptional sound quality.",
      price_cents: 599900,
      compare_at_cents: 749900,
      image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
      category_slug: "electronics",
      rating: 4.9,
      sold_count: 1254,
      stock: 0,
      location: "Tokopedia",
      is_featured: true,
      platform: "tokopedia",
      seller_type: "affiliate",
      affiliate_link: "https://www.tokopedia.com/search?q=sony+wh1000xm5"
    },
    {
      id: "e2",
      slug: "apple-iphone-15-pro",
      name: "Apple iPhone 15 Pro Max 256GB",
      description: "The latest iPhone with titanium design and A17 Pro chip.",
      price_cents: 2199900,
      compare_at_cents: 2499900,
      image_url: "https://images.unsplash.com/photo-1592750470538-787ea4e2e1b8?w=400&q=80",
      category_slug: "electronics",
      rating: 4.8,
      sold_count: 2341,
      stock: 0,
      location: "Shopee",
      is_featured: true,
      platform: "shopee",
      seller_type: "affiliate",
      affiliate_link: "https://shopee.co.id/search?keyword=iphone+15+pro+max"
    },
    {
      id: "e3",
      slug: "samsung-galaxy-watch-6",
      name: "Samsung Galaxy Watch 6 Classic",
      description: "Smartwatch with rotating bezel and advanced health tracking.",
      price_cents: 449900,
      compare_at_cents: 549900,
      image_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80",
      category_slug: "electronics",
      rating: 4.7,
      sold_count: 876,
      stock: 0,
      location: "Lazada",
      is_featured: false,
      platform: "lazada",
      seller_type: "affiliate",
      affiliate_link: "https://www.lazada.co.id/catalog/?q=galaxy+watch+6"
    },
    {
      id: "e4",
      slug: "macbook-air-m2",
      name: "Apple MacBook Air M2 13.6 inch",
      description: "Thin and light laptop with powerful M2 chip.",
      price_cents: 1349900,
      compare_at_cents: 1599900,
      image_url: "https://images.unsplash.com/photo-1517336714731-4896decb346d?w=400&q=80",
      category_slug: "electronics",
      rating: 4.9,
      sold_count: 567,
      stock: 0,
      location: "Blibli",
      is_featured: false,
      platform: "blibli",
      seller_type: "affiliate",
      affiliate_link: "https://www.blibli.com/cari?search=macbook+air+m2"
    },
    {
      id: "e5",
      slug: "airpods-pro-2",
      name: "Apple AirPods Pro 2nd Generation",
      description: "Wireless earbuds with MagSafe and Transparency mode.",
      price_cents: 329900,
      compare_at_cents: 399900,
      image_url: "https://images.unsplash.com/photo-1600267214827-459246976967?w=400&q=80",
      category_slug: "electronics",
      rating: 4.8,
      sold_count: 1893,
      stock: 0,
      location: "Bukalapak",
      is_featured: false,
      platform: "bukalapak",
      seller_type: "affiliate",
      affiliate_link: "https://www.bukalapak.com/products?search%5Bkeywords%5D=airpods+pro+2"
    },
    {
      id: "e6",
      slug: "playstation-5",
      name: "Sony PlayStation 5 Digital Edition",
      description: "Next-gen gaming console with stunning graphics.",
      price_cents: 849900,
      compare_at_cents: 999900,
      image_url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80",
      category_slug: "electronics",
      rating: 4.9,
      sold_count: 201,
      stock: 0,
      location: "Amazon",
      is_featured: false,
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/s?k=playstation+5+digital+edition"
    },
    {
      id: "e7",
      slug: "logitech-mx-master-3s",
      name: "Logitech MX Master 3S Wireless Mouse",
      description: "Ergonomic wireless mouse with 8K DPI and quiet clicks. Perfect for productivity.",
      price_cents: 139900,
      compare_at_cents: 169900,
      image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
      category_slug: "electronics",
      rating: 4.8,
      sold_count: 1456,
      stock: 0,
      location: "Amazon",
      is_featured: true,
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/Logitech-MX-Master-3S-Graphite/dp/B09HM94VDS"
    },
    {
      id: "e8",
      slug: "anker-powercore-26800",
      name: "Anker PowerCore 26800mAh Power Bank",
      description: "High-capacity portable charger with 3 USB ports for multiple devices.",
      price_cents: 89900,
      compare_at_cents: 119900,
      image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80",
      category_slug: "electronics",
      rating: 4.7,
      sold_count: 3421,
      stock: 0,
      location: "eBay",
      is_featured: false,
      platform: "ebay",
      seller_type: "affiliate",
      affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=anker+powercore+26800"
    },
    {
      id: "e9",
      slug: "xiaomi-redmi-buds-4-pro",
      name: "Xiaomi Redmi Buds 4 Pro",
      description: "Wireless earbuds with ANC, Bluetooth 5.3, and dual device connection.",
      price_cents: 109900,
      compare_at_cents: 149900,
      image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
      category_slug: "electronics",
      rating: 4.5,
      sold_count: 2134,
      stock: 0,
      location: "AliExpress",
      is_featured: false,
      platform: "aliexpress",
      seller_type: "affiliate",
      affiliate_link: "https://www.aliexpress.com/w/wholesale-xiaomi-redmi-buds-4-pro.html"
    },
    {
      id: "e10",
      slug: "baseus-100w-usb-c-cable",
      name: "Baseus 100W USB-C Fast Charging Cable",
      description: "High-speed charging cable with 100W power delivery, 2m length.",
      price_cents: 24900,
      compare_at_cents: 39900,
      image_url: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&q=80",
      category_slug: "electronics",
      rating: 4.6,
      sold_count: 5678,
      stock: 0,
      location: "AliExpress",
      is_featured: false,
      platform: "aliexpress",
      seller_type: "affiliate",
      affiliate_link: "https://www.aliexpress.com/w/wholesale-baseus-100w-usb-c-cable.html"
    },
    {
      id: "e11",
      slug: "keychron-k8-pro",
      name: "Keychron K8 Pro Wireless Mechanical Keyboard",
      description: "Hot-swappable mechanical keyboard with RGB backlight and wireless connectivity.",
      price_cents: 149900,
      compare_at_cents: 189900,
      image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",
      category_slug: "electronics",
      rating: 4.8,
      sold_count: 876,
      stock: 0,
      location: "Amazon",
      is_featured: true,
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/s?k=keychron+k8+pro"
    },
    {
      id: "e12",
      slug: "tp-link-archer-ax73",
      name: "TP-Link Archer AX73 WiFi 6 Router",
      description: "Dual-band WiFi 6 router with 5400 Mbps speed and OneMesh support.",
      price_cents: 179900,
      compare_at_cents: 229900,
      image_url: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&q=80",
      category_slug: "electronics",
      rating: 4.7,
      sold_count: 654,
      stock: 0,
      location: "Amazon",
      is_featured: false,
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/TP-Link-AX5400-WiFi-Router/dp/B08KTXG8Q5"
    },
    {
      id: "e13",
      slug: "sandisk-extreme-1tb",
      name: "SanDisk Extreme Portable SSD 1TB",
      description: "Rugged external SSD with 1050MB/s read speed and IP55 water resistance.",
      price_cents: 169900,
      compare_at_cents: 219900,
      image_url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=80",
      category_slug: "electronics",
      rating: 4.9,
      sold_count: 1234,
      stock: 0,
      location: "eBay",
      is_featured: false,
      platform: "ebay",
      seller_type: "affiliate",
      affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=sandisk+extreme+portable+ssd+1tb"
    },
    {
      id: "e14",
      slug: "bose-quietcomfort-45",
      name: "Bose QuietComfort 45 Headphones",
      description: "Premium noise-cancelling headphones with 24-hour battery life.",
      price_cents: 449900,
      compare_at_cents: 549900,
      image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80",
      category_slug: "electronics",
      rating: 4.8,
      sold_count: 987,
      stock: 0,
      location: "Amazon",
      is_featured: true,
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/Bose-QuietComfort-Wireless-Headphones-Cancelling/dp/B098FKXT8L"
    },
    {
      id: "e15",
      slug: "gopro-hero-12",
      name: "GoPro HERO12 Black Action Camera",
      description: "Waterproof 5.3K60 action camera with HyperSmooth 6.0 stabilization.",
      price_cents: 649900,
      compare_at_cents: 799900,
      image_url: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&q=80",
      category_slug: "electronics",
      rating: 4.7,
      sold_count: 543,
      stock: 0,
      location: "eBay",
      is_featured: false,
      platform: "ebay",
      seller_type: "affiliate",
      affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=gopro+hero+12+black"
    },
    {
      id: "e16",
      slug: "ring-video-doorbell",
      name: "Ring Video Doorbell Pro 2",
      description: "Smart doorbell with 1536p HD video, 3D motion detection, and Alexa integration.",
      price_cents: 349900,
      compare_at_cents: 429900,
      image_url: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80",
      category_slug: "electronics",
      rating: 4.6,
      sold_count: 1876,
      stock: 0,
      location: "Amazon",
      is_featured: false,
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/Ring-Video-Doorbell-Pro-2/dp/B086Q54K53"
    },
  ],
  fashion: [
    {
      id: "f1",
      slug: "nike-air-jordan-1",
      name: "Nike Air Jordan 1 Retro High OG",
      description: "Classic sneaker that never goes out of style.",
      price_cents: 219900,
      compare_at_cents: 289900,
      image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
      category_slug: "fashion",
      rating: 4.8,
      sold_count: 1543,
      stock: 0,
      location: "Shopee",
      is_featured: true,
      platform: "shopee",
      seller_type: "affiliate",
      affiliate_link: "https://shopee.co.id/search?keyword=nike+air+jordan+1"
    },
    {
      id: "f2",
      slug: "minimalist-t-shirt",
      name: "Minimalist Cotton T-Shirt Unisex",
      description: "Comfortable 100% organic cotton tee in multiple colors.",
      price_cents: 8990,
      compare_at_cents: 12990,
      image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
      category_slug: "fashion",
      rating: 4.5,
      sold_count: 3421,
      stock: 85,
      location: "Lumen Store",
      is_featured: true,
      platform: "own-store",
      seller_type: "own-store"
    },
  ],
  home: [
    {
      id: "h1",
      slug: "ergonomic-office-chair",
      name: "Premium Ergonomic Office Chair",
      description: "Comfortable chair with lumbar support for long work days.",
      price_cents: 249900,
      compare_at_cents: 349900,
      image_url: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0a1?w=400&q=80",
      category_slug: "home",
      rating: 4.7,
      sold_count: 765,
      stock: 12,
      location: "Lumen Store",
      is_featured: true,
      platform: "own-store",
      seller_type: "own-store"
    },
    {
      id: "h2",
      slug: "air-fryer-5.5l",
      name: "Air Fryer 5.5L Digital",
      description: "Healthy cooking with little to no oil.",
      price_cents: 149900,
      compare_at_cents: 199900,
      image_url: "https://images.unsplash.com/photo-1585044602846-68f4a1e7a45c?w=400&q=80",
      category_slug: "home",
      rating: 4.6,
      sold_count: 987,
      stock: 0,
      location: "Tokopedia",
      is_featured: true,
      platform: "tokopedia",
      seller_type: "affiliate",
      affiliate_link: "https://www.tokopedia.com/search?q=air+fryer+5.5l"
    },
  ],
  beauty: [
    {
      id: "b1",
      slug: "skincare-bundle",
      name: "Korean Skincare Essentials Bundle",
      description: "Complete 5-step routine for glowing skin.",
      price_cents: 22490,
      compare_at_cents: 29990,
      image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80",
      category_slug: "beauty",
      rating: 4.9,
      sold_count: 2134,
      stock: 0,
      location: "Shopee",
      is_featured: true,
      platform: "shopee",
      seller_type: "affiliate",
      affiliate_link: "https://shopee.co.id/search?keyword=korean+skincare+bundle"
    },
  ],
  sports: [
    {
      id: "s1",
      slug: "adjustable-dumbbell-set",
      name: "Adjustable Dumbbell Set (10kg - 40kg)",
      description: "Space-saving solution for home workouts.",
      price_cents: 17490,
      compare_at_cents: 22490,
      image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
      category_slug: "sports",
      rating: 4.7,
      sold_count: 876,
      stock: 18,
      location: "Lumen Store",
      is_featured: false,
      platform: "own-store",
      seller_type: "own-store"
    },
  ],
  books: [
    {
      id: "bk1",
      slug: "bestselling-novel-collection",
      name: "Bestselling Novel Collection (Set of 5)",
      description: "Must-read books for book lovers.",
      price_cents: 4490,
      compare_at_cents: 5990,
      image_url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80",
      category_slug: "books",
      rating: 4.5,
      sold_count: 1567,
      stock: 0,
      location: "Tokopedia",
      is_featured: false,
      platform: "tokopedia",
      seller_type: "affiliate",
      affiliate_link: "https://www.tokopedia.com/search?q=bestselling+novels"
    },
  ]
};

const categoryQuery = (slug: string) => queryOptions({
  queryKey: ["category", slug],
  queryFn: () => getCategory({ data: { slug } }),
});

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Lumen` },
      { name: "description", content: `Browse ${params.slug} products on Lumen.` },
    ],
  }),
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(categoryQuery(params.slug));
    if (!data.category) throw notFound();
    return data;
  },
  component: CategoryPage,
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">Category not found.</div>,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(categoryQuery(slug));
  
  // If no products from DB, use our sample data!
  const productsToShow = data.products.length > 0 
    ? data.products 
    : (sampleProducts[slug as keyof typeof sampleProducts] || []);
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Category</p>
        <h1 className="font-display text-4xl mt-1">{data.category?.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{productsToShow.length} products</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {productsToShow.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
