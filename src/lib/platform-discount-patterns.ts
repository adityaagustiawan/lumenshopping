/**
 * E-commerce Platform Discount Patterns Configuration
 * Comprehensive knowledge base for discount detection across all major platforms
 * Updated: June 2026
 */

export interface PlatformDiscountPattern {
  name: string;
  displayName: string;
  discountTypes: string[];
  priceFormats: string[];
  badgeKeywords: string[];
  timeSensitiveKeywords: string[];
  specialFeatures: string[];
  tips: string[];
  apiEndpoint?: string;
  color?: string;
  icon?: string;
}

export const PLATFORM_DISCOUNT_PATTERNS: Record<string, PlatformDiscountPattern> = {
  amazon: {
    name: 'amazon',
    displayName: 'Amazon',
    discountTypes: [
      'Lightning Deal',
      'Deal of the Day',
      'Prime Day',
      'Black Friday',
      'Cyber Monday',
      'Subscribe & Save',
      'Warehouse Deals',
      'Coupons',
      'Prime Exclusive',
      'Today\'s Deals'
    ],
    priceFormats: [
      '$XX.XX',
      'Was: $XX.XX',
      'List Price: $XX.XX',
      'You Save: $XX.XX (XX%)'
    ],
    badgeKeywords: [
      'Limited time deal',
      'Save X%',
      'Coupon',
      'Prime',
      'Lightning Deal',
      'Deal of the Day',
      'Subscribe & Save'
    ],
    timeSensitiveKeywords: [
      'Lightning Deal',
      'Ends in',
      'Limited time',
      'Today only',
      'Hourly deal'
    ],
    specialFeatures: [
      'Subscribe & Save: 5-15% recurring discount',
      'Prime members get exclusive deals',
      'Warehouse Deals: Open-box items up to 50% off',
      'Lightning Deals refresh hourly',
      'Clip coupons for additional savings',
      'Price drop alerts available'
    ],
    tips: [
      'Check Lightning Deals hourly for best offers',
      'Subscribe & Save adds 5-15% extra discount',
      'Prime members get 30-minute early access to deals',
      'Warehouse Deals section has open-box discounts',
      'Use CamelCamelCamel to track price history',
      'Best deals during Prime Day (July) and Black Friday'
    ],
    color: '#FF9900',
    icon: '📦'
  },

  shopify: {
    name: 'shopify',
    displayName: 'Shopify Stores',
    discountTypes: [
      'Flash Sale',
      'Seasonal Sale',
      'Clearance',
      'Bundle Deal',
      'First Order Discount',
      'Email Signup Discount',
      'BOGO (Buy One Get One)',
      'Volume Discount'
    ],
    priceFormats: [
      '$XX.XX',
      'Compare at $XX.XX',
      'Regular price: $XX.XX',
      'Sale price: $XX.XX'
    ],
    badgeKeywords: [
      'On Sale',
      'X% Off',
      'Save $X',
      'Flash Sale',
      'Limited Edition',
      'Clearance'
    ],
    timeSensitiveKeywords: [
      'Flash Sale',
      'Limited time',
      'Ends soon',
      'Today only',
      '24 hours'
    ],
    specialFeatures: [
      'Email signup typically gives 10-15% off',
      'Bundle deals for multiple items',
      'First-time customer discounts common',
      'Abandoned cart recovery emails with discounts',
      'Loyalty programs available',
      'Social media exclusive codes'
    ],
    tips: [
      'Sign up for email to get 10-15% off first order',
      'Check for bundle deals to maximize savings',
      'Flash sales often happen on weekends',
      'Follow stores on social media for exclusive codes',
      'Abandoned cart may trigger discount email',
      'Check reviews before buying from new stores'
    ],
    color: '#96BF48',
    icon: '🛍️'
  },

  woocommerce: {
    name: 'woocommerce',
    displayName: 'WooCommerce',
    discountTypes: [
      'Sale',
      'Clearance',
      'Special Offer',
      'Coupon Code',
      'Volume Discount',
      'Member Discount',
      'Seasonal Sale'
    ],
    priceFormats: [
      '$XX.XX',
      'Regular price: $XX.XX',
      'Sale price: $XX.XX',
      'Was $XX.XX Now $XX.XX'
    ],
    badgeKeywords: [
      'Sale!',
      'Reduced',
      'Special Price',
      'Clearance',
      'Discount'
    ],
    timeSensitiveKeywords: [
      'Limited time',
      'Sale ends',
      'While stocks last',
      'Clearance'
    ],
    specialFeatures: [
      'Coupon codes for percentage or fixed discounts',
      'Volume pricing for bulk orders',
      'Member-only deals available',
      'Cart-level discounts possible',
      'Product bundles with savings'
    ],
    tips: [
      'Look for coupon codes before checkout',
      'Check for volume discounts on bulk orders',
      'Create account for member-only deals',
      'Clearance sections often have deep discounts',
      'Newsletter signup may provide discount code'
    ],
    color: '#96588A',
    icon: '🛒'
  },

  ebay: {
    name: 'ebay',
    displayName: 'eBay',
    discountTypes: [
      'Best Offer',
      'Auction',
      'Daily Deals',
      'Seller Promotion',
      'Bulk Discount',
      'Coupon'
    ],
    priceFormats: [
      'US $XX.XX',
      'Was: US $XX.XX',
      'List price: US $XX.XX',
      'X% off'
    ],
    badgeKeywords: [
      'X% off',
      'Save',
      'Discount',
      'Best Offer',
      'Daily Deal'
    ],
    timeSensitiveKeywords: [
      'Auction ending',
      'Daily Deal',
      'Limited quantity',
      'Ends in'
    ],
    specialFeatures: [
      'Make offers on Best Offer listings',
      'Auction-style bidding for best prices',
      'Daily Deals section updated regularly',
      'Seller promotions vary by store',
      'Bulk purchase discounts available'
    ],
    tips: [
      'Use Best Offer to negotiate lower prices',
      'Watch auctions and bid in final minutes',
      'Check Daily Deals for time-limited offers',
      'Filter by "Buy It Now" for instant purchase',
      'Look for sellers with high ratings',
      'Consider shipping costs in total price'
    ],
    color: '#E53238',
    icon: '🔨'
  },

  aliexpress: {
    name: 'aliexpress',
    displayName: 'AliExpress',
    discountTypes: [
      'Flash Deal',
      'Super Deal',
      'Choice Day',
      'Anniversary Sale',
      'New User Discount',
      'Coins Discount',
      'Coupon',
      'Bulk Discount'
    ],
    priceFormats: [
      'US $XX.XX',
      'Original: US $XX.XX',
      'XX% OFF',
      'Save US $XX.XX'
    ],
    badgeKeywords: [
      'X% OFF',
      'Limited Offer',
      'Hot Sale',
      'Flash Deal',
      'Super Deal',
      'Choice'
    ],
    timeSensitiveKeywords: [
      'Flash Deal',
      'Limited time',
      'Ends in',
      'Hourly update',
      'Today only'
    ],
    specialFeatures: [
      'New users get up to 50% off first order',
      'Collect coins daily for discounts',
      'Choice Day monthly mega sales',
      'Bulk orders get better prices',
      'Seller coupons stackable',
      'Free shipping on many items'
    ],
    tips: [
      'New user? Get up to 50% off first order',
      'Collect coins daily for extra discounts',
      'Choice Day (monthly) has best deals',
      'Bulk orders often get better unit prices',
      'Check seller ratings and reviews carefully',
      'Use AliExpress app for exclusive deals',
      'Shipping can take 2-4 weeks - plan ahead'
    ],
    color: '#E62E04',
    icon: '🌏'
  },

  walmart: {
    name: 'walmart',
    displayName: 'Walmart',
    discountTypes: [
      'Rollback',
      'Clearance',
      'Special Buy',
      'Reduced Price',
      'Online Only',
      'Pickup Discount'
    ],
    priceFormats: [
      '$XX.XX',
      'Was $XX.XX',
      'Save $XX.XX',
      'Rollback'
    ],
    badgeKeywords: [
      'Rollback',
      'Save',
      'Clearance',
      'Special Buy',
      'Reduced'
    ],
    timeSensitiveKeywords: [
      'Limited time',
      'While supplies last',
      'Clearance',
      'Special Buy'
    ],
    specialFeatures: [
      'Rollback: Temporary price reductions',
      'Clearance: Final markdowns',
      'Special Buy: Limited-time bulk deals',
      'Pickup discount: Save by choosing store pickup',
      'Price match guarantee available',
      'Walmart+ members get free shipping'
    ],
    tips: [
      'Rollback prices are temporary - buy quickly',
      'Choose store pickup to save on shipping',
      'Check clearance section for deep discounts',
      'Price match guarantee - show lower price',
      'Walmart+ membership includes free shipping',
      'Best clearance deals at end of season'
    ],
    color: '#0071CE',
    icon: '🏪'
  },

  target: {
    name: 'target',
    displayName: 'Target',
    discountTypes: [
      'Circle Offer',
      'Weekly Ad',
      'Clearance',
      'RedCard Discount',
      'Deal of the Day',
      'Cartwheel'
    ],
    priceFormats: [
      '$XX.XX',
      'reg $XX.XX',
      'Save X%',
      'Circle Offer'
    ],
    badgeKeywords: [
      'Deal',
      'Save X%',
      'Clearance',
      'Circle',
      'RedCard'
    ],
    timeSensitiveKeywords: [
      'Deal of the Day',
      'Weekly Ad',
      'Limited time',
      'Ends Sunday'
    ],
    specialFeatures: [
      'Circle Offers: Personalized deals',
      'RedCard: 5% off everything',
      'Weekly Ad: New deals every Sunday',
      'Clearance: Red sticker markdowns',
      'Price match guarantee',
      'Free shipping on $35+ orders'
    ],
    tips: [
      'Use Target Circle for personalized deals',
      'RedCard saves 5% on every purchase',
      'Check Weekly Ad for new deals every Sunday',
      'Clearance items marked with red stickers',
      'Stack Circle offers with sales',
      'Best clearance at end of season (30-70% off)'
    ],
    color: '#CC0000',
    icon: '🎯'
  },

  etsy: {
    name: 'etsy',
    displayName: 'Etsy',
    discountTypes: [
      'Sale',
      'Coupon Code',
      'Free Shipping',
      'Bulk Discount',
      'Seasonal Sale'
    ],
    priceFormats: [
      '$XX.XX',
      'Original Price: $XX.XX',
      'Sale Price: $XX.XX',
      'XX% off'
    ],
    badgeKeywords: [
      'Sale',
      'XX% off',
      'Free shipping',
      'Discount'
    ],
    timeSensitiveKeywords: [
      'Limited time',
      'Sale ends',
      'While supplies last'
    ],
    specialFeatures: [
      'Handmade and vintage items',
      'Seller-specific coupon codes',
      'Free shipping promotions',
      'Bulk order discounts',
      'Favorites for price drop alerts'
    ],
    tips: [
      'Message sellers to negotiate on custom orders',
      'Look for shops with sale sections',
      'Free shipping often available on $35+',
      'Favorite items to get price drop notifications',
      'Check reviews before purchasing'
    ],
    color: '#F1641E',
    icon: '🎨'
  },

  bestbuy: {
    name: 'bestbuy',
    displayName: 'Best Buy',
    discountTypes: [
      'Deal of the Day',
      'Open-Box',
      'Clearance',
      'Student Discount',
      'My Best Buy Rewards',
      'Price Match'
    ],
    priceFormats: [
      '$XX.XX',
      'Was $XX.XX',
      'Save $XX.XX',
      'Open-Box: $XX.XX'
    ],
    badgeKeywords: [
      'Deal of the Day',
      'Save',
      'Open-Box',
      'Clearance',
      'Student Discount'
    ],
    timeSensitiveKeywords: [
      'Deal of the Day',
      'Limited time',
      'While supplies last',
      'Today only'
    ],
    specialFeatures: [
      'Open-Box items: 10-50% off',
      'Student discounts available',
      'My Best Buy Rewards points',
      'Price match guarantee',
      'Geek Squad protection plans',
      'Free shipping on most items'
    ],
    tips: [
      'Check Open-Box section for big savings',
      'Students get exclusive discounts',
      'Price match within 15 days of purchase',
      'My Best Buy members get early access to deals',
      'Black Friday and holiday sales have best prices',
      'Consider extended warranty on electronics'
    ],
    color: '#0046BE',
    icon: '💻'
  },

  costco: {
    name: 'costco',
    displayName: 'Costco',
    discountTypes: [
      'Instant Savings',
      'Manager\'s Special',
      'Clearance',
      'Warehouse Coupon',
      'Online Only'
    ],
    priceFormats: [
      '$XX.XX',
      'Instant Savings: $XX.XX',
      'After Coupon: $XX.XX'
    ],
    badgeKeywords: [
      'Instant Savings',
      'Manager\'s Special',
      'Clearance',
      'Coupon'
    ],
    timeSensitiveKeywords: [
      'Limited time',
      'While supplies last',
      'Manager\'s Special'
    ],
    specialFeatures: [
      'Membership required',
      'Bulk pricing saves money',
      'Instant savings on select items',
      'Warehouse coupons monthly',
      'Price ending in .97 = clearance',
      'Executive members get 2% back'
    ],
    tips: [
      'Membership pays for itself with savings',
      'Prices ending in .97 are clearance items',
      'Check monthly coupon book for deals',
      'Executive membership gives 2% cash back',
      'Buy in bulk to maximize per-unit savings',
      'Kirkland brand offers great value'
    ],
    color: '#0066B2',
    icon: '🏬'
  }
};

