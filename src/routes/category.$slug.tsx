import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getCategory } from "@/lib/products.functions";
import { ProductCard } from "@/components/ProductCard";

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
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Category</p>
        <h1 className="font-display text-4xl mt-1">{data.category?.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{data.products.length} products</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {data.products.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
