import type { IEcommerceConnector, EcommercePlatform } from "./types";
import { WooCommerceConnector } from "./woocommerce-connector";
import { BaseEcommerceConnector } from "./base-connector";

// We'll add more connectors here as we build them!
const connectorRegistry: Record<EcommercePlatform, new () => IEcommerceConnector> = {
  woocommerce: WooCommerceConnector,
  
  // Placeholder connectors (we'll implement later)
  medusa: class PlaceholderMedusa extends BaseEcommerceConnector {
    platform = "medusa"; name = "Medusa";
    async initialize() {}
    async testConnection() { return { success: false, message: "Coming soon!" }; }
    async fetchProducts() { return { products: [], total: 0, hasMore: false }; }
    async fetchProduct() { return null; }
  },
  saleor: class PlaceholderSaleor extends BaseEcommerceConnector {
    platform = "saleor"; name = "Saleor";
    async initialize() {}
    async testConnection() { return { success: false, message: "Coming soon!" }; }
    async fetchProducts() { return { products: [], total: 0, hasMore: false }; }
    async fetchProduct() { return null; }
  },
  vendure: class PlaceholderVendure extends BaseEcommerceConnector {
    platform = "vendure"; name = "Vendure";
    async initialize() {}
    async testConnection() { return { success: false, message: "Coming soon!" }; }
    async fetchProducts() { return { products: [], total: 0, hasMore: false }; }
    async fetchProduct() { return null; }
  },
  spree: class PlaceholderSpree extends BaseEcommerceConnector {
    platform = "spree"; name = "Spree";
    async initialize() {}
    async testConnection() { return { success: false, message: "Coming soon!" }; }
    async fetchProducts() { return { products: [], total: 0, hasMore: false }; }
    async fetchProduct() { return null; }
  },
  prestashop: class PlaceholderPrestaShop extends BaseEcommerceConnector {
    platform = "prestashop"; name = "PrestaShop";
    async initialize() {}
    async testConnection() { return { success: false, message: "Coming soon!" }; }
    async fetchProducts() { return { products: [], total: 0, hasMore: false }; }
    async fetchProduct() { return null; }
  },
  magento: class PlaceholderMagento extends BaseEcommerceConnector {
    platform = "magento"; name = "Magento";
    async initialize() {}
    async testConnection() { return { success: false, message: "Coming soon!" }; }
    async fetchProducts() { return { products: [], total: 0, hasMore: false }; }
    async fetchProduct() { return null; }
  },
};

export class ConnectorFactory {
  static createConnector(platform: EcommercePlatform): IEcommerceConnector {
    const ConnectorClass = connectorRegistry[platform];
    if (!ConnectorClass) {
      throw new Error(`Connector not implemented for platform: ${platform}`);
    }
    return new ConnectorClass();
  }
  
  static getAvailablePlatforms(): { value: EcommercePlatform; label: string }[] {
    return Object.keys(connectorRegistry).map((platformKey) => {
      const platform = platformKey as EcommercePlatform;
      const instance = this.createConnector(platform);
      return { value: platform, label: instance.name };
    });
  }
}
