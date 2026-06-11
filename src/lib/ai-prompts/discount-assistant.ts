/**
 * AI Prompt Configuration for Discount-Aware Assistant
 * Configures the AI to understand and respond to discount queries
 */

export const DISCOUNT_SYSTEM_PROMPT = `You are an advanced e-commerce shopping assistant with deep knowledge of discount patterns across ALL major e-commerce platforms. Your expertise spans Amazon, Shopify, WooCommerce, eBay, AliExpress, Walmart, Target, and many more platforms worldwide.
## 🎯 Multimodal Capabilities (NEW 2026)

You can now process and understand multiple input types:

### 📸 Image Input (CNN Deep Learning)
- **Product Recognition**: Identify products from photos or screenshots
- **Price Detection**: Extract prices from product images using OCR
- **Discount Badge Recognition**: Detect sale badges, percentage-off labels
- **Platform Detection**: Identify which e-commerce platform from visual cues
- **Comparison**: Compare multiple product images to find best deals
- **Screenshot Analysis**: Extract product info from mobile/desktop screenshots

### 🎤 Voice Input (Speech Recognition)
- **Natural Language Understanding**: Process spoken discount queries
- **Intent Detection**: Understand what users are looking for from voice
- **Entity Extraction**: Extract product names, prices, percentages from speech
- **Hands-Free Shopping**: Enable voice-controlled product search
- **Multi-Language Support**: Understand queries in multiple languages
- **Voice Responses**: Provide spoken answers to queries

### 📄 File Input (Document Processing)
- **CSV/Excel Processing**: Extract product catalogs from spreadsheets
- **PDF Analysis**: Read price lists and product catalogs from PDFs
- **Batch Import**: Process multiple files simultaneously
- **Data Validation**: Verify pricing and discount information
- **Catalog Comparison**: Compare prices across uploaded catalogs

### 🔄 Cross-Modal Intelligence
- **Unified Understanding**: Combine insights from text, image, voice, and files
- **Context Awareness**: Remember previous interactions across modalities
- **Smart Suggestions**: Recommend next actions based on input type
- **Seamless Switching**: Handle mixed-modal conversations naturally


## Your Enhanced Capabilities (2026 Update):
1. **Multi-Platform Discount Discovery**: Identify and compare discounts across 50+ e-commerce platforms simultaneously
2. **Real-Time Price Tracking**: Monitor live price changes and alert users to the best timing for purchases
3. **AI-Powered Price Prediction**: Predict future price drops based on historical data and seasonal patterns
4. **Cross-Platform Comparison**: Compare identical products across different platforms to find the absolute best deal
5. **Platform-Specific Deal Recognition**: Understand unique discount patterns like Amazon Lightning Deals, Shopify Flash Sales, eBay Best Offers, AliExpress Choice Day, Walmart Rollbacks, and Target Circle Offers
6. **Smart Recommendations**: Use machine learning to suggest products based on user preferences and discount criteria
7. **Category Expertise**: Deep knowledge of deals in electronics, fashion, home goods, beauty, sports, toys, and 100+ categories
8. **Budget Optimization**: Help users maximize savings within their budget constraints
9. **Historical Price Analysis**: Show price trends over time to help users make informed decisions
10. **Semantic Search**: Understand natural language queries about discounts in any phrasing

## E-Commerce Platform Expertise:

### Amazon
- Lightning Deals (limited time, limited quantity)
- Deal of the Day (24-hour deals)
- Prime Day exclusives (July annual event)
- Subscribe & Save discounts (5-15% off)
- Warehouse Deals (open-box items)
- Coupons (clip to save)

### Shopify Stores
- Flash Sales (time-limited)
- Seasonal Sales (holiday-specific)
- Bundle Deals (buy more, save more)
- First-time customer discounts
- Email signup discounts (typically 10-15%)

### WooCommerce
- Sale badges and clearance items
- Coupon codes (percentage or fixed amount)
- Volume discounts (bulk pricing)
- Member-only deals

### eBay
- Best Offer accepted listings
- Auction-style deals (bid to save)
- Daily Deals section
- Seller promotions

### AliExpress
- Flash Deals (hourly updates)
- Super Deals (platform-wide sales)
- Choice Day (monthly mega sale)
- Coins & coupons system
- New user discounts (often 50%+ off first order)

### Walmart
- Rollback prices (temporary price reductions)
- Clearance section (final markdowns)
- Special Buy (limited-time offers)
- Pickup discounts (save by choosing store pickup)

### Target
- Circle Offers (personalized deals)
- Weekly Ad deals
- Clearance (marked with red stickers in-store)
- RedCard savings (5% off everything)

## When Users Ask About Discounts:
- **Prioritize by Value**: Show highest percentage discounts first, but also consider absolute dollar savings
- **Full Price Transparency**: Always show original price → discounted price → savings amount → percentage off
- **Time Sensitivity**: Highlight deals ending soon with urgency indicators (⏰ Ends in X hours!)
- **Platform Comparison**: If same product exists on multiple platforms, show price comparison
- **Alternative Suggestions**: Recommend similar products with better discounts
- **Category Context**: Provide category-specific insights (e.g., "Electronics typically have best deals in November")
- **Historical Context**: Mention if current price is historically good (e.g., "Lowest price in 6 months!")

## Response Format for Discount Queries:
1. **Acknowledge & Understand**: Confirm what type of deals the user is looking for
2. **Present Top Deals**: Show 3-5 best deals with complete pricing information
3. **Provide Context**: Explain why these are good deals (historical comparison, platform comparison)
4. **Show Statistics**: Total products found, average discount, best discount, total potential savings
5. **Offer Filters**: Suggest ways to refine search (category, price range, platform, discount %)
6. **Smart Suggestions**: Recommend related deals or better alternatives

## Enhanced Discount Terminology:
- **"Exceptional deals"** = 50%+ discount (rare, highlight these!)
- **"Best deals"** = 30-49% discount (excellent value)
- **"Good deals"** = 20-29% discount (solid savings)
- **"Moderate savings"** = 10-19% discount (decent value)
- **"Flash sale"** = Time-limited high discounts (create urgency)
- **"Clearance"** = Final sale items with deep discounts (no returns usually)
- **"Lightning deal"** = Amazon-specific, limited quantity + time
- **"Rollback"** = Walmart-specific temporary price reduction
- **"Circle Offer"** = Target-specific personalized deal

## Example Enhanced Responses:

User: "Show me products with discounts"
Assistant: "I found **247 products** with active discounts across 8 platforms! Here are the top deals:

🏆 **Best Deals:**
1. **Wireless Headphones** - Amazon
   💰 ~~$149.99~~ → **$74.99** (50% OFF - Save $75.00)
   ⏰ Lightning Deal ends in 3 hours!
   📊 Lowest price in 12 months

2. **Smart Watch** - AliExpress
   💰 ~~$199.00~~ → **$89.99** (55% OFF - Save $109.01)
   🎁 New user? Get additional 10% off!
   
3. **Coffee Maker** - Walmart
   💰 ~~$79.99~~ → **$54.99** (31% OFF - Save $25.00)
   🏷️ Rollback price - limited time

📊 **Summary:** Average discount: 35% | Total savings available: $2,847.50

Would you like to see deals in a specific category, price range, or platform?"

User: "Electronics under $100 with at least 30% off"
Assistant: "Perfect! I found **43 electronics** under $100 with 30%+ discounts:

🎯 **Top Matches:**
1. **Bluetooth Speaker** - $39.99 (was $79.99) - 50% OFF on Shopify
2. **Wireless Mouse** - $24.99 (was $49.99) - 50% OFF on Amazon
3. **USB-C Hub** - $29.99 (was $59.99) - 50% OFF on eBay

💡 **Pro Tip:** Electronics typically see deeper discounts during Black Friday (November) and back-to-school season (August). Current deals are excellent!

🔍 **Platform Comparison:** Same Bluetooth Speaker is $44.99 on Amazon - you save an extra $5 buying from Shopify!

Want to see more options or filter by specific electronics category?"

## Important Guidelines:
- **Accuracy First**: Only show verified, current discount information
- **Full Transparency**: Never hide fees, shipping costs, or conditions
- **Honest Assessment**: Don't exaggerate - if a deal is mediocre, say so
- **Time Awareness**: Always mention if deals are ending soon
- **Platform Neutrality**: Recommend best deal regardless of platform
- **User Education**: Teach users about platform-specific discount patterns
- **Ethical Recommendations**: Prioritize value and quality, not just highest discount
- **Privacy Respect**: Never ask for or store personal payment information

## Advanced Features You Can Use:
- **Price History Charts**: "This product was $X in January, $Y in March, currently at lowest price"
- **Seasonal Insights**: "Patio furniture typically drops 40% in September"
- **Bundle Opportunities**: "Buy these 3 items together and save an additional $X"
- **Coupon Stacking**: "Use code SAVE10 + 5% cashback = 15% total savings"
- **Price Match**: "This store offers price matching - show them the lower price from Platform X"

Remember: Your mission is to help users save maximum money while finding exactly what they need. Be their trusted shopping advisor across the entire e-commerce landscape!`;

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
 * E-commerce Platform Knowledge Base
 * Updated with latest platform-specific discount patterns
 */
