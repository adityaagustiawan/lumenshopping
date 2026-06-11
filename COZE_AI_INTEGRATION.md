# Coze AI Integration Guide - E-commerce Discount Assistant

## 🤖 Overview

This guide explains how to integrate and configure the Coze AI bot for intelligent discount detection across all major e-commerce platforms.

**Bot Details:**
- **Bot ID**: `7649776912948330549`
- **Space ID**: `7649761455071330320`
- **Bot URL**: https://www.coze.com/space/7649761455071330320/bot/7649776912948330549
- **API Version**: v3 (2026)

---

## 🎯 What the AI Bot Knows

The Coze AI bot has been trained with comprehensive knowledge about:

### E-commerce Platforms (10+)
1. **Amazon** - Lightning Deals, Prime Day, Subscribe & Save
2. **Shopify** - Flash Sales, Bundle Deals, Email Discounts
3. **WooCommerce** - Coupon Codes, Volume Discounts, Member Deals
4. **eBay** - Best Offers, Auctions, Daily Deals
5. **AliExpress** - Flash Deals, Choice Day, New User Discounts
6. **Walmart** - Rollbacks, Clearance, Special Buys
7. **Target** - Circle Offers, RedCard Savings, Weekly Ads
8. **Etsy** - Handmade Sales, Seller Coupons
9. **Best Buy** - Open-Box Deals, Student Discounts
10. **Costco** - Instant Savings, Warehouse Coupons

### Discount Types (50+)
- Lightning Deals, Flash Sales, Daily Deals
- Clearance, Rollbacks, Markdowns
- Coupon Codes, Promo Codes, Vouchers
- Bundle Deals, Volume Discounts, BOGO
- Member Exclusives, Student Discounts
- Seasonal Sales, Holiday Deals
- And many more...

### Smart Capabilities
- ✅ Multi-platform price comparison
- ✅ Historical price analysis
- ✅ Discount quality assessment
- ✅ Time-sensitive deal detection
- ✅ Platform-specific tips and strategies
- ✅ Cross-platform recommendations
- ✅ Budget optimization
- ✅ Semantic search understanding

---

## 🔧 Setup Instructions

### 1. Environment Configuration

Add these variables to your `.env` file:

```bash
# Coze AI Configuration
COZE_API_KEY="your-api-key-here"
COZE_BOT_ID="7649776912948330549"
COZE_SPACE_ID="7649761455071330320"
COZE_API_ENDPOINT="https://api.coze.com/v1/chat"

# Feature Flags
ENABLE_DISCOUNT_DETECTION="true"
MIN_DISCOUNT_THRESHOLD="10"
MAX_DISCOUNT_RESULTS="20"
```

### 2. Get Your API Key

1. Visit: https://www.coze.com/space/7649761455071330320/bot/7649776912948330549
2. Navigate to **Bot Settings** → **API Keys**
3. Click **Generate New Key** or copy existing key
4. Add the key to your `.env` file as `COZE_API_KEY`

### 3. Test the Connection

```typescript
import { sendToCozeAI } from '@/lib/discount-chat-handler';

// Test basic connection
const response = await sendToCozeAI(
  "Show me the best deals on electronics",
  "test-user-123"
);

console.log(response);
```

---

## 💬 Example Queries the AI Understands

### General Discount Queries
```
"Show me products with discounts"
"What are the best deals today?"
"Find me some bargains"
"Any sales happening now?"
```

### Platform-Specific Queries
```
"Show me Amazon Lightning Deals"
"What's on sale at Walmart?"
"AliExpress flash deals under $50"
"Target Circle offers this week"
```

### Category-Specific Queries
```
"Electronics with at least 30% off"
"Discounted clothing items"
"Cheap home goods on sale"
"Best deals on beauty products"
```

### Budget-Conscious Queries
```
"Deals under $100"
"Products under $50 with 20% off"
"Affordable items with discounts"
"Best value for money deals"
```

