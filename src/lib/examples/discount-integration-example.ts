/**
 * Discount Integration Examples
 * Practical examples for integrating discount detection with your chat system
 */

import { handleDiscountQuery, processDiscountChat } from '../discount-chat-handler';
import { 
  isDiscountQuery, 
  parseDiscountQuery, 
  filterProductsByDiscount,
  sortByDiscount,
  calculateDiscountPercentage 
} from '../discount-detector';
import type { DiscountedProduct, ChatMessage } from '../../types/discount.types';

/**
 * Example 1: Basic Integration with Chat API
 * Use this in your chat API route (e.g., src/routes/api/chat.ts)
 */
export async function exampleChatAPIIntegration(
  userMessage: string,
  products: any[],
  conversationHistory: ChatMessage[] = []
) {
  // Process the message with discount awareness
  const response = await processDiscountChat(
    userMessage,
    products,
    conversationHistory
  );

  return {
    success: true,
    data: {
      message: response.message,
      products: response.products,
      summary: response.summary,
      suggestions: response.suggestions,
      metadata: response.metadata
    }
  };
}

/**
 * Example 2: Manual Discount Detection
 * Use when you want more control over the process
 */
export async function exampleManualDiscountDetection(
  userMessage: string,
  products: any[]
) {
  // Step 1: Check if it's a discount query
  if (!isDiscountQuery(userMessage)) {
    return {
      isDiscountQuery: false,
      message: "This doesn't appear to be a discount-related query."
    };
  }

  // Step 2: Parse the query to extract parameters
  const query = parseDiscountQuery(userMessage);
  console.log('Parsed query:', query);

  // Step 3: Filter products with discounts
  const discountedProducts = products.filter(p => 
    p.originalPrice && p.price < p.originalPrice
  );

  // Step 4: Apply user's filters
  let filteredProducts = filterProductsByDiscount(discountedProducts, query);

  // Step 5: Sort by discount percentage
  filteredProducts = sortByDiscount(filteredProducts);

  // Step 6: Return results
  return {
    isDiscountQuery: true,
    queryType: query.type,
    totalResults: filteredProducts.length,
    products: filteredProducts.slice(0, 10), // Top 10
    message: `Found ${filteredProducts.length} products matching your criteria`
  };
}

/**
 * Example 3: Integration with React Component
 * Use this pattern in your assistant component
 */
export class DiscountChatManager {
  private products: any[] = [];
  private conversationHistory: ChatMessage[] = [];

  constructor(products: any[]) {
    this.products = products;
  }

  async sendMessage(userMessage: string): Promise<{
    message: string;
    products?: any[];
    suggestions?: string[];
  }> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    // Process with discount handler
    const response = await handleDiscountQuery({
      products: this.products,
      userQuery: userMessage,
      conversationHistory: this.conversationHistory
    });

    // Add assistant response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      metadata: response.metadata
    });

    return {
      message: response.message,
      products: response.products,
      suggestions: response.suggestions
    };
  }

  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}

/**
 * Example 4: Product Card Enhancement
 * Add discount badges to your product cards
 */
export function enhanceProductWithDiscount(product: any): DiscountedProduct {
  const hasDiscount = product.originalPrice && product.price < product.originalPrice;
  
  if (!hasDiscount) {
    return {
      ...product,
      discountPercentage: 0,
      discountAmount: 0,
      isActive: false
    };
  }

  const discountPercentage = calculateDiscountPercentage(
    product.originalPrice,
    product.price
  );

  const discountAmount = product.originalPrice - product.price;

  return {
    ...product,
    discountPercentage,
    discountAmount,
    isActive: true
  };
}

/**
 * Example 5: Real-time Discount Filtering
 * Use in a product listing page with filters
 */
export function filterProductsRealtime(
  products: any[],
  filters: {
    minDiscount?: number;
    maxPrice?: number;
    category?: string;
    platform?: string;
  }
) {
  let filtered = products.filter(p => 
    p.originalPrice && p.price < p.originalPrice
  );

  if (filters.minDiscount !== undefined) {
    filtered = filtered.filter(p => {
      const discount = calculateDiscountPercentage(p.originalPrice, p.price);
      return discount >= filters.minDiscount!;
    });
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice!);
  }

  if (filters.category) {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  if (filters.platform) {
    filtered = filtered.filter(p => p.platform === filters.platform);
  }

  return sortByDiscount(filtered);
}

/**
 * Example 6: Discount Notification System
 * Check for new deals and notify users
 */
export async function checkForNewDeals(
  previousProducts: any[],
  currentProducts: any[],
  minDiscountThreshold: number = 20
): Promise<{
  newDeals: any[];
  improvedDeals: any[];
}> {
  const newDeals: any[] = [];
  const improvedDeals: any[] = [];

  currentProducts.forEach(current => {
    const previous = previousProducts.find(p => p.id === current.id);
    
    if (!previous) {
      // New product with discount
      const discount = calculateDiscountPercentage(
        current.originalPrice || current.price,
        current.price
      );
      if (discount >= minDiscountThreshold) {
        newDeals.push(current);
      }
    } else {
      // Existing product with improved discount
      const previousDiscount = calculateDiscountPercentage(
        previous.originalPrice || previous.price,
        previous.price
      );
      const currentDiscount = calculateDiscountPercentage(
        current.originalPrice || current.price,
        current.price
      );
      
      if (currentDiscount > previousDiscount && currentDiscount >= minDiscountThreshold) {
        improvedDeals.push({
          ...current,
          previousDiscount,
          currentDiscount,
          improvement: currentDiscount - previousDiscount
        });
      }
    }
  });

  return { newDeals, improvedDeals };
}

/**
 * Example 7: Discount Summary Widget
 * Generate summary for dashboard or homepage
 */
export function generateDiscountWidget(products: any[]) {
  const discountedProducts = products.filter(p => 
    p.originalPrice && p.price < p.originalPrice
  );

  if (discountedProducts.length === 0) {
    return {
      hasDeals: false,
      message: "No active deals at the moment"
    };
  }

  const sorted = sortByDiscount(discountedProducts);
  const topDeals = sorted.slice(0, 3);

  const totalSavings = discountedProducts.reduce((sum, p) => {
    return sum + (p.originalPrice - p.price);
  }, 0);

  const avgDiscount = discountedProducts.reduce((sum, p) => {
    return sum + calculateDiscountPercentage(p.originalPrice, p.price);
  }, 0) / discountedProducts.length;

  return {
    hasDeals: true,
    totalDeals: discountedProducts.length,
    topDeals,
    totalSavings: Math.round(totalSavings * 100) / 100,
    averageDiscount: Math.round(avgDiscount),
    message: `${discountedProducts.length} active deals with up to ${Math.round(calculateDiscountPercentage(topDeals[0].originalPrice, topDeals[0].price))}% off!`
  };
}

/**
 * Example 8: Usage in React Component
 */
export const ReactComponentExample = `
import { useState, useEffect } from 'react';
import { DiscountChatManager } from '@/lib/examples/discount-integration-example';

export function DiscountAssistant({ products }) {
  const [chatManager] = useState(() => new DiscountChatManager(products));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const response = await chatManager.sendMessage(input);
    
    setMessages(chatManager.getHistory());
    setSuggestions(response.suggestions || []);
    setInput('');
  };

  return (
    <div className="discount-assistant">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={\`message \${msg.role}\`}>
            {msg.content}
          </div>
        ))}
      </div>
      
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((suggestion, i) => (
            <button key={i} onClick={() => setInput(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Ask about discounts..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
`;

// Export all examples
export default {
  exampleChatAPIIntegration,
  exampleManualDiscountDetection,
  DiscountChatManager,
  enhanceProductWithDiscount,
  filterProductsRealtime,
  checkForNewDeals,
  generateDiscountWidget,
  ReactComponentExample
};

// Made with Bob
