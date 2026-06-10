// Universal Product Schema (normalized across all platforms)
export type NormalizedProduct = {
  external_id: string; // ID from external platform
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  compare_at_cents: number | null;
  image_url: string;
  additional_images?: string[];
  category_slug: string;
  rating: number;
  sold_count: number;
  stock: number;
  location: string;
  is_featured: boolean;
  metadata?: Record<string, unknown>;
};

// Supported platforms enum
export type EcommercePlatform =
  | "medusa"
  | "saleor"
  | "vendure"
  | "spree"
  | "prestashop"
  | "magento"
  | "woocommerce";

// Connector interface that all platform connectors must implement
export interface IEcommerceConnector {
  platform: EcommercePlatform;
  name: string;
  
  // Initialize the connector with configuration
  initialize(config: Record<string, unknown>): Promise<void>;
  
  // Test the connection
  testConnection(): Promise<{ success: boolean; message: string }>;
  
  // Fetch all products from the platform
  fetchProducts(options?: { limit?: number; offset?: number }): Promise<{
    products: NormalizedProduct[];
    total: number;
    hasMore: boolean;
  }>;
  
  // Fetch a single product by external ID
  fetchProduct(externalId: string): Promise<NormalizedProduct | null>;
  
  // (Optional) Sync inventory
  syncInventory?(productIds: string[]): Promise<Record<string, number>>;
  
  // (Optional) Sync orders
  syncOrders?(options?: { since?: Date }): Promise<unknown[]>;
}

// Sync result type
export type SyncResult = {
  sourceId: string;
  success: boolean;
  message: string;
  productsAdded: number;
  productsUpdated: number;
  productsRemoved: number;
  startedAt: Date;
  completedAt: Date;
  errorDetails?: Record<string, unknown>;
};
