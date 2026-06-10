import { BaseEcommerceConnector } from "./base-connector";
import type { NormalizedProduct } from "./types";

export class WooCommerceConnector extends BaseEcommerceConnector {
  platform = "woocommerce" as const;
  name = "WooCommerce";
  
  private apiUrl: string = "";
  private consumerKey: string = "";
  private consumerSecret: string = "";
  
  async initialize(config: Record<string, unknown>): Promise<void> {
    this.validateConfig(config, ["storeUrl", "consumerKey", "consumerSecret"]);
    
    this.apiUrl = (config.storeUrl as string).replace(/\/$/, "") + "/wp-json/wc/v3";
    this.consumerKey = config.consumerKey as string;
    this.consumerSecret = config.consumerSecret as string;
    this.isInitialized = true;
  }
  
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.handleFetch(
        `${this.apiUrl}/products?per_page=1&consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}`
      );
      return { success: true, message: "Connection successful!" };
    } catch (error) {
      return { 
        success: false, 
        message: `Connection failed: ${(error as Error).message}` 
      };
    }
  }
  
  async fetchProducts(options?: { limit?: number; offset?: number }): Promise<{
    products: NormalizedProduct[];
    total: number;
    hasMore: boolean;
  }> {
    const perPage = options?.limit || 100;
    const page = (options?.offset || 0) / perPage + 1;
    
    const data = await this.handleFetch<Record<string, unknown>[]>(
      `${this.apiUrl}/products?per_page=${perPage}&page=${page}&consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}`
    );
    
    const products = data.map((item) => this.normalizeProduct(item));
    
    // For simplicity, assume hasMore is true if we got a full page
    const hasMore = data.length === perPage;
    
    return { products, total: products.length, hasMore };
  }
  
  async fetchProduct(externalId: string): Promise<NormalizedProduct | null> {
    try {
      const data = await this.handleFetch<Record<string, unknown>>(
        `${this.apiUrl}/products/${externalId}?consumer_key=${this.consumerKey}&consumer_secret=${this.consumerSecret}`
      );
      return this.normalizeProduct(data);
    } catch {
      return null;
    }
  }
  
  private normalizeProduct(item: Record<string, unknown>): NormalizedProduct {
    const name = (item.name as string) || "Unnamed Product";
    const images = item.images as Record<string, unknown>[] || [];
    const imageUrl = images[0]?.src as string || "";
    
    return {
      external_id: item.id as string,
      name,
      slug: this.generateSlug(name),
      description: (item.description as string) || "",
      price_cents: this.normalizePrice((item.price as string) || "0"),
      compare_at_cents: item.sale_price 
        ? this.normalizePrice((item.sale_price as string)) 
        : null,
      image_url: imageUrl,
      additional_images: images.slice(1).map((img) => img.src as string),
      category_slug: "uncategorized",
      rating: parseFloat((item.average_rating as string) || "0"),
      sold_count: (item.total_sales as number) || 0,
      stock: (item.stock_quantity as number) || 0,
      location: "Online Store",
      is_featured: (item.featured as boolean) || false,
      metadata: item,
    };
  }
}