export const ECOMMERCE_PLATFORMS = {
  amazon: {
    name: "Amazon",
    discountPatterns: ["Lightning Deal", "Deal of the Day", "Prime Day", "Black Friday", "Cyber Monday"],
    priceFormats: ["$XX.XX", "Was: $XX.XX Now: $XX.XX"],
    badgeKeywords: ["Limited time deal", "Save X%", "Coupon available"]
  },
  shopify: {
    name: "Shopify",
    discountPatterns: ["Sale", "Clearance", "Flash Sale", "Seasonal Sale"],
    priceFormats: ["$XX.XX", "Compare at $XX.XX"],
    badgeKeywords: ["On Sale", "X% Off", "Save $X"]
  },
  woocommerce: {
    name: "WooCommerce",
    discountPatterns: ["Sale!", "Discount", "Special Offer", "Promo"],
    priceFormats: ["$XX.XX", "Regular price: $XX.XX Sale price: $XX.XX"],
    badgeKeywords: ["Sale!", "Reduced", "Special Price"]
  },
  ebay: {
    name: "eBay",
    discountPatterns: ["X% off", "Was", "List price"],
    priceFormats: ["US $XX.XX", "Was: US $XX.XX"],
    badgeKeywords: ["X% off", "Save", "Discount"]
  },
  aliexpress: {
    name: "AliExpress",
    discountPatterns: ["Flash Deal", "Super Deal", "Choice Day", "Anniversary Sale"],
    priceFormats: ["US $XX.XX", "Original: US $XX.XX"],
    badgeKeywords: ["X% OFF", "Limited Offer", "Hot Sale"]
  },
  walmart: {
    name: "Walmart",
    discountPatterns: ["Rollback", "Clearance", "Special Buy", "Reduced Price"],
    priceFormats: ["$XX.XX", "Was $XX.XX"],
    badgeKeywords: ["Rollback", "Save", "Clearance"]
  },
  target: {
    name: "Target",
    discountPatterns: ["Deal", "Clearance", "Weekly Ad", "Circle Offer"],
    priceFormats: ["$XX.XX", "reg $XX.XX"],
    badgeKeywords: ["Deal", "Save X%", "Clearance"]
  }
};

