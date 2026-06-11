/**
 * Discount Detection and Analysis Module
 * Handles discount-related queries and product price analysis
 */

export interface DiscountInfo {
  productId: string;
  productName: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  discountAmount: number;
  platform: string;
  category?: string;
  isActive: boolean;
  validUntil?: Date;
}

export interface DiscountQuery {
  type: 'percentage' | 'amount' | 'category' | 'platform' | 'general';
  minDiscount?: number;
  maxPrice?: number;
  category?: string;
  platform?: string;
  keywords?: string[];
}

/**
 * Calculate discount percentage from original and discounted price
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  discountedPrice: number
): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

/**
 * Check if a product has a significant discount
 */
export function hasSignificantDiscount(
  originalPrice: number,
  discountedPrice: number,
  threshold: number = 10
): boolean {
  const discountPercentage = calculateDiscountPercentage(originalPrice, discountedPrice);
  return discountPercentage >= threshold;
}

/**
 * Parse discount-related queries from user input
 */
export function parseDiscountQuery(query: string): DiscountQuery {
  const lowerQuery = query.toLowerCase();
  
  // Detect query type
  let type: DiscountQuery['type'] = 'general';
  
  if (lowerQuery.includes('percent') || lowerQuery.includes('%')) {
    type = 'percentage';
  } else if (lowerQuery.includes('category') || lowerQuery.includes('type')) {
    type = 'category';
  } else if (lowerQuery.includes('platform') || lowerQuery.includes('store')) {
    type = 'platform';
  }
  
  // Extract minimum discount percentage
  const percentMatch = lowerQuery.match(/(\d+)\s*%|(\d+)\s*percent/);
  const minDiscount = percentMatch ? parseInt(percentMatch[1] || percentMatch[2]) : undefined;
  
  // Extract maximum price
  const priceMatch = lowerQuery.match(/under\s*\$?(\d+)|below\s*\$?(\d+)|max\s*\$?(\d+)/);
  const maxPrice = priceMatch ? parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]) : undefined;
  
  // Extract keywords
  const keywords = lowerQuery
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && 
      !['discount', 'deal', 'sale', 'offer', 'price', 'under', 'below', 'percent'].includes(word)
    );
  
  return {
    type,
    minDiscount,
    maxPrice,
    keywords: keywords.length > 0 ? keywords : undefined,
  };
}

/**
 * Filter products based on discount criteria
 */
