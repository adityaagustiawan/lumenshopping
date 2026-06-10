import type { IEcommerceConnector, NormalizedProduct, EcommercePlatform } from "./types";
import { z } from "zod";

// Base class with common utilities
export abstract class BaseEcommerceConnector implements IEcommerceConnector {
  abstract platform: EcommercePlatform;
  abstract name: string;
  
  protected config: Record<string, unknown> = {};
  protected isInitialized: boolean = false;
  
  abstract initialize(config: Record<string, unknown>): Promise<void>;
  abstract testConnection(): Promise<{ success: boolean; message: string }>;
  abstract fetchProducts(options?: { limit?: number; offset?: number }): Promise<{
    products: NormalizedProduct[];
    total: number;
    hasMore: boolean;
  }>;
  abstract fetchProduct(externalId: string): Promise<NormalizedProduct | null>;
  
  // Utility: Generate a slug from product name
  protected generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  }
  
  // Utility: Normalize price to cents (e.g., $19.99 → 1999)
  protected normalizePrice(price: number | string): number {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return Math.round(numPrice * 100);
  }
  
  // Utility: Validate configuration
  protected validateConfig(config: Record<string, unknown>, requiredFields: string[]): void {
    const missingFields = requiredFields.filter((field) => !config[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required config fields: ${missingFields.join(", ")}`);
    }
  }
  
  // Utility: Handle common fetch errors
  protected async handleFetch<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    
    return await response.json() as T;
  }
}