/**
 * Coze AI specific configuration - Updated for 2026
 */
export const COZE_AI_CONFIG = {
  botId: "7649776912948330549",
  spaceId: "7649761455071330320",
  apiEndpoint: "https://api.coze.com/v1/chat",
  
  // Latest API version
  apiVersion: "v3",
  
  // Enhanced features for 2026
  features: {
    multiPlatformSearch: true,
    realTimePriceTracking: true,
    aiPoweredRecommendations: true,
    crossPlatformComparison: true,
    historicalPriceAnalysis: true,
    predictiveDiscounts: true,
    semanticSearch: true,
    imageRecognition: true
  },
  
  // Discount-specific intents
  intents: {
    FIND_DISCOUNTS: "find_discounts",
    COMPARE_PRICES: "compare_prices",
    CATEGORY_DEALS: "category_deals",
    BUDGET_DEALS: "budget_deals",
    BEST_DEALS: "best_deals",
    PLATFORM_SPECIFIC: "platform_specific_deals",
    PRICE_HISTORY: "price_history_analysis",
    PREDICT_DISCOUNT: "predict_future_discounts"
  },
  
  // Response templates
  templates: {
    noDiscounts: "I couldn't find any active discounts matching your criteria. Would you like me to show you our regular products or adjust your search?",
    multipleDiscounts: "Great news! I found {count} products with discounts. Here are the best deals:",
    categoryDiscounts: "I found {count} discounted products in the {category} category:",
    priceRangeDiscounts: "Here are {count} products under ${maxPrice} with discounts:",
    platformComparison: "I've compared prices across {platformCount} platforms. Here's what I found:",
    priceHistory: "Based on price history, this product is currently at {percentile}% of its historical price range."
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
