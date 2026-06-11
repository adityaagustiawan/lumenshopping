/**
 * AI Prompt Configuration for Discount-Aware Assistant
 * Configures the AI to understand and respond to discount queries
 */

export const DISCOUNT_SYSTEM_PROMPT = `You are a helpful e-commerce shopping assistant specializing in finding the best deals and discounts. Your primary role is to help users discover products with significant discounts across various e-commerce platforms.

## Your Capabilities:
1. **Discount Discovery**: Identify and recommend products with active discounts
2. **Price Comparison**: Compare prices across different platforms
3. **Deal Analysis**: Analyze discount percentages and savings
4. **Smart Recommendations**: Suggest products based on discount criteria
5. **Category Expertise**: Find deals in specific product categories
6. **Budget Assistance**: Help users find discounts within their budget

## When Users Ask About Discounts:
- Always prioritize products with the highest discount percentages
- Mention the original price, discounted price, and savings amount
- Highlight time-sensitive deals or limited offers
- Suggest similar products with better discounts if available
- Provide category-specific recommendations when relevant

## Response Format for Discount Queries:
1. Acknowledge the user's discount interest
2. Present top discounted products with clear pricing
3. Highlight the best deals (highest % off)
4. Mention any special conditions or expiry dates
5. Offer to filter by category, price range, or platform

## Key Discount Terminology:
- "Best deals" = Products with 30%+ discount
- "Good deals" = Products with 15-29% discount
- "Moderate savings" = Products with 10-14% discount
- "Flash sale" = Time-limited high discounts
- "Clearance" = Final sale items with deep discounts

## Example Responses:
User: "Show me products with discounts"
Assistant: "I found several great deals for you! Here are the top discounted products:
1. [Product Name] - Originally $100, now $70 (30% OFF - Save $30)
2. [Product Name] - Originally $50, now $40 (20% OFF - Save $10)
Would you like to see deals in a specific category or price range?"

User: "Any deals under $50?"
Assistant: "Yes! I found [X] products under $50 with active discounts:
[List products with prices and discount percentages]
The best deal is [Product] at [Price] - that's [X]% off!"

## Important Guidelines:
- Always verify discount information is current
- Be transparent about pricing and savings
- Never exaggerate discount values
- Mention if a deal is ending soon
- Suggest alternatives if no discounts match criteria
- Be enthusiastic but honest about deals

Remember: Your goal is to help users save money while finding quality products they need.`;

export const DISCOUNT_CONTEXT_TEMPLATE = `
## Current Discount Context:
- Total Products with Discounts: {totalDiscountedProducts}
- Average Discount: {averageDiscount}%
- Highest Discount: {maxDiscount}%
- Total Potential Savings: {totalSavings}

## Available Categories with Discounts:
{categoriesWithDiscounts}

## Top Platforms with Active Deals:
{platformsWithDeals}

Use this context to provide accurate and helpful discount recommendations.`;

export const DISCOUNT_QUERY_EXAMPLES = [
  {
    query: "Show me the best deals",
    intent: "Find products with highest discount percentages",
    response_type: "sorted_by_discount"
  },
  {
    query: "Any discounts on electronics?",
    intent: "Find discounts in electronics category",
    response_type: "category_filtered"
  },
  {
    query: "Products under $100 with at least 20% off",
    intent: "Find products matching price and discount criteria",
    response_type: "multi_filter"
  },
  {
    query: "What's on sale today?",
    intent: "Show current active discounts",
    response_type: "time_sensitive"
  },
  {
    query: "Compare prices for [product]",
    intent: "Show price comparison across platforms",
    response_type: "price_comparison"
  }
];

/**
 * Generate dynamic system prompt with current discount data
 */
export function generateDiscountPrompt(context: {
  totalDiscountedProducts: number;
  averageDiscount: number;
  maxDiscount: number;
  totalSavings: number;
  categories?: string[];
  platforms?: string[];
}): string {
  const categoriesText = context.categories?.length 
    ? context.categories.map(cat => `- ${cat}`).join('\n')
    : '- All categories available';
    
  const platformsText = context.platforms?.length
    ? context.platforms.map(plat => `- ${plat}`).join('\n')
    : '- Multiple platforms available';
  
  const contextPrompt = DISCOUNT_CONTEXT_TEMPLATE
    .replace('{totalDiscountedProducts}', context.totalDiscountedProducts.toString())
    .replace('{averageDiscount}', context.averageDiscount.toString())
    .replace('{maxDiscount}', context.maxDiscount.toString())
    .replace('{totalSavings}', context.totalSavings.toFixed(2))
    .replace('{categoriesWithDiscounts}', categoriesText)
    .replace('{platformsWithDeals}', platformsText);
  
  return `${DISCOUNT_SYSTEM_PROMPT}\n\n${contextPrompt}`;
}

/**
 * Enhance user query with discount context
 */
export function enhanceDiscountQuery(
  userQuery: string,
  availableProducts: any[]
): string {
  const hasDiscountKeyword = /discount|deal|sale|offer|cheap|save|promo/i.test(userQuery);
  
  if (!hasDiscountKeyword) {
    return userQuery;
  }
  
  // Add context about available discounts
  const discountedProducts = availableProducts.filter(p => 
    p.originalPrice && p.price < p.originalPrice
  );
  
  if (discountedProducts.length === 0) {
    return `${userQuery}\n\nNote: Currently, there are no active discounts available.`;
  }
  
  return `${userQuery}\n\nContext: ${discountedProducts.length} products currently have active discounts.`;
}

/**
 * Format discount response for AI
 */
export function formatDiscountResponse(products: any[]): string {
  if (products.length === 0) {
    return "No products found matching your discount criteria.";
  }
  
  const responses = products.slice(0, 10).map((product, index) => {
    const discount = product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
    const savings = product.originalPrice 
      ? (product.originalPrice - product.price).toFixed(2)
      : 0;
    
    return `${index + 1}. **${product.name}**
   - Original Price: $${product.originalPrice || product.price}
   - Discounted Price: $${product.price}
   - Discount: ${discount}% OFF
   - You Save: $${savings}
   - Platform: ${product.platform || 'N/A'}
   - Category: ${product.category || 'N/A'}`;
  }).join('\n\n');
  
  return `I found ${products.length} products with discounts:\n\n${responses}`;
}

/**
 * Coze AI specific configuration
 */
export const COZE_AI_CONFIG = {
  botId: "7649776912948330549",
  spaceId: "7649761455071330320",
  apiEndpoint: "https://api.coze.com/v1/chat",
  
  // Discount-specific intents
  intents: {
    FIND_DISCOUNTS: "find_discounts",
    COMPARE_PRICES: "compare_prices",
    CATEGORY_DEALS: "category_deals",
    BUDGET_DEALS: "budget_deals",
    BEST_DEALS: "best_deals",
  },
  
  // Response templates
  templates: {
    noDiscounts: "I couldn't find any active discounts matching your criteria. Would you like me to show you our regular products or adjust your search?",
    multipleDiscounts: "Great news! I found {count} products with discounts. Here are the best deals:",
    categoryDiscounts: "I found {count} discounted products in the {category} category:",
    priceRangeDiscounts: "Here are {count} products under ${maxPrice} with discounts:",
  }
};

export default {
  DISCOUNT_SYSTEM_PROMPT,
  DISCOUNT_CONTEXT_TEMPLATE,
  DISCOUNT_QUERY_EXAMPLES,
  generateDiscountPrompt,
  enhanceDiscountQuery,
  formatDiscountResponse,
  COZE_AI_CONFIG,
};

// Made with Bob
