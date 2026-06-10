import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import { getHomeData } from "@/lib/products.functions";
import { ProductCard } from "@/components/ProductCard";

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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary to-muted p-8 sm:p-14">
        <div className="max-w-xl space-y-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">
            <Sparkles className="w-3.5 h-3.5" /> AI-powered shopping
          </span>
          <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] text-foreground">
            A marketplace<br />that feels <em>personal</em>.
          </h1>
          <p className="text-muted-foreground max-w-md">
            Discover products from trusted sellers across Indonesia. Let Lumen,
            our AI assistant, help you find exactly what you need.
          </p>
          <div className="flex gap-3 pt-1">
            <Link to="/category/$slug" params={{ slug: "electronics" }} className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
              Start shopping <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/chat" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium hover:border-accent transition">
              Ask Lumen
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="font-display text-2xl mb-4">Categories</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {data.categories.map((c) => (
            <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="rounded-2xl bg-card border border-border/60 p-4 text-center hover:border-accent hover:-translate-y-0.5 transition-all">
              <div className="text-xl mb-1.5">{categoryEmoji(c.slug)}</div>
              <div className="text-xs font-medium">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-2xl">Featured today</h2>
          <span className="text-xs text-muted-foreground">Curated by Lumen</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {data.featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Trending */}
      <section>
        <h2 className="font-display text-2xl mb-4">Trending now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {data.trending.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </div>
  );
}

function categoryEmoji(slug: string) {
  return { electronics: "📱", fashion: "👕", home: "🛋️", beauty: "✨", sports: "🏋️", books: "📚" }[slug] ?? "🛍️";
}
