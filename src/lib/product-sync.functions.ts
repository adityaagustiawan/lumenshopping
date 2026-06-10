import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ConnectorFactory } from "./connectors/connector-factory";
import type { NormalizedProduct, EcommercePlatform } from "./connectors/types";

// 1. Create Connector Config
export const createConnectorConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      name: z.string(),
      platform: z.enum(["medusa", "saleor", "vendure", "spree", "prestashop", "magento", "woocommerce"]),
      config: z.record(z.unknown()),
    }).parse(d)
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Test connection first
    const connector = ConnectorFactory.createConnector(data.platform as EcommercePlatform);
    await connector.initialize(data.config);
    const testResult = await connector.testConnection();
    
    if (!testResult.success) {
      throw new Error(`Failed to connect: ${testResult.message}`);
    }
    
    const { data: config, error } = await supabaseAdmin
      .from("connector_configs")
      .insert({
        user_id: context.userId,
        platform: data.platform,
        config: data.config,
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return config;
  });

// 2. Create Product Source
export const createProductSource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      name: z.string(),
      connector_config_id: z.string(),
      platform: z.enum(["medusa", "saleor", "vendure", "spree", "prestashop", "magento", "woocommerce"]),
    }).parse(d)
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const { data: source, error } = await supabaseAdmin
      .from("product_sources")
      .insert({
        name: data.name,
        user_id: context.userId,
        connector_config_id: data.connector_config_id,
        platform: data.platform,
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return source;
  });

// 3. Sync Products from Source
export const syncProductsFromSource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      product_source_id: z.string(),
    }).parse(d)
  )
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // 1. Start sync log
    const { data: syncLog, error: logError } = await supabaseAdmin
      .from("product_sync_logs")
      .insert({
        product_source_id: data.product_source_id,
        status: "in_progress",
      })
      .select()
      .single();
    
    if (logError) throw new Error(logError.message);
    
    let productsAdded = 0;
    let productsUpdated = 0;
    let productsRemoved = 0;
    
    try {
      // 2. Fetch product source and connector config
      const [sourceResult, configResult] = await Promise.all([
        supabaseAdmin.from("product_sources").select("*").eq("id", data.product_source_id).single(),
        supabaseAdmin.from("connector_configs").select("*").eq("id", data.product_source_id).single(),
      ]);
      
      if (sourceResult.error) throw new Error(sourceResult.error.message);
      if (configResult.error) throw new Error(configResult.error.message);
      
      // 3. Initialize connector
      const connector = ConnectorFactory.createConnector(sourceResult.data.platform as EcommercePlatform);
      await connector.initialize(configResult.data.config as Record<string, unknown>);
      
      // 4. Fetch products from external platform
      const { products } = await connector.fetchProducts();
      
      // 5. Upsert products in our database
      for (const normalizedProduct of products) {
        // Check if product already exists
        const existingResult = await supabaseAdmin
          .from("products")
          .select("id")
          .eq("external_id", normalizedProduct.external_id)
          .eq("product_source_id", data.product_source_id)
          .maybeSingle();
        
        if (existingResult.data) {
          // Update existing product
          await supabaseAdmin
            .from("products")
            .update({
              name: normalizedProduct.name,
              description: normalizedProduct.description,
              price_cents: normalizedProduct.price_cents,
              compare_at_cents: normalizedProduct.compare_at_cents,
              image_url: normalizedProduct.image_url,
              category_slug: normalizedProduct.category_slug,
              rating: normalizedProduct.rating,
              sold_count: normalizedProduct.sold_count,
              stock: normalizedProduct.stock,
              location: normalizedProduct.location,
              is_featured: normalizedProduct.is_featured,
              metadata: normalizedProduct.metadata,
            })
            .eq("id", existingResult.data.id);
          productsUpdated++;
        } else {
          // Create new product
          await supabaseAdmin.from("products").insert({
            ...normalizedProduct,
            product_source_id: data.product_source_id,
          });
          productsAdded++;
        }
      }
      
      // 6. Mark sync log as success
      await supabaseAdmin
        .from("product_sync_logs")
        .update({
          status: "success",
          message: `Synced ${productsAdded} new products, ${productsUpdated} updated`,
          products_added: productsAdded,
          products_updated: productsUpdated,
          products_removed: productsRemoved,
          completed_at: new Date().toISOString(),
        })
        .eq("id", syncLog.id);
        
      // 7. Update product source last sync time
      await supabaseAdmin
        .from("product_sources")
        .update({
          last_sync_at: new Date().toISOString(),
          last_sync_status: "success",
        })
        .eq("id", data.product_source_id);
        
      return {
        success: true,
        productsAdded,
        productsUpdated,
        productsRemoved,
      };
    } catch (error) {
      // Mark sync log as error
      await supabaseAdmin
        .from("product_sync_logs")
        .update({
          status: "error",
          message: `Sync failed: ${(error as Error).message}`,
          error_details: { error: (error as Error).message, stack: (error as Error).stack },
          completed_at: new Date().toISOString(),
        })
        .eq("id", syncLog.id);
      
      // Update product source last sync status
      await supabaseAdmin
        .from("product_sources")
        .update({
          last_sync_at: new Date().toISOString(),
          last_sync_status: "error",
        })
        .eq("id", data.product_source_id);
        
      throw error;
    }
  });

// 4. List Product Sources
export const getProductSources = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const { data, error } = await supabaseAdmin
      .from("product_sources")
      .select(`
        *,
        connector_configs (
          id,
          platform,
          created_at,
          is_active
        ),
        product_sync_logs (
          id,
          status,
          started_at,
          completed_at,
          products_added,
          products_updated
        )
      `)
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false });
      
    if (error) throw new Error(error.message);
    return data;
  });
