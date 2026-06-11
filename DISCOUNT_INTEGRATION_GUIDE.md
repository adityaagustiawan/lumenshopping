# Discount Detection System - Integration Guide

## Overview

This guide explains how to integrate the discount detection system with your AI assistant to enable intelligent discount queries across e-commerce platforms.

## System Architecture

The discount detection system consists of several key components:

1. **Discount Detector** (`src/lib/discount-detector.ts`) - Core logic for detecting and analyzing discounts
2. **AI Prompts** (`src/lib/ai-prompts/discount-assistant.ts`) - Specialized prompts for discount-aware AI
3. **Chat Handler** (`src/lib/discount-chat-handler.ts`) - Processes discount queries in chat interface
4. **Type Definitions** (`src/types/discount.types.ts`) - TypeScript types for the system

## Features

### ✨ Core Capabilities

- **Intelligent Discount Detection**: Automatically identifies discount-related queries
- **Multi-Platform Support**: Works across different e-commerce platforms
- **Advanced Filtering**: Filter by category, price range, discount percentage
- **Smart Recommendations**: AI-powered product suggestions based on discounts
- **Real-time Analysis**: Calculate savings, compare prices, and rank deals
- **Coze AI Integration**: Enhanced responses using Coze AI bot

### 🎯 Query Types Supported

1. **General Discount Queries**
   - "Show me products with discounts"
   - "What deals are available?"
   - "Any sales today?"

2. **Percentage-Based Queries**
   - "Products with at least 30% off"
   - "Show me deals over 50% discount"

3. **Category-Specific Queries**
   - "Electronics on sale"
   - "Discounted clothing items"

4. **Budget-Conscious Queries**
   - "Deals under $50"
   - "Cheap products with discounts"

5. **Platform-Specific Queries**
   - "Amazon deals"
   - "Best prices on Shopify"

## Setup Instructions

### 1. Environment Configuration

Add the following variables to your `.env` file:

```bash
# Coze AI Configuration
COZE_API_KEY="your-coze-api-key"
COZE_BOT_ID="7649776912948330549"
COZE_SPACE_ID="7649761455071330320"
COZE_API_ENDPOINT="https://api.coze.com/v1/chat"

# Discount Feature Configuration
ENABLE_DISCOUNT_DETECTION="true"
MIN_DISCOUNT_THRESHOLD="10"
MAX_DISCOUNT_RESULTS="20"
```

### 2. Get Your Coze AI Credentials

1. Visit [Coze.com](https://www.coze.com)
2. Navigate to your bot: `https://www.coze.com/space/7649761455071330320/bot/7649776912948330549`
3. Get your API key from the bot settings
4. Update the environment variables with your credentials

### 3. Integration with Chat API

Update your chat API route (e.g., `src/routes/api/chat.ts`) to use the discount handler:

```typescript
import { processDiscountChat } from '@/lib/discount-chat-handler';
import { getAllProducts } from '@/lib/products.functions';

export async function POST({ request }) {
  const { message, conversationHistory } = await request.json();
  
  // Get all products
  const products = await getAllProducts();
  
  // Process with discount awareness
  const response = await processDiscountChat(
    message,
    products,
    conversationHistory
  );
  
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 4. Update Assistant Component

Enhance your assistant component to display discount information:

```typescript
import { handleDiscountQuery } from '@/lib/discount-chat-handler';

// In your chat component
const handleUserMessage = async (message: string) => {
  const response = await handleDiscountQuery({
    products: allProducts,
    userQuery: message,
    conversationHistory: messages
  });
  
  // Display response with products and suggestions
  setMessages([...messages, {
    role: 'assistant',
    content: response.message
  }]);
  
  if (response.products) {
    setDiscountedProducts(response.products);
  }
  
  if (response.suggestions) {
    setSuggestions(response.suggestions);
  }
};
```

## Usage Examples

### Example 1: Basic Discount Query

```typescript
import { handleDiscountQuery } from '@/lib/discount-chat-handler';

const response = await handleDiscountQuery({
  products: allProducts,
  userQuery: "Show me the best deals",
  conversationHistory: []
});

console.log(response.message);
// Output: "Great news! I found 45 products with discounts..."
console.log(response.summary);
// Output: { totalProducts: 45, averageDiscount: 25, maxDiscount: 70, ... }
```

### Example 2: Filtered Discount Query

```typescript
const response = await handleDiscountQuery({
  products: allProducts,
  userQuery: "Electronics under $100 with at least 20% off",
  conversationHistory: []
});

// Returns filtered products matching criteria
```

### Example 3: Using Discount Detector Directly

```typescript
import {
  isDiscountQuery,
  parseDiscountQuery,
  filterProductsByDiscount,
  sortByDiscount
} from '@/lib/discount-detector';

// Check if query is discount-related
if (isDiscountQuery(userMessage)) {
  // Parse the query
  const query = parseDiscountQuery(userMessage);
  
  // Filter products
  let results = filterProductsByDiscount(products, query);
  
  // Sort by discount percentage
  results = sortByDiscount(results);
}
```

### Example 4: Generate AI Prompt with Context

```typescript
import { prepareDiscountSystemPrompt } from '@/lib/discount-chat-handler';

// Generate system prompt with current discount data
const systemPrompt = prepareDiscountSystemPrompt(allProducts);

// Use with your AI model
const aiResponse = await callAI({
  systemPrompt,
  userMessage: "What are the best deals?"
});
```

## API Reference

### Discount Detector Functions

#### `isDiscountQuery(query: string): boolean`
Checks if a query is discount-related.

#### `parseDiscountQuery(query: string): DiscountQuery`
Extracts discount parameters from user query.

#### `filterProductsByDiscount(products: any[], query: DiscountQuery): any[]`
Filters products based on discount criteria.

#### `sortByDiscount(products: any[]): any[]`
Sorts products by discount percentage (highest first).

#### `calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number`
Calculates discount percentage.

#### `generateDiscountSummary(products: any[]): DiscountSummary`
Generates statistics about discounted products.

### Chat Handler Functions

#### `handleDiscountQuery(context: DiscountChatContext): Promise<DiscountChatResponse>`
Main handler for discount queries.

#### `processDiscountChat(userMessage: string, products: any[], history?: ChatMessage[]): Promise<DiscountChatResponse>`
Process chat with discount awareness and optional Coze AI enhancement.

#### `prepareDiscountSystemPrompt(products: any[]): string`
Generate system prompt with current discount context.

#### `sendToCozeAI(message: string, conversationId?: string): Promise<any>`
Send message to Coze AI bot.

## Product Data Structure

Ensure your products have the following structure for discount detection:

```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;              // Current price
  originalPrice?: number;     // Original price (required for discount detection)
  category?: string;
  platform?: string;
  imageUrl?: string;
  url?: string;
  stock?: number;
  rating?: number;
}
```

**Important**: Products must have both `price` and `originalPrice` fields for discount detection to work. If `originalPrice` is not set or equals `price`, the product will not be considered as having a discount.

## Customization

### Adjust Discount Threshold

Modify the minimum discount percentage considered "significant":

```typescript
import { hasSignificantDiscount } from '@/lib/discount-detector';

