/**
 * Multimodal Image Processing with CNN Deep Learning
 * Handles product image recognition, price extraction, and discount detection
 */

export interface ImageAnalysisResult {
  productName?: string;
  detectedPrice?: number;
  originalPrice?: number;
  discountPercentage?: number;
  platform?: string;
  confidence: number;
  labels: string[];
  colors: string[];
  text: string[];
  objects: DetectedObject[];
  priceInfo: PriceInfo[];
  discountBadges: DiscountBadge[];
}

export interface DetectedObject {
  label: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface PriceInfo {
  price: number;
  currency: string;
  type: 'original' | 'discounted' | 'current';
  position: { x: number; y: number };
  confidence: number;
}

export interface DiscountBadge {
  text: string;
  percentage?: number;
  type: 'percentage' | 'amount' | 'label';
  position: { x: number; y: number };
  confidence: number;
}

/**
 * CNN-based image analysis using Coze AI Vision API
 */
export async function analyzeProductImage(
  imageData: string | File | Blob,
  options?: {
    detectPrices?: boolean;
    detectDiscounts?: boolean;
    detectPlatform?: boolean;
    extractText?: boolean;
  }
): Promise<ImageAnalysisResult> {
  const {
    detectPrices = true,
    detectDiscounts = true,
    detectPlatform = true,
    extractText = true,
  } = options || {};

  try {
    // Convert image to base64 if needed
    const base64Image = await convertToBase64(imageData);

    // Call Coze AI Vision API with CNN model
    const response = await fetch(`${process.env.COZE_API_ENDPOINT}/vision/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
        'X-API-Version': 'v3',
      },
      body: JSON.stringify({
        bot_id: process.env.COZE_BOT_ID,
        image: base64Image,
        tasks: {
          object_detection: true,
          text_extraction: extractText,
          price_detection: detectPrices,
          discount_detection: detectDiscounts,
          platform_detection: detectPlatform,
          color_analysis: true,
          label_classification: true,
        },
        model: 'cnn-vision-v3', // CNN deep learning model
      }),
    });

    if (!response.ok) {
      throw new Error(`Vision API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Process and structure the results
    return processVisionResults(data);
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

/**
 * Process CNN vision results into structured format
 */
function processVisionResults(data: any): ImageAnalysisResult {
  const result: ImageAnalysisResult = {
    confidence: data.confidence || 0,
    labels: data.labels || [],
    colors: data.colors || [],
    text: data.text || [],
    objects: [],
    priceInfo: [],
    discountBadges: [],
  };

  // Process detected objects
  if (data.objects) {
    result.objects = data.objects.map((obj: any) => ({
      label: obj.label,
      confidence: obj.confidence,
      boundingBox: obj.bounding_box,
    }));
  }

  // Process price information
  if (data.prices) {
    result.priceInfo = data.prices.map((price: any) => ({
      price: parseFloat(price.value),
      currency: price.currency || 'USD',
      type: price.type || 'current',
      position: price.position,
      confidence: price.confidence,
    }));

    // Determine original and discounted prices
    const originalPrice = result.priceInfo.find(p => p.type === 'original');
    const discountedPrice = result.priceInfo.find(p => p.type === 'discounted');

    if (originalPrice) result.originalPrice = originalPrice.price;
    if (discountedPrice) result.detectedPrice = discountedPrice.price;

    // Calculate discount percentage
    if (result.originalPrice && result.detectedPrice) {
      result.discountPercentage = Math.round(
        ((result.originalPrice - result.detectedPrice) / result.originalPrice) * 100
      );
    }
  }

  // Process discount badges
  if (data.discount_badges) {
    result.discountBadges = data.discount_badges.map((badge: any) => ({
      text: badge.text,
      percentage: badge.percentage,
      type: badge.type,
      position: badge.position,
      confidence: badge.confidence,
    }));
  }

  // Detect platform from image
  if (data.platform) {
    result.platform = data.platform.name;
  }

  // Extract product name from labels and text
  if (data.product_name) {
    result.productName = data.product_name;
  }

  return result;
}

/**
 * Convert various image formats to base64
 */
async function convertToBase64(imageData: string | File | Blob): Promise<string> {
  if (typeof imageData === 'string') {
    // Already base64 or URL
    if (imageData.startsWith('data:')) {
      return imageData;
    }
    if (imageData.startsWith('http')) {
      // Fetch and convert URL to base64
      const response = await fetch(imageData);
      const blob = await response.blob();
      return blobToBase64(blob);
    }
    return imageData;
  }

  if (imageData instanceof File || imageData instanceof Blob) {
    return blobToBase64(imageData);
  }

  throw new Error('Unsupported image format');
}

/**
 * Convert Blob to base64
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Batch process multiple images
 */
export async function batchAnalyzeImages(
  images: (string | File | Blob)[],
  options?: Parameters<typeof analyzeProductImage>[1]
): Promise<ImageAnalysisResult[]> {
  const results: ImageAnalysisResult[] = [];

  for (const image of images) {
    try {
      const result = await analyzeProductImage(image, options);
      results.push(result);
    } catch (error) {
      console.error('Error processing image:', error);
      results.push({
        confidence: 0,
        labels: [],
        colors: [],
        text: [],
        objects: [],
        priceInfo: [],
        discountBadges: [],
      });
    }
  }

  return results;
}

/**
 * Compare product images to find best deal
 */
export async function compareProductImages(
  images: (string | File | Blob)[]
): Promise<{
  bestDeal: ImageAnalysisResult;
  comparison: ImageAnalysisResult[];
  savings: number;
}> {
  const results = await batchAnalyzeImages(images, {
    detectPrices: true,
    detectDiscounts: true,
  });

  // Find best deal (lowest price or highest discount)
  let bestDeal = results[0];
  let lowestPrice = bestDeal.detectedPrice || Infinity;

  for (const result of results) {
    if (result.detectedPrice && result.detectedPrice < lowestPrice) {
      lowestPrice = result.detectedPrice;
      bestDeal = result;
    }
  }

  // Calculate potential savings
  const prices = results
    .map(r => r.detectedPrice)
    .filter((p): p is number => p !== undefined);
  const maxPrice = Math.max(...prices);
  const savings = maxPrice - lowestPrice;

  return {
    bestDeal,
    comparison: results,
    savings,
  };
}

/**
 * Extract product information from screenshot
 */
export async function extractProductFromScreenshot(
  screenshot: string | File | Blob
): Promise<{
  product: {
    name: string;
    price: number;
    originalPrice?: number;
    platform: string;
    discount?: number;
  };
  confidence: number;
}> {
  const analysis = await analyzeProductImage(screenshot, {
    detectPrices: true,
    detectDiscounts: true,
    detectPlatform: true,
    extractText: true,
  });

  return {
    product: {
      name: analysis.productName || 'Unknown Product',
      price: analysis.detectedPrice || 0,
      originalPrice: analysis.originalPrice,
      platform: analysis.platform || 'Unknown',
      discount: analysis.discountPercentage,
    },
    confidence: analysis.confidence,
  };
}

/**
 * Detect if image contains a discount/sale
 */
export function hasDiscountInImage(analysis: ImageAnalysisResult): boolean {
  // Check for discount badges
  if (analysis.discountBadges.length > 0) return true;

  // Check for price difference
  if (analysis.originalPrice && analysis.detectedPrice) {
    return analysis.detectedPrice < analysis.originalPrice;
  }

  // Check for discount keywords in text
  const discountKeywords = ['sale', 'off', 'discount', 'deal', 'save', '%'];
  const hasDiscountText = analysis.text.some(text =>
    discountKeywords.some(keyword => text.toLowerCase().includes(keyword))
  );

  return hasDiscountText;
}

export default {
  analyzeProductImage,
  batchAnalyzeImages,
  compareProductImages,
  extractProductFromScreenshot,
  hasDiscountInImage,
};

// Made with Bob