/**
 * Get platform configuration by name
 */
export function getPlatformConfig(platformName: string): PlatformDiscountPattern | null {
  const normalizedName = platformName.toLowerCase().trim();
  return PLATFORM_DISCOUNT_PATTERNS[normalizedName] || null;
}

/**
 * Get all supported platforms
 */
export function getAllPlatforms(): PlatformDiscountPattern[] {
  return Object.values(PLATFORM_DISCOUNT_PATTERNS);
}

/**
 * Detect platform from product URL or text
 */
export function detectPlatformFromText(text: string): PlatformDiscountPattern | null {
  const lowerText = text.toLowerCase();
  
  for (const [key, platform] of Object.entries(PLATFORM_DISCOUNT_PATTERNS)) {
    if (lowerText.includes(key) || lowerText.includes(platform.displayName.toLowerCase())) {
      return platform;
    }
  }
  
  return null;
}

/**
 * Get platform-specific discount keywords
 */
export function getPlatformDiscountKeywords(platformName: string): string[] {
  const platform = getPlatformConfig(platformName);
  if (!platform) return [];
  
  return [
    ...platform.discountTypes,
    ...platform.badgeKeywords,
    ...platform.timeSensitiveKeywords
  ];
}

/**
 * Check if text contains platform-specific discount indicators
 */
export function hasPlatformDiscountIndicators(text: string, platformName: string): boolean {
  const keywords = getPlatformDiscountKeywords(platformName);
  const lowerText = text.toLowerCase();
  
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

export default PLATFORM_DISCOUNT_PATTERNS;

// Made with Bob
