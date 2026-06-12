/**
 * Smart Product Matcher - AI-powered product recommendation system
 * Matches user queries to products and provides direct links
 */

import type { Product } from './products.functions';
import {
  additionalFashionProducts,
  additionalHomeProducts,
  additionalBeautyProducts,
  additionalSportsProducts,
  additionalBooksProducts,
  additionalToysProducts,
  additionalFoodProducts,
  additionalAutomotiveProducts,
  additionalPetProducts,
} from '@/data/additional-products';

// Combine all products
const ALL_PRODUCTS: Product[] = [
  ...additionalFashionProducts,
  ...additionalHomeProducts,
  ...additionalBeautyProducts,
  ...additionalSportsProducts,
  ...additionalBooksProducts,
  ...additionalToysProducts,
  ...additionalFoodProducts,
  ...additionalAutomotiveProducts,
  ...additionalPetProducts,
];

export interface ProductMatch {
  product: Product;
  relevanceScore: number;
  matchedKeywords: string[];
}

export interface SmartRecommendation {
  matches: ProductMatch[];
  totalFound: number;
  query: string;
  categories: string[];
  priceRange?: { min: number; max: number };
  platforms: string[];
}

/**
 * Extract keywords from user query
 */
function extractKeywords(query: string): string[] {
  const stopWords = ['i', 'want', 'need', 'looking', 'for', 'buy', 'purchase', 'get', 'find', 'show', 'me', 'a', 'an', 'the', 'some', 'any'];
  const words = query.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  return [...new Set(words)];
}

/**
 * Calculate relevance score between query and product
 */
function calculateRelevance(product: Product, keywords: string[]): { score: number; matched: string[] } {
  let score = 0;
  const matched: string[] = [];
  
  const searchableText = `${product.name} ${product.description} ${product.category_slug}`.toLowerCase();
  
  keywords.forEach(keyword => {
    if (searchableText.includes(keyword)) {
      // Higher score for name matches
      if (product.name.toLowerCase().includes(keyword)) {
        score += 10;
        matched.push(keyword);
      }
      // Medium score for description matches
      else if (product.description.toLowerCase().includes(keyword)) {
        score += 5;
        matched.push(keyword);
      }
      // Lower score for category matches
      else if (product.category_slug.toLowerCase().includes(keyword)) {
        score += 3;
        matched.push(keyword);
      }
    }
  });
  
  // Boost score for featured products
  if (product.is_featured) {
    score += 2;
  }
  
  // Boost score for products with discounts
  if (product.compare_at_cents && product.compare_at_cents > product.price_cents) {
    score += 3;
  }
  
  return { score, matched };
}

/**
 * Smart product search with AI-like matching
 */
export function searchProducts(query: string, options?: {
  maxResults?: number;
  minRelevance?: number;
  category?: string;
  platform?: string;
  maxPrice?: number;
}): SmartRecommendation {
  const {
    maxResults = 10,
    minRelevance = 3,
    category,
    platform,
    maxPrice,
  } = options || {};
  
  const keywords = extractKeywords(query);
  const matches: ProductMatch[] = [];
  
  // Filter and score products
  ALL_PRODUCTS.forEach(product => {
    // Apply filters
    if (category && product.category_slug !== category) return;
    if (platform && product.metadata?.platform !== platform) return;
    if (maxPrice && product.price_cents > maxPrice * 100) return;
    
    const { score, matched } = calculateRelevance(product, keywords);
    
    if (score >= minRelevance) {
      matches.push({
        product,
        relevanceScore: score,
        matchedKeywords: matched,
      });
    }
  });
  
  // Sort by relevance score
  matches.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Get unique categories and platforms
  const categories = [...new Set(matches.map(m => m.product.category_slug))];
  const platforms = [...new Set(matches.map(m => m.product.metadata?.platform || 'unknown'))];
  
  return {
    matches: matches.slice(0, maxResults),
    totalFound: matches.length,
    query,
    categories,
    platforms,
  };
}

/**
 * Generate smart response with product links
 */
