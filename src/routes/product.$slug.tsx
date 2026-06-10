import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useMutation } from "@tanstack/react-query";
import { Star, MapPin, Shield, Truck } from "lucide-react";
import { toast } from "sonner";
import { getProduct } from "@/lib/products.functions";
import { addToCart } from "@/lib/cart.functions";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { formatIDR, formatCompact } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";

const productQuery = (slug: string) => queryOptions({
  queryKey: ["product", slug],
  queryFn: () => getProduct({ data: { slug } }),
});

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Lumen` },
      { name: "description", content: `View product ${params.slug} on Lumen.` },
    ],
  }),
  loader: async ({ context, params }) => {
    const d = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!d.product) throw notFound();
    return d;
  },
  component: ProductPage,
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">Product not found.</div>,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const { user } = useAuth();
  const navigate = useNavigate();
  const p = data.product!;
  const discount = p.compare_at_cents ? Math.round((1 - p.price_cents / p.compare_at_cents) * 100) : 0;

  const add = useMutation({
    mutationFn: () => addToCart({ data: { product_id: p.id, quantity: 1 } }),
    onSuccess: () => toast.success("Added to cart"),
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-12">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="rounded-3xl overflow-hidden bg-muted aspect-square">
          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.category_slug}</p>
            <h1 className="font-display text-4xl mt-1 leading-tight">{p.name}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-accent text-accent" /> {p.rating.toFixed(1)}</span>
              <span>{formatCompact(p.sold_count)} sold</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {p.location}</span>
            </div>
          </div>
          <div className="rounded-2xl bg-secondary p-5">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-semibold">{formatIDR(p.price_cents)}</span>
              {p.compare_at_cents && (
                <>
                  <span className="text-base text-muted-foreground line-through">{formatIDR(p.compare_at_cents)}</span>
                  <span className="text-xs bg-discount text-accent-foreground px-2 py-0.5 rounded-full">−{discount}%</span>
                </>
              )}
            </div>
          </div>
          <p className="text-foreground/80 leading-relaxed">{p.description}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Truck className="w-4 h-4" /> Free shipping over Rp 250.000</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Shield className="w-4 h-4" /> Buyer protection</div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              size="lg" className="flex-1 rounded-full"
              disabled={add.isPending}
              onClick={() => user ? add.mutate() : navigate({ to: "/auth" })}
            >
              {add.isPending ? "Adding..." : "Add to cart"}
            </Button>
            <Button
              size="lg" variant="outline" className="flex-1 rounded-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              onClick={() => navigate({ to: "/chat" })}
            >
              Ask Lumen
            </Button>
          </div>
        </div>
      </div>

      {data.related.length > 0 && (
        <section>
          <h2 className="font-display text-2xl mb-4">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {data.related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
