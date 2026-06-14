import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Zap, ShoppingBag, MessageSquare, Store, ZapOff, ShoppingCart, Star } from "lucide-react";
import { getHomeData } from "@/lib/products.functions";
import { ProductCard } from "@/components/ProductCard";
import { TypingAnimation } from "@/components/TypingAnimation";
import { Marquee } from "@/components/ui/marquee";

const homeQuery = queryOptions({ queryKey: ["home"], queryFn: () => getHomeData() });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen — Modern Marketplace" },
      { name: "description", content: "Discover thoughtful products from trusted sellers. Shop with an AI assistant by your side." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  component: Home,
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

function Home() {
  const { data } = useSuspenseQuery(homeQuery);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/10 via-secondary to-muted p-8 sm:p-16">
        <div className="relative z-10 max-w-xl space-y-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-accent/20 text-accent">
            <Sparkles className="w-4 h-4" /> AI-powered shopping
          </span>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] text-foreground">
            A marketplace<br />that feels{" "}
            <TypingAnimation
              phrases={[
                "personal",
                "effortless",
                "intelligent",
                "trustworthy",
                "seamless",
                "innovative"
              ]}
              typingSpeed={120}
              deletingSpeed={60}
              pauseDuration={2000}
            />
            .
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Discover products from trusted sellers across Indonesia. Let Lumen,
            our AI assistant, help you find exactly what you need.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/category/$slug" params={{ slug: "electronics" }} className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20">
              Start shopping <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/chat" className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-card px-7 py-3.5 text-sm font-semibold hover:border-accent hover:bg-accent/5 transition-all">
              <MessageSquare className="w-4 h-4" /> Ask Lumen
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      </section>

      {/* Marquee Section */}
      <Marquee pauseOnHover={true} speed={40} className="mt-0">
        <div className="flex items-center gap-8 mx-4">
          {[ 
            { 
              text: "Shopee", 
              logo: <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="10" fill="#EE4D2D" />
                <path d="M24 12C17.373 12 12 17.373 12 24s5.373 12 12 12 12-5.373 12-12S30.627 12 24 12zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" fill="#fff" />
                <path d="M18 24h12M24 18v12" stroke="#EE4D2D" strokeWidth="2" strokeLinecap="round" />
              </svg>
            },
            { 
              text: "Tokopedia", 
              logo: <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="10" fill="#42B549" />
                <path d="M24 14c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="#fff" />
                <path d="M24 20v8M20 24h8" stroke="#42B549" strokeWidth="2" strokeLinecap="round" />
              </svg>
            },
            { 
              text: "Lazada", 
              logo: <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="10" fill="#0F146E" />
                <path d="M14 24l3 8h6l3-8M21 16h6M18 28h12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            },
            { 
              text: "Blibli", 
              logo: <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="10" fill="#3D7DCA" />
                <circle cx="24" cy="24" r="10" fill="#fff" />
                <circle cx="24" cy="24" r="5" fill="#3D7DCA" />
              </svg>
            },
            { 
              text: "Bukalapak", 
              logo: <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="10" fill="#FF0000" />
                <path d="M24 14c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 14c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" fill="#fff" />
              </svg>
            },
            { 
              text: "Amazon", 
              logo: <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="10" fill="#232F3E" />
                <path d="M12 28h24c2.209 0 4-1.791 4-4V20c0-2.209-1.791-4-4-4H12c-2.209 0-4 1.791-4 4v4c0 2.209 1.791 4 4 4z" fill="#fff" />
                <path d="M14 22h20M18 26h12" stroke="#232F3E" strokeWidth="2" strokeLinecap="round" />
                <path d="M24 32c-4.418 0-8-3.582-8-8h4c0 2.209 1.791 4 4 4s4-1.791 4-4h4c0 4.418-3.582 8-8 8z" fill="#FF9900" />
              </svg>
            },
            { 
              text: "eBay", 
              logo: <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="10" fill="#fff" />
                <text x="24" y="30" fontFamily="Arial Black, sans-serif" fontSize="14" fontWeight="bold" textAnchor="middle">
                  <tspan fill="#E53238">e</tspan>
                  <tspan fill="#0064D2">B</tspan>
                  <tspan fill="#F5AF02">a</tspan>
                  <tspan fill="#86B817">Y</tspan>
                </text>
              </svg>
            },
            { 
              text: "AliExpress", 
              logo: <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="10" fill="#FF4747" />
                <path d="M14 20h20M14 28h20M20 20v8" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              </svg>
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card border border-border/50 shadow-sm">
              {item.logo}
              <span className="text-lg font-semibold">{item.text}</span>
            </div>
          ))}
        </div>
      </Marquee>

      {/* Categories */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl">Browse categories</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {data.categories.map((c) => (
            <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="rounded-2xl bg-card border border-border/50 p-6 text-center hover:border-accent hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{categoryEmoji(c.slug)}</div>
              <div className="text-sm font-semibold">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl">Featured today</h2>
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent" /> Curated by Lumen
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Trending */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display text-3xl">Trending now</h2>
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-500" /> Hot this week
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.trending.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Public Ad Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 sm:p-12 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-5xl">Ready to elevate your shopping experience?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Connect your store, sync products, and let our AI help you reach more customers!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/product-sync" className="inline-flex items-center gap-2 rounded-full bg-white text-indigo-600 px-8 py-4 text-sm font-bold hover:bg-white/90 transition shadow-2xl">
              <ShoppingBag className="w-5 h-5" /> Sync your products
            </Link>
            <Link to="/chat" className="inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 text-sm font-bold hover:bg-white/10 transition">
              <MessageSquare className="w-5 h-5" /> Ask how it works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function categoryEmoji(slug: string) {
  return {
    electronics: "📱",
    fashion: "👕",
    home: "🛋️",
    beauty: "✨",
    sports: "🏋️",
    books: "📚",
    toys: "🧸",
    food: "🍕",
    automotive: "🚗",
    pets: "🐾"
  }[slug] ?? "🛍️";
}

// Marquee added at the top with real e-commerce logos
