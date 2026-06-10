import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCw, Database, Zap, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getProductSources, syncProductsFromSource, createConnectorConfig, createProductSource } from "@/lib/product-sync.functions";
import { seedSampleProducts } from "@/lib/seed-products.functions";
import { ConnectorFactory } from "@/lib/connectors/connector-factory";

export const Route = createFileRoute("/_authenticated/product-sync")({
  component: ProductSyncPage,
});

function ProductSyncPage() {
  const queryClient = useQueryClient();
  const [isCreatingConnector, setIsCreatingConnector] = useState(false);
  const [platform, setPlatform] = useState("woocommerce");
  const [syncingSource, setSyncingSource] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const availablePlatforms = ConnectorFactory.getAvailablePlatforms();
  
  const sourcesQuery = useSuspenseQuery({
    queryKey: ["productSources"],
    queryFn: () => getProductSources(),
  });
  
  const handleSyncSource = async (sourceId: string) => {
    setSyncingSource(sourceId);
    try {
      await syncProductsFromSource({ product_source_id: sourceId });
      await queryClient.invalidateQueries({ queryKey: ["productSources"] });
      alert("Sync complete! 🎉");
    } catch (error) {
      alert(`Sync failed: ${(error as Error).message}`);
    } finally {
      setSyncingSource(null);
    }
  };

  const handleSeedProducts = async () => {
    setIsSeeding(true);
    try {
      const result = await seedSampleProducts();
      alert(`${result.message} Added ${result.count} products!`);
      await queryClient.invalidateQueries({ queryKey: ["home"] }); // Refresh homepage
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] }); // Refresh dashboard
    } catch (error) {
      alert(`Seeding failed: ${(error as Error).message}`);
    } finally {
      setIsSeeding(false);
    }
  };
  
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl mb-2">Product Sync Dashboard</h1>
        <p className="text-muted-foreground">Connect your e-commerce platforms and sync products automatically.</p>
      </div>
      
      {isCreatingConnector && (
        <div className="mb-8 p-6 bg-card border rounded-xl">
          <h2 className="font-semibold mb-4">Connect a New Platform</h2>
          <NewConnectorForm 
            onCancel={() => setIsCreatingConnector(false)} 
            onSuccess={() => {
              setIsCreatingConnector(false);
              queryClient.invalidateQueries({ queryKey: ["productSources"] });
            }}
            initialPlatform={platform}
            setPlatform={setPlatform}
          />
        </div>
      )}
      
      {!isCreatingConnector && (
        <div className="mb-8 flex gap-3">
          <Button onClick={() => setIsCreatingConnector(true)}>
            <Plus className="w-4 h-4 mr-2" /> Connect New Store
          </Button>
          <Button variant="secondary" onClick={handleSeedProducts} disabled={isSeeding}>
            <Sparkles className={`w-4 h-4 mr-2 ${isSeeding ? "animate-spin" : ""}`} />
            {isSeeding ? "Seeding..." : "Seed Sample Products"}
          </Button>
        </div>
      )}
      
      <div className="space-y-4">
        <h2 className="font-semibold text-xl">Your Product Sources</h2>
        {sourcesQuery.data && sourcesQuery.data.length === 0 ? (
          <div className="text-center p-12 bg-card border rounded-xl">
            <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No product sources connected</h3>
            <p className="text-muted-foreground text-sm">Connect your first e-commerce store to start syncing products!</p>
          </div>
        ) : (
          sourcesQuery.data?.map((source: any) => (
            <ProductSourceCard 
              key={source.id} 
              source={source} 
              onSync={handleSyncSource} 
              isSyncing={syncingSource === source.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Product Source Card Component
function ProductSourceCard({ source, onSync, isSyncing }: { source: any; onSync: (id: string) => void; isSyncing: boolean }) {
  const lastSync = source.last_sync_at;
  const lastSyncStatus = source.last_sync_status;
  const platformLabel = ConnectorFactory.getAvailablePlatforms().find(p => p.value === source.platform)?.label || source.platform;
  
  return (
    <div className="bg-card border rounded-xl p-6 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold">{source.name}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">{platformLabel}</span>
          {source.is_active ? (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">Active</span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">Inactive</span>
          )}
        </div>
        
        {lastSync && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Zap className="w-3 h-3" />
            Last sync: {new Date(lastSync).toLocaleString()}
            {lastSyncStatus === "success" ? (
              <CheckCircle className="w-3 h-3 text-green-600" />
            ) : (
              <XCircle className="w-3 h-3 text-red-600" />
            )}
          </div>
        )}
      </div>
      
      <Button onClick={() => onSync(source.id)} disabled={isSyncing}>
        <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
        {isSyncing ? "Syncing..." : "Sync Now"}
      </Button>
    </div>
  );
}

// New Connector Form
function NewConnectorForm({ onCancel, onSuccess, initialPlatform, setPlatform }: { onCancel: () => void; onSuccess: () => void; initialPlatform: string; setPlatform: (p: string) => void }) {
  const [name, setName] = useState("");
  const [config, setConfig] = useState({ storeUrl: "", consumerKey: "", consumerSecret: "" });
  const [loading, setLoading] = useState(false);
  const availablePlatforms = ConnectorFactory.getAvailablePlatforms();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Step 1: Create connector config
      const newConfig = await createConnectorConfig({
        name,
        platform: initialPlatform as any,
        config,
      });
      
      // Step 2: Create product source
      await createProductSource({
        name,
        connector_config_id: newConfig.id,
        platform: initialPlatform as any,
      });
      
      onSuccess();
    } catch (error) {
      alert(`Failed to connect: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Platform</label>
          <select 
            className="w-full p-2 border rounded-lg"
            value={initialPlatform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            {availablePlatforms.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Store Name</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My WooCommerce Store"
            required
          />
        </div>
      </div>
      
      {initialPlatform === "woocommerce" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Store URL</label>
            <input 
              type="url" 
              className="w-full p-2 border rounded-lg"
              value={config.storeUrl}
              onChange={(e) => setConfig({ ...config, storeUrl: e.target.value })}
              placeholder="https://yourstore.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Consumer Key</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-lg"
              value={config.consumerKey}
              onChange={(e) => setConfig({ ...config, consumerKey: e.target.value })}
              placeholder="ck_xxxxxxxxxx"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Consumer Secret</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded-lg"
              value={config.consumerSecret}
              onChange={(e) => setConfig({ ...config, consumerSecret: e.target.value })}
              placeholder="cs_xxxxxxxxxx"
              required
            />
          </div>
        </div>
      )}
      
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Connecting..." : "Connect Store"}
        </Button>
      </div>
    </form>
  );
}
