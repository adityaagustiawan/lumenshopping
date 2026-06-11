/**
 * Discount Query Handler for Chat API
 * Processes discount-related queries and integrates with AI assistant
 */

import {
  isDiscountQuery,
  parseDiscountQuery,
  filterProductsByDiscount,
  sortByDiscount,
  generateDiscountSummary,
  type DiscountQuery,
} from './discount-detector';

import {
  generateDiscountPrompt,
  enhanceDiscountQuery,
  formatDiscountResponse,
  COZE_AI_CONFIG,
} from './ai-prompts/discount-assistant';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface DiscountChatContext {
  products: any[];
  userQuery: string;
  conversationHistory?: ChatMessage[];
}

export interface DiscountChatResponse {
  message: string;
  products?: any[];
  summary?: {
    totalProducts: number;
    averageDiscount: number;
    maxDiscount: number;
    totalSavings: number;
  };
  suggestions?: string[];
  metadata?: {
    queryType: string;
    hasDiscounts: boolean;
    processingTime: number;
  };
}

/**
 * Main handler for discount-related chat queries
 */
export async function handleDiscountQuery(
  context: DiscountChatContext
): Promise<DiscountChatResponse> {
  const startTime = Date.now();
  const { products, userQuery } = context;

  // Check if query is discount-related
  const isDiscount = isDiscountQuery(userQuery);
  
  if (!isDiscount) {
    return {
      message: "I can help you find discounts! Try asking about 'deals', 'discounts', or 'sales'.",
      metadata: {
        queryType: 'non_discount',
        hasDiscounts: false,
        processingTime: Date.now() - startTime,
      },
    };
  }

  // Parse the discount query
  const discountQuery = parseDiscountQuery(userQuery);
  
  // Filter products based on discount criteria
  const discountedProducts = products.filter(p => 
    p.originalPrice && p.price < p.originalPrice
  );
  
  if (discountedProducts.length === 0) {
    return {
      message: "I couldn't find any products with active discounts at the moment. Would you like to see our regular products instead?",
      products: [],
      metadata: {
        queryType: discountQuery.type,
        hasDiscounts: false,
        processingTime: Date.now() - startTime,
      },
    };
  }

  // Apply filters and sort
  let filteredProducts = filterProductsByDiscount(discountedProducts, discountQuery);
  filteredProducts = sortByDiscount(filteredProducts);

  // Generate summary
  const summary = generateDiscountSummary(filteredProducts);

  // Generate response message
  const responseMessage = generateDiscountResponseMessage(
    filteredProducts,
    discountQuery,
    summary
  );

  // Generate suggestions for follow-up queries
  const suggestions = generateFollowUpSuggestions(discountQuery, filteredProducts);

  return {
    message: responseMessage,
    products: filteredProducts.slice(0, 20), // Limit to top 20 results
    summary,
    suggestions,
    metadata: {
      queryType: discountQuery.type,
      hasDiscounts: true,
      processingTime: Date.now() - startTime,
    },
  };
}

/**
 * Generate a natural language response message
 */
function generateDiscountResponseMessage(
  products: any[],
  query: DiscountQuery,
  summary: ReturnType<typeof generateDiscountSummary>
): string {
  if (products.length === 0) {
    return "I couldn't find any products matching your specific discount criteria. Try adjusting your filters or browse all available deals.";
  }

  let message = `Great news! I found **${products.length}** products with discounts`;
  
  if (query.minDiscount) {
    message += ` of at least ${query.minDiscount}%`;
  }
  
  if (query.maxPrice) {
    message += ` under $${query.maxPrice}`;
  }
  
  if (query.category) {
    message += ` in the ${query.category} category`;
  }
  
  message += `.\n\n`;
  
  // Add summary statistics
  message += `📊 **Deal Summary:**\n`;
  message += `- Average Discount: ${summary.averageDiscount}%\n`;
  message += `- Best Deal: ${summary.maxDiscount}% OFF\n`;
  message += `- Total Potential Savings: $${summary.totalSavings.toFixed(2)}\n\n`;
  
  // Add top 5 products
  message += `🏆 **Top Deals:**\n\n`;
  
  products.slice(0, 5).forEach((product, index) => {
    const discount = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
    const savings = (product.originalPrice - product.price).toFixed(2);
    
    message += `${index + 1}. **${product.name}**\n`;
    message += `   💰 ~~$${product.originalPrice}~~ → **$${product.price}** (${discount}% OFF)\n`;
    message += `   💵 Save: $${savings}\n`;
    if (product.platform) {
      message += `   🏪 Platform: ${product.platform}\n`;
    }
    message += `\n`;
  });
  
  if (products.length > 5) {
    message += `\n_...and ${products.length - 5} more deals available!_\n`;
  }
  
  return message;
}

