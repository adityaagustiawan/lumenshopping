import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { getCart, updateCartItem, removeCartItem } from "@/lib/cart.functions";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your cart — Lumen" }] }),
  component: CartPage,
});

function CartPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["cart"], queryFn: () => getCart(), enabled: !!user,
  });

  const upd = useMutation({
    mutationFn: (v: { id: string; quantity: number }) => updateCartItem({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
  const rm = useMutation({
    mutationFn: (id: string) => removeCartItem({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cart"] }); toast.success("Removed"); },
  });

  if (loading) return <div className="p-8" />;
  if (!user) return (
    <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
      <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground" />
      <h1 className="font-display text-3xl">Sign in to view your cart</h1>
      <Button onClick={() => navigate({ to: "/auth" })} className="rounded-full">Sign in</Button>
    </div>
  );

  const items = data?.items ?? [];
  const total = items.reduce((s, i: any) => s + (i.product?.price_cents ?? 0) * i.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="font-display text-4xl mb-6">Your cart</h1>
      {isLoading ? <p className="text-muted-foreground">Loading...</p> :
       items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-3">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="rounded-full"><Link to="/">Start shopping</Link></Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-3">
            {items.map((i: any) => (
              <div key={i.id} className="flex gap-4 bg-card border border-border/60 rounded-2xl p-3">
                <Link to="/product/$slug" params={{ slug: i.product.slug }} className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0">
                  <img src={i.product.image_url} alt={i.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to="/product/$slug" params={{ slug: i.product.slug }} className="text-sm font-medium line-clamp-2">{i.product.name}</Link>
                  <p className="text-base font-semibold mt-1">{formatIDR(i.product.price_cents)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => i.quantity > 1 && upd.mutate({ id: i.id, quantity: i.quantity - 1 })} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-secondary"><Minus className="w-3 h-3" /></button>
                    <span className="w-6 text-center text-sm">{i.quantity}</span>
                    <button onClick={() => upd.mutate({ id: i.id, quantity: i.quantity + 1 })} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-secondary"><Plus className="w-3 h-3" /></button>
                    <button onClick={() => rm.mutate(i.id)} className="ml-auto text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border/60 rounded-2xl p-5 h-fit sticky top-20 space-y-4">
            <h2 className="font-medium">Order summary</h2>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatIDR(total)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="text-success">Free</span></div>
            <div className="border-t border-border pt-3 flex justify-between font-semibold"><span>Total</span><span>{formatIDR(total)}</span></div>
            <Button className="w-full rounded-full h-11" onClick={() => toast.success("Checkout flow coming soon")}>Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
}