export function filterProductsByDiscount(
  products: any[],
  query: DiscountQuery
): any[] {
  return products.filter(product => {
    // Check if product has discount information
    if (!product.price || !product.originalPrice) {
      return false;
    }
    
    const discountPercentage = calculateDiscountPercentage(
      product.originalPrice,
      product.price
    );
    
    // Apply minimum discount filter
    if (query.minDiscount && discountPercentage < query.minDiscount) {
      return false;
    }
    
    // Apply maximum price filter
    if (query.maxPrice && product.price > query.maxPrice) {
      return false;
    }
    
    // Apply category filter
    if (query.category && product.category !== query.category) {
      return false;
    }
    
    // Apply platform filter
    if (query.platform && product.platform !== query.platform) {
      return false;
    }
    
    // Apply keyword filter
    if (query.keywords && query.keywords.length > 0) {
      const productText = `${product.name} ${product.description || ''}`.toLowerCase();
      const hasKeyword = query.keywords.some(keyword => 
        productText.includes(keyword)
      );
      if (!hasKeyword) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Sort products by discount percentage (highest first)
 */
export function sortByDiscount(products: any[]): any[] {
  return [...products].sort((a, b) => {
    const discountA = calculateDiscountPercentage(a.originalPrice || a.price, a.price);
    const discountB = calculateDiscountPercentage(b.originalPrice || b.price, b.price);
    return discountB - discountA;
  });
}

/**
 * Generate discount summary for a list of products
 */
export function generateDiscountSummary(products: any[]): {
  totalProducts: number;
  averageDiscount: number;
  maxDiscount: number;
  totalSavings: number;
} {
  if (products.length === 0) {
    return {
      totalProducts: 0,
      averageDiscount: 0,
      maxDiscount: 0,
      totalSavings: 0,
    };
  }
  
  let totalDiscount = 0;
  let maxDiscount = 0;
  let totalSavings = 0;
  
  products.forEach(product => {
    if (product.originalPrice && product.price) {
      const discount = calculateDiscountPercentage(product.originalPrice, product.price);
      const savings = product.originalPrice - product.price;
      
      totalDiscount += discount;
      maxDiscount = Math.max(maxDiscount, discount);
      totalSavings += savings;
    }
  });
  
  return {
    totalProducts: products.length,
    averageDiscount: Math.round(totalDiscount / products.length),
    maxDiscount,
    totalSavings: Math.round(totalSavings * 100) / 100,
  };
}

/**
 * Check if query is discount-related
 * Enhanced with platform-specific keywords
 */
export function isDiscountQuery(query: string): boolean {
  const discountKeywords = [
    // General discount terms
    'discount', 'deal', 'sale', 'offer', 'promo', 'promotion',
    'cheap', 'affordable', 'bargain', 'clearance', 'markdown',
    'reduced', 'save', 'savings', 'special', 'coupon', 'voucher',
    'percent off', '% off', 'price drop', 'best price', 'lowest price',
    
    // Platform-specific terms
    'lightning deal', 'prime day', 'black friday', 'cyber monday',
    'flash sale', 'rollback', 'circle offer', 'super deal', 'choice day',
    'warehouse deal', 'daily deal', 'best offer', 'hot sale',
    
    // Action-oriented terms
    'compare price', 'price match', 'price comparison', 'find deal',
    'best deal', 'top deal', 'cheapest', 'budget', 'under $',
    
    // Time-sensitive terms
    'today', 'now', 'limited time', 'ending soon', 'last chance',
    'hurry', 'quick', 'expires', 'temporary'
  ];
  
  const lowerQuery = query.toLowerCase();
  return discountKeywords.some(keyword => lowerQuery.includes(keyword));
}

/**
 * Detect platform from query or product data
 */
export function detectPlatform(query: string, product?: any): string | null {
  const lowerQuery = query.toLowerCase();
  const platforms = [
    { name: 'amazon', keywords: ['amazon', 'amzn', 'prime'] },
    { name: 'shopify', keywords: ['shopify'] },
    { name: 'woocommerce', keywords: ['woocommerce', 'woo'] },
    { name: 'ebay', keywords: ['ebay'] },
    { name: 'aliexpress', keywords: ['aliexpress', 'ali express', 'alibaba'] },
    { name: 'walmart', keywords: ['walmart', 'wmt'] },
    { name: 'target', keywords: ['target'] },
    { name: 'etsy', keywords: ['etsy'] },
    { name: 'bestbuy', keywords: ['best buy', 'bestbuy'] },
    { name: 'costco', keywords: ['costco'] }
  ];
  
  for (const platform of platforms) {
    if (platform.keywords.some(keyword => lowerQuery.includes(keyword))) {
      return platform.name;
    }
  }
  
  return product?.platform || null;
}

/**
 * Enhanced discount percentage calculation with rounding options
 */
export function calculateDiscountPercentageEnhanced(
  originalPrice: number,
  discountedPrice: number,
  decimals: number = 0
): number {
  if (originalPrice <= 0) return 0;
  const percentage = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return decimals > 0
    ? Math.round(percentage * Math.pow(10, decimals)) / Math.pow(10, decimals)
    : Math.round(percentage);
}

/**
 * Categorize discount quality
 */
export function categorizeDiscount(discountPercentage: number): {
  category: string;
  emoji: string;
  description: string;
} {
  if (discountPercentage >= 50) {
    return {
      category: 'exceptional',
      emoji: '🔥',
      description: 'Exceptional Deal'
    };
  } else if (discountPercentage >= 30) {
    return {
      category: 'best',
      emoji: '🏆',
      description: 'Best Deal'
    };
  } else if (discountPercentage >= 20) {
    return {
      category: 'good',
      emoji: '⭐',
      description: 'Good Deal'
    };
  } else if (discountPercentage >= 10) {
    return {
      category: 'moderate',
      emoji: '💰',
      description: 'Moderate Savings'
    };
  } else {
    return {
      category: 'minimal',
      emoji: '💵',
      description: 'Small Savings'
    };
  }
}

/**
 * Check if discount is time-sensitive
 */
export function isTimeSensitive(product: any): boolean {
  if (!product) return false;
  
  const timeSensitiveKeywords = [
    'lightning', 'flash', 'limited time', 'ending soon', 'today only',
    'hourly', 'daily deal', 'expires', 'last chance'
  ];
  
  const productText = `${product.name} ${product.description || ''} ${product.tags || ''}`.toLowerCase();
  return timeSensitiveKeywords.some(keyword => productText.includes(keyword));
}

// Made with Bob
