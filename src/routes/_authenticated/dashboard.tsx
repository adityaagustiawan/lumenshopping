import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, CartesianGrid } from "recharts";
import { Package, DollarSign, Users, ShoppingCart, TrendingUp, Database } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Lumen" }] }),
  component: DashboardPage,
});

const data = [
  { name: "Jan", sales: 4000, revenue: 2400 },
  { name: "Feb", sales: 3000, revenue: 1398 },
  { name: "Mar", sales: 2000, revenue: 9800 },
  { name: "Apr", sales: 2780, revenue: 3908 },
  { name: "May", sales: 1890, revenue: 4800 },
  { name: "Jun", sales: 2390, revenue: 3800 },
];

function DashboardPage() {
  const products = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*");
      return data ?? [];
    },
  });

  const stats = [
    { title: "Total Revenue", value: "Rp 12.450.000", icon: DollarSign, trend: "+12.5%", color: "text-emerald-500" },
    { title: "Total Sales", value: "1,240", icon: ShoppingCart, trend: "+8.2%", color: "text-blue-500" },
    { title: "Active Products", value: products.data?.length ?? 0, icon: Package, trend: "0%", color: "text-orange-500" },
    { title: "Customers", value: "850", icon: Users, trend: "+5.1%", color: "text-purple-500" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Product Sync Shortcut */}
      <Card className="border-border/60 shadow-sm bg-gradient-to-r from-accent/10 to-accent/5">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/20 rounded-full">
              <Database className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Product Sync</h3>
              <p className="text-sm text-muted-foreground">Connect stores and sync products automatically</p>
            </div>
          </div>
          <Link to="/product-sync">
            <Button>Manage Sync</Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
              <div className="flex items-center pt-1">
                <span className="text-xs font-medium text-emerald-500 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> {stat.trend}
                </span>
                <span className="text-[10px] text-muted-foreground ml-1.5">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
            <CardDescription>Your monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value: number) => `Rp${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px"
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2} 
                  dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Products</CardTitle>
            <CardDescription>Your latest additions to the store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.isLoading ? (
                <p className="text-sm text-muted-foreground">Loading products...</p>
              ) : products.data?.slice(0, 5).map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 group">
                  <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden">
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category_slug}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Rp {(p.price_cents * 100).toLocaleString("id-ID")}</p>
                    <p className="text-[10px] text-emerald-500 font-medium">{p.sold_count} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