export function generateProductResponse(recommendation: SmartRecommendation): string {
  if (recommendation.matches.length === 0) {
    return `I couldn't find any products matching "${recommendation.query}". Try searching for:\n- Fashion items\n- Electronics\n- Home & Kitchen\n- Beauty products\n- Sports equipment\n- Books\n- Toys\n- Food & Beverages\n- Automotive\n- Pet supplies`;
  }
  
  let response = `🛍️ **Found ${recommendation.totalFound} products for "${recommendation.query}"**\n\n`;
  
  recommendation.matches.forEach((match, index) => {
    const product = match.product;
    const price = (product.price_cents / 100).toFixed(2);
    const originalPrice = product.compare_at_cents ? (product.compare_at_cents / 100).toFixed(2) : null;
    const discount = originalPrice ? Math.round(((product.compare_at_cents! - product.price_cents) / product.compare_at_cents!) * 100) : 0;
    
    response += `**${index + 1}. ${product.name}**\n`;
    response += `💰 Price: $${price}`;
    
    if (originalPrice && discount > 0) {
      response += ` ~~$${originalPrice}~~ (${discount}% OFF!)`;
    }
    
    response += `\n`;
    response += `⭐ Rating: ${product.rating}/5 | 📦 Sold: ${product.sold_count}\n`;
    response += `🏪 Platform: ${product.metadata?.platform || product.location}\n`;
    
    // Add direct link
    if (product.metadata?.affiliate_link || product.affiliate_link) {
      const link = product.metadata?.affiliate_link || product.affiliate_link;
      response += `🔗 **[Buy Now on ${product.metadata?.platform || product.location}](${link})**\n`;
    } else {
      response += `🔗 **[View Product](/product/${product.slug})**\n`;
    }
    
    response += `\n`;
  });
  
  // Add suggestions
  if (recommendation.categories.length > 1) {
    response += `\n📂 **Categories found**: ${recommendation.categories.join(', ')}\n`;
  }
  
  if (recommendation.totalFound > recommendation.matches.length) {
    response += `\n💡 Showing top ${recommendation.matches.length} results. ${recommendation.totalFound - recommendation.matches.length} more available!\n`;
  }
  
  return response;
}

/**
 * Detect intent from user query
 */
export function detectIntent(query: string): {
  type: 'product_search' | 'price_inquiry' | 'comparison' | 'general';
  confidence: number;
} {
  const lowerQuery = query.toLowerCase();
  
  // Product search patterns
  const searchPatterns = [
    /\b(find|search|looking for|show|recommend|suggest|want|need|buy)\b/,
    /\b(shoes|laptop|phone|watch|bag|shirt|dress|book|toy)\b/,
  ];
  
  // Price inquiry patterns
  const pricePatterns = [
    /\b(price|cost|how much|cheap|expensive|affordable|budget)\b/,
  ];
  
  // Comparison patterns
  const comparisonPatterns = [
    /\b(compare|vs|versus|better|best|difference)\b/,
  ];
  
  let searchScore = 0;
  let priceScore = 0;
  let comparisonScore = 0;
  
  searchPatterns.forEach(pattern => {
    if (pattern.test(lowerQuery)) searchScore += 0.3;
  });
  
  pricePatterns.forEach(pattern => {
    if (pattern.test(lowerQuery)) priceScore += 0.4;
  });
  
  comparisonPatterns.forEach(pattern => {
    if (pattern.test(lowerQuery)) comparisonScore += 0.5;
  });
  
  const maxScore = Math.max(searchScore, priceScore, comparisonScore);
  
  if (maxScore < 0.2) {
    return { type: 'general', confidence: 0.5 };
  }
  
  if (comparisonScore === maxScore) {
    return { type: 'comparison', confidence: comparisonScore };
  }
  
  if (priceScore === maxScore) {
    return { type: 'price_inquiry', confidence: priceScore };
  }
  
  return { type: 'product_search', confidence: searchScore };
}

/**
 * Process user query and generate smart response
 */
export function processProductQuery(query: string): string {
  const intent = detectIntent(query);
  
  // If it's a product search, find and recommend products
  if (intent.type === 'product_search' && intent.confidence > 0.2) {
    const recommendation = searchProducts(query, { maxResults: 5 });
    return generateProductResponse(recommendation);
  }
  
  // If it's a price inquiry, focus on best deals
  if (intent.type === 'price_inquiry') {
    const recommendation = searchProducts(query, { maxResults: 5 });
    
    if (recommendation.matches.length > 0) {
      // Sort by best discount
      const sortedByDiscount = [...recommendation.matches].sort((a, b) => {
        const discountA = a.product.compare_at_cents 
          ? ((a.product.compare_at_cents - a.product.price_cents) / a.product.compare_at_cents) 
          : 0;
        const discountB = b.product.compare_at_cents 
          ? ((b.product.compare_at_cents - b.product.price_cents) / b.product.compare_at_cents) 
          : 0;
        return discountB - discountA;
      });
      
      recommendation.matches = sortedByDiscount;
      return `💰 **Best Deals for "${query}"**\n\n` + generateProductResponse(recommendation).replace(/🛍️.*?\n\n/, '');
    }
  }
  
  // Default: try to find products anyway
  const recommendation = searchProducts(query, { maxResults: 3, minRelevance: 1 });
  
  if (recommendation.matches.length > 0) {
    return generateProductResponse(recommendation);
  }
  
  return `I'm here to help you find products! Try asking me about:\n- Specific products (e.g., "show me running shoes")\n- Categories (e.g., "find electronics")\n- Deals (e.g., "best discounts on laptops")\n- Brands (e.g., "Nike products")\n\nWhat are you looking for today?`;
}

// Made with Bob