/**
 * Generate follow-up suggestions based on the query
 */
function generateFollowUpSuggestions(
  query: DiscountQuery,
  products: any[]
): string[] {
  const suggestions: string[] = [];
  
  // Suggest higher discount threshold
  if (query.minDiscount && query.minDiscount < 50) {
    suggestions.push(`Show me deals with ${query.minDiscount + 10}% or more discount`);
  }
  
  // Suggest category exploration
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  if (categories.length > 1 && !query.category) {
    suggestions.push(`Show me deals in ${categories[0]} category`);
  }
  
  // Suggest price range
  if (!query.maxPrice) {
    suggestions.push('Show me deals under $50');
  }
  
  // Suggest platform filtering
  const platforms = [...new Set(products.map(p => p.platform).filter(Boolean))];
  if (platforms.length > 1 && !query.platform) {
    suggestions.push(`Show me deals from ${platforms[0]}`);
  }
  
  // Always include best deals option
  suggestions.push('Show me the absolute best deals');
  
  return suggestions.slice(0, 4); // Limit to 4 suggestions
}

/**
 * Prepare system prompt with current discount context
 */
export function prepareDiscountSystemPrompt(products: any[]): string {
  const discountedProducts = products.filter(p => 
    p.originalPrice && p.price < p.originalPrice
  );
  
  const summary = generateDiscountSummary(discountedProducts);
  
  const categories = [...new Set(discountedProducts.map(p => p.category).filter(Boolean))];
  const platforms = [...new Set(discountedProducts.map(p => p.platform).filter(Boolean))];
  
  return generateDiscountPrompt({
    totalDiscountedProducts: discountedProducts.length,
    averageDiscount: summary.averageDiscount,
    maxDiscount: summary.maxDiscount,
    totalSavings: summary.totalSavings,
    categories,
    platforms,
  });
}

/**
 * Enhance user message with discount context for AI
 */
export function enhanceUserMessage(
  userMessage: string,
  products: any[]
): string {
  return enhanceDiscountQuery(userMessage, products);
}

/**
 * Format products for AI response
 */
export function formatProductsForAI(products: any[]): string {
  return formatDiscountResponse(products);
}

/**
 * Integration with Coze AI
 */
export async function sendToCozeAI(
  message: string,
  conversationId?: string
): Promise<any> {
  const { botId, apiEndpoint } = COZE_AI_CONFIG;
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COZE_API_KEY || ''}`,
      },
      body: JSON.stringify({
        bot_id: botId,
        user_id: conversationId || 'default_user',
        query: message,
        stream: false,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Coze AI API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error communicating with Coze AI:', error);
    throw error;
  }
}

/**
 * Process chat message with discount awareness
 */
export async function processDiscountChat(
  userMessage: string,
  products: any[],
  conversationHistory?: ChatMessage[]
): Promise<DiscountChatResponse> {
  // Handle discount query locally
  const localResponse = await handleDiscountQuery({
    products,
    userQuery: userMessage,
    conversationHistory,
  });
  
  // Optionally enhance with Coze AI if API key is available
  if (process.env.COZE_API_KEY) {
    try {
      const enhancedMessage = enhanceUserMessage(userMessage, products);
      const cozeResponse = await sendToCozeAI(enhancedMessage);
      
      // Merge local and AI responses
      return {
        ...localResponse,
        message: cozeResponse.messages?.[0]?.content || localResponse.message,
      };
    } catch (error) {
      console.warn('Coze AI enhancement failed, using local response:', error);
    }
  }
  
  return localResponse;
}

export default {
  handleDiscountQuery,
  prepareDiscountSystemPrompt,
  enhanceUserMessage,
  formatProductsForAI,
  sendToCozeAI,
  processDiscountChat,
};

// Made with Bob