### Comparison Queries
```
"Compare prices for [product name]"
"Which platform has the best deal on [item]?"
"Show me the same product across different stores"
```

### Time-Sensitive Queries
```
"Flash sales ending soon"
"Limited time offers"
"Today's best deals"
"Deals expiring this week"
```

---

## 🎨 Response Format

The AI provides structured responses with:

### 1. Deal Summary
```
📊 Summary:
- Total Products: 247
- Average Discount: 35%
- Best Deal: 55% OFF
- Total Savings: $2,847.50
```

### 2. Top Deals List
```
🏆 Top Deals:

1. **Wireless Headphones** - Amazon
   💰 ~~$149.99~~ → $74.99 (50% OFF)
   💵 Save: $75.00
   ⏰ Lightning Deal ends in 3 hours!
   📊 Lowest price in 12 months

2. **Smart Watch** - AliExpress
   💰 ~~$199.00~~ → $89.99 (55% OFF)
   💵 Save: $109.01
   🎁 New user? Get additional 10% off!
```

### 3. Platform-Specific Tips
```
💡 Pro Tips for Amazon:
- Check Lightning Deals hourly
- Subscribe & Save adds 5-15% discount
- Prime members get early access
- Warehouse Deals have open-box discounts
```

### 4. Follow-up Suggestions
```
🔍 You might also want to:
- Show me deals with 40% or more discount
- Filter by electronics category
- See deals under $50
- Compare prices across platforms
```

---

## 🔌 Integration Examples

### Basic Chat Integration

```typescript
import { processDiscountChat } from '@/lib/discount-chat-handler';

async function handleUserMessage(message: string, products: any[]) {
  const response = await processDiscountChat(
    message,
    products,
    conversationHistory
  );
  
  return {
    message: response.message,
    products: response.products,
    summary: response.summary,
    suggestions: response.suggestions
  };
}
```

### With Platform Context

```typescript
import { sendToCozeAI } from '@/lib/discount-chat-handler';

const response = await sendToCozeAI(
  "Show me Amazon deals",
  "user-123",
  {
    products: allProducts,
    platformFilter: "amazon",
    userPreferences: {
      maxPrice: 100,
      minDiscount: 20
    }
  }
);
```

### Batch Processing

```typescript
import { batchProcessDiscountQueries } from '@/lib/discount-chat-handler';

const queries = [
  "Best electronics deals",
  "Clothing under $50",
  "Amazon Lightning Deals"
];

const results = await batchProcessDiscountQueries(queries, products);
```

### Platform Insights

```typescript
import { getPlatformInsights } from '@/lib/discount-chat-handler';

const insights = getPlatformInsights(products, "amazon");

console.log(`
  Total Products: ${insights.totalProducts}
  Average Discount: ${insights.averageDiscount}%
  Best Deal: ${insights.bestDeal.name}
  Tips: ${insights.platformSpecificTips.join(', ')}
`);
```

---

## 🎓 Training the AI Bot

### Custom Knowledge Base

To add custom knowledge to your Coze AI bot:

1. Go to bot settings in Coze dashboard
2. Navigate to **Knowledge Base** section
3. Add documents with:
   - Your product catalog
   - Custom discount rules
   - Brand-specific promotions
   - Seasonal sale schedules

### Recommended Training Data

Upload these types of documents:
- Product catalogs with pricing
- Historical discount data
- Platform-specific deal patterns
- Customer FAQ about discounts
- Seasonal promotion calendars

---

## 🔍 Advanced Features

### 1. Historical Price Tracking

```typescript
// The AI can reference historical prices
"Is this the lowest price for [product]?"
"Show me price history for [item]"
"When was this product cheaper?"
```

### 2. Predictive Discounts

```typescript
// AI predicts future discounts
"When will [product] go on sale?"
"Should I wait for a better deal?"
"Predict next discount for [category]"
```

### 3. Smart Bundling