// Default threshold is 10%
const hasDiscount = hasSignificantDiscount(100, 85, 15); // 15% threshold
```

### Customize AI Responses

Edit the system prompt in `src/lib/ai-prompts/discount-assistant.ts`:

```typescript
export const DISCOUNT_SYSTEM_PROMPT = `
Your custom instructions here...
`;
```

### Add Custom Discount Keywords

Extend the discount detection keywords:

```typescript
// In discount-detector.ts
const customKeywords = ['clearance', 'flash sale', 'limited offer'];
```

## Troubleshooting

### Issue: No discounts detected

**Solution**: Ensure products have `originalPrice` field set and it's higher than `price`.

```typescript
// Correct format
const product = {
  price: 70,
  originalPrice: 100  // Must be higher than price
};
```

### Issue: Coze AI not responding

**Solution**: 
1. Verify `COZE_API_KEY` is set correctly
2. Check bot ID and space ID match your Coze bot
3. Ensure API endpoint is accessible
4. Check network connectivity

### Issue: Slow response times

**Solution**:
1. Limit the number of products processed
2. Implement caching for product data
3. Use pagination for large result sets
4. Consider using `MAX_DISCOUNT_RESULTS` environment variable

## Best Practices

1. **Cache Product Data**: Cache product information to reduce database queries
2. **Implement Rate Limiting**: Protect your API from excessive requests
3. **Use Pagination**: For large product catalogs, implement pagination
4. **Monitor Performance**: Track query processing times and optimize bottlenecks
5. **Update Regularly**: Keep discount information current with scheduled updates
6. **Error Handling**: Implement robust error handling for API failures
7. **User Feedback**: Collect user feedback to improve discount recommendations

## Advanced Features

### Price Alerts

Implement price drop notifications:

```typescript
import type { PriceAlert } from '@/types/discount.types';

const alert: PriceAlert = {
  id: 'alert-1',
  productId: 'product-123',
  targetPrice: 50,
  isActive: true,
  createdAt: new Date()
};
```

### Discount Analytics

Track discount trends over time:

```typescript
import type { DiscountAnalytics } from '@/types/discount.types';

const analytics: DiscountAnalytics = {
  period: 'week',
  totalDeals: 150,
  averageDiscount: 25,
  topCategories: [
    { category: 'Electronics', count: 45, averageDiscount: 30 }
  ],
  // ... more analytics data
};
```

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments in source files
3. Test with the provided examples
4. Check Coze AI documentation: https://www.coze.com/docs

## License

This discount detection system is part of your e-commerce application and follows the same license.

---

**Last Updated**: June 11, 2026
**Version**: 1.0.0