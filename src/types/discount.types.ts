/**
 * TypeScript Type Definitions for Discount System
 * Comprehensive type definitions for discount detection and AI integration
 */

/**
 * Product with discount information
 */
export interface DiscountedProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  category?: string;
  platform?: string;
  imageUrl?: string;
  url?: string;
  isActive: boolean;
  validFrom?: Date;
  validUntil?: Date;
  stock?: number;
  rating?: number;
  reviewCount?: number;
}

/**
 * Discount query parameters
 */
export interface DiscountQueryParams {
  type: 'percentage' | 'amount' | 'category' | 'platform' | 'general';
  minDiscount?: number;
  maxDiscount?: number;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  platform?: string;
  keywords?: string[];
  sortBy?: 'discount' | 'price' | 'rating' | 'name';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Discount filter options
 */
export interface DiscountFilters {
  categories?: string[];
  platforms?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  discountRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  minRating?: number;
}

/**
 * Discount summary statistics
 */
export interface DiscountSummary {
  totalProducts: number;
  averageDiscount: number;
  maxDiscount: number;
  minDiscount: number;
  totalSavings: number;
  averagePrice: number;
  categoriesCount: number;
  platformsCount: number;
}

/**
 * Chat message structure
 */
export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    queryType?: string;
    productsCount?: number;
    processingTime?: number;
  };
}

/**
 * Chat conversation context
 */
export interface ChatContext {
  conversationId: string;
  userId: string;
  messages: ChatMessage[];
  products: DiscountedProduct[];
  filters?: DiscountFilters;
  preferences?: UserPreferences;
}

/**
 * User preferences for discount notifications
 */
export interface UserPreferences {
  favoriteCategories?: string[];
  favoritePlatforms?: string[];
  priceAlerts?: PriceAlert[];
  notificationSettings?: {
    email: boolean;
    push: boolean;
    minDiscountThreshold: number;
  };
}

/**
 * Price alert configuration
 */
export interface PriceAlert {
  id: string;
  productId: string;
  targetPrice: number;
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

/**
 * AI response structure
 */
export interface AIResponse {
  message: string;
  products?: DiscountedProduct[];
  summary?: DiscountSummary;
  suggestions?: string[];
  actions?: AIAction[];
  confidence?: number;
  metadata?: {
    model?: string;
    processingTime?: number;
    tokensUsed?: number;
  };
}

/**
 * AI suggested actions
 */
export interface AIAction {
  type: 'filter' | 'sort' | 'navigate' | 'alert' | 'compare';
  label: string;
  params?: Record<string, any>;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Coze AI configuration
 */
export interface CozeAIConfig {
  botId: string;
  spaceId: string;
  apiKey: string;
  apiEndpoint: string;
  timeout?: number;
  retryAttempts?: number;
}

/**
 * Coze AI request payload
 */
export interface CozeAIRequest {
  bot_id: string;
  user_id: string;
  query: string;
  stream?: boolean;
  conversation_id?: string;
  additional_messages?: Array<{
    role: string;
    content: string;
  }>;
}

/**
 * Coze AI response payload
 */
export interface CozeAIResponse {
  code: number;
  msg: string;
  data?: {
    conversation_id: string;
    messages: Array<{
      role: string;
      content: string;
      type: string;
    }>;
  };
}

/**
 * Discount detection result
 */
export interface DiscountDetectionResult {
  isDiscountQuery: boolean;
  queryType: DiscountQueryParams['type'];
  extractedParams: Partial<DiscountQueryParams>;
  confidence: number;
  suggestedFilters?: DiscountFilters;
}

/**
 * Product comparison result
 */
export interface ProductComparison {
  products: DiscountedProduct[];
  bestDeal: DiscountedProduct;
  priceRange: {
    min: number;
    max: number;
  };
  averageDiscount: number;
  recommendation: string;
}

/**
 * Discount analytics
 */
export interface DiscountAnalytics {
  period: 'day' | 'week' | 'month' | 'year';
  totalDeals: number;
  averageDiscount: number;
  topCategories: Array<{
    category: string;
    count: number;
    averageDiscount: number;
  }>;
  topPlatforms: Array<{
    platform: string;
    count: number;
    averageDiscount: number;
  }>;
  priceDistribution: Array<{
    range: string;
    count: number;
  }>;
  trendData: Array<{
    date: Date;
    dealsCount: number;
    averageDiscount: number;
  }>;
}

/**
 * Error types for discount system
 */
export type DiscountError =
  | { type: 'NO_PRODUCTS'; message: string }
  | { type: 'INVALID_QUERY'; message: string }
  | { type: 'API_ERROR'; message: string; details?: any }
  | { type: 'NETWORK_ERROR'; message: string }
  | { type: 'TIMEOUT'; message: string }
  | { type: 'RATE_LIMIT'; message: string; retryAfter?: number };

/**
 * Discount system configuration
 */
export interface DiscountSystemConfig {
  enabled: boolean;
  minDiscountThreshold: number;
  maxResults: number;
  cacheTimeout: number;
  enableAI: boolean;
  enableNotifications: boolean;
  supportedPlatforms: string[];
  supportedCategories: string[];
}

/**
 * Export all types
 */
export type {
  DiscountedProduct as Product,
  DiscountQueryParams as QueryParams,
  DiscountFilters as Filters,
  DiscountSummary as Summary,
};

// Made with Bob