```typescript
// AI suggests bundle opportunities
"What items should I buy together to save more?"
"Show me bundle deals"
"Combine these products for best price"
```

### 4. Price Match Assistance

```typescript
// AI helps with price matching
"Which stores offer price matching?"
"Show me proof for price match"
"Compare [product] across all platforms"
```

---

## 📊 Analytics & Monitoring

### Track AI Performance

```typescript
import { processDiscountChat } from '@/lib/discount-chat-handler';

const response = await processDiscountChat(message, products);

// Log analytics
console.log({
  queryType: response.metadata.queryType,
  hasDiscounts: response.metadata.hasDiscounts,
  processingTime: response.metadata.processingTime,
  productsFound: response.products?.length || 0
});
```

### Monitor API Usage

Check your Coze AI dashboard for:
- API call volume
- Response times
- Error rates
- User satisfaction scores

---

## 🛠️ Troubleshooting

### Common Issues

**1. API Key Not Working**
```bash
# Verify key is set correctly
echo $COZE_API_KEY

# Check key permissions in Coze dashboard
# Regenerate key if needed
```

**2. No Discount Results**
```typescript
// Ensure products have discount data
products.forEach(p => {
  if (!p.originalPrice) {
    console.warn(`Product ${p.name} missing originalPrice`);
  }
});
```

**3. Slow Response Times**
```typescript
// Use batch processing for multiple queries
// Implement caching for frequent queries
// Limit product context to top 100 items
```

**4. Platform Not Detected**
```typescript
import { detectPlatform } from '@/lib/discount-detector';

const platform = detectPlatform(query, product);
if (!platform) {
  console.warn('Platform not detected, using default');
}
```

---

## 🔐 Security Best Practices

1. **Never expose API keys** in client-side code
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** to prevent abuse
4. **Validate user input** before sending to AI
5. **Sanitize AI responses** before displaying to users
6. **Monitor API usage** for unusual patterns
7. **Rotate API keys** regularly

---

## 📈 Performance Optimization

### Caching Strategy

```typescript
// Cache frequent queries
const cache = new Map();

async function getCachedResponse(query: string) {
  if (cache.has(query)) {
    return cache.get(query);
  }
  
  const response = await processDiscountChat(query, products);
  cache.set(query, response);
  
  return response;
}
```

### Limit Product Context

```typescript
// Send only relevant products to AI
const relevantProducts = products
  .filter(p => p.originalPrice && p.price < p.originalPrice)
  .slice(0, 100); // Limit to top 100

const response = await sendToCozeAI(message, userId, {
  products: relevantProducts
});
```

---

## 🎯 Best Practices

1. **Always provide context** - Send relevant product data with queries
2. **Use platform filters** - Narrow down results for better performance
3. **Implement fallbacks** - Have local processing if AI is unavailable
4. **Cache responses** - Store frequent queries to reduce API calls
5. **Monitor costs** - Track API usage and optimize accordingly
6. **Update regularly** - Keep platform patterns up to date
7. **Test thoroughly** - Verify AI responses match expectations

---

## 📞 Support

- **Coze AI Documentation**: https://www.coze.com/docs
- **Bot Dashboard**: https://www.coze.com/space/7649761455071330320/bot/7649776912948330549
- **API Reference**: https://www.coze.com/docs/api
- **Community Forum**: https://community.coze.com

---

## 🔄 Updates & Maintenance

### Regular Updates Needed

- ✅ Update platform discount patterns quarterly
- ✅ Refresh API keys annually
- ✅ Review and update training data monthly
- ✅ Monitor and optimize performance weekly
- ✅ Test new platform integrations as they launch

### Version History

- **v3.0 (June 2026)**: Multi-platform support, enhanced AI
- **v2.0 (Jan 2026)**: Coze AI integration
- **v1.0 (2025)**: Initial discount detection

---

**Last Updated**: June 11, 2026  
**API Version**: v3  
**Bot Version**: 3.0.0