/**
 * Unified Multimodal Handler
 * Integrates image, voice, and file processing with Coze AI
 */

import {
  analyzeProductImage,
  compareProductImages,
  extractProductFromScreenshot,
  type ImageAnalysisResult,
} from './image-processor';

import {
  processVoiceInput,
  VoiceRecorder,
  textToSpeech,
  voiceDiscountSearch,
  type VoiceAnalysisResult,
} from './voice-processor';

import {
  processFile,
  batchProcessFiles,
  mergeFileResults,
  type FileAnalysisResult,
  type ExtractedProduct,
} from './file-processor';

export interface MultimodalInput {
  type: 'text' | 'image' | 'voice' | 'file';
  data: string | File | Blob | ArrayBuffer;
  metadata?: {
    fileName?: string;
    mimeType?: string;
    language?: string;
  };
}

export interface MultimodalResponse {
  type: 'text' | 'image' | 'voice' | 'file';
  content: string;
  products?: any[];
  analysis?: ImageAnalysisResult | VoiceAnalysisResult | FileAnalysisResult;
  suggestions?: string[];
  confidence: number;
  audioResponse?: Blob;
}

/**
 * Process any type of multimodal input
 */
export async function processMultimodalInput(
  input: MultimodalInput,
  options?: {
    generateVoiceResponse?: boolean;
    detectDiscounts?: boolean;
    compareProducts?: boolean;
  }
): Promise<MultimodalResponse> {
  const {
    generateVoiceResponse = false,
    detectDiscounts = true,
    compareProducts = false,
  } = options || {};

  try {
    let response: MultimodalResponse;

    switch (input.type) {
      case 'image':
        response = await processImageInput(input.data as string | File | Blob, {
          detectDiscounts,
          compareProducts,
        });
        break;

      case 'voice':
        response = await processVoiceInputHandler(input.data as Blob | File | ArrayBuffer, {
          language: input.metadata?.language,
        });
        break;

      case 'file':
        response = await processFileInput(input.data as File, {
          detectDiscounts,
        });
        break;

      case 'text':
      default:
        response = {
          type: 'text',
          content: input.data as string,
          confidence: 1.0,
        };
        break;
    }

    // Generate voice response if requested
    if (generateVoiceResponse && response.content) {
      try {
        const audioBlob = await textToSpeech(response.content, {
          language: input.metadata?.language || 'en-US',
        });
        response.audioResponse = audioBlob;
      } catch (error) {
        console.warn('Failed to generate voice response:', error);
      }
    }

    return response;
  } catch (error) {
    console.error('Error processing multimodal input:', error);
    throw error;
  }
}

/**
 * Process image input
 */
async function processImageInput(
  imageData: string | File | Blob,
  options: { detectDiscounts: boolean; compareProducts: boolean }
): Promise<MultimodalResponse> {
  const analysis = await analyzeProductImage(imageData, {
    detectPrices: true,
    detectDiscounts: options.detectDiscounts,
    detectPlatform: true,
    extractText: true,
  });

  // Generate response text
  let content = '📸 **Image Analysis Results**\n\n';

  if (analysis.productName) {
    content += `**Product**: ${analysis.productName}\n`;
  }

  if (analysis.detectedPrice) {
    content += `**Price**: $${analysis.detectedPrice}\n`;
  }

  if (analysis.originalPrice && analysis.discountPercentage) {
    content += `**Original Price**: $${analysis.originalPrice}\n`;
    content += `**Discount**: ${analysis.discountPercentage}% OFF\n`;
    content += `**Savings**: $${(analysis.originalPrice - analysis.detectedPrice!).toFixed(2)}\n`;
  }

  if (analysis.platform) {
    content += `**Platform**: ${analysis.platform}\n`;
  }

  if (analysis.discountBadges.length > 0) {
    content += `\n🏷️ **Discount Badges Found**:\n`;
    analysis.discountBadges.forEach(badge => {
      content += `- ${badge.text}\n`;
    });
  }

  content += `\n**Confidence**: ${(analysis.confidence * 100).toFixed(1)}%`;

  // Generate suggestions
  const suggestions: string[] = [];
  if (analysis.platform) {
    suggestions.push(`Find similar deals on ${analysis.platform}`);
  }
  if (analysis.detectedPrice) {
    suggestions.push(`Compare prices across platforms`);
  }
  suggestions.push('Upload another product image');

  return {
    type: 'image',
    content,
    analysis,
    suggestions,
    confidence: analysis.confidence,
  };
}

/**
 * Process voice input
 */
async function processVoiceInputHandler(
  audioData: Blob | File | ArrayBuffer,
  options: { language?: string }
): Promise<MultimodalResponse> {
  const analysis = await processVoiceInput(audioData, {
    language: options.language || 'en-US',
    detectIntent: true,
    extractEntities: true,
  });

  // Generate response text
  let content = '🎤 **Voice Query Understood**\n\n';
  content += `**You said**: "${analysis.transcript}"\n\n`;

  if (analysis.query.type === 'discount') {
    content += '🔍 **Searching for discounts**...\n\n';
  }

  if (analysis.query.filters) {
    content += '**Filters Applied**:\n';
    if (analysis.query.filters.minDiscount) {
      content += `- Minimum Discount: ${analysis.query.filters.minDiscount}%\n`;
    }
    if (analysis.query.filters.maxPrice) {
      content += `- Maximum Price: $${analysis.query.filters.maxPrice}\n`;
    }
    if (analysis.query.filters.platform) {
      content += `- Platform: ${analysis.query.filters.platform}\n`;
    }
  }

  content += `\n**Confidence**: ${(analysis.confidence * 100).toFixed(1)}%`;

  // Generate suggestions
  const suggestions = [
    'Refine your search',
    'Try another voice query',
    'Switch to text search',
  ];

  return {
    type: 'voice',
    content,
    analysis,
    suggestions,
    confidence: analysis.confidence,
  };
}

/**
 * Process file input
 */
async function processFileInput(
  file: File,
  options: { detectDiscounts: boolean }
): Promise<MultimodalResponse> {
  const analysis = await processFile(file, {
    extractProducts: true,
    detectDiscounts: options.detectDiscounts,
    validatePrices: true,
  });

  // Generate response text
  let content = '📄 **File Analysis Results**\n\n';
  content += `**File**: ${analysis.fileName}\n`;
  content += `**Products Found**: ${analysis.metadata.totalProducts}\n`;

  if (analysis.metadata.hasDiscounts) {
    const discountedProducts = analysis.products.filter(
      p => p.originalPrice && p.price < p.originalPrice
    );
    content += `**Products with Discounts**: ${discountedProducts.length}\n`;
  }

  if (analysis.metadata.platforms.length > 0) {
    content += `**Platforms**: ${analysis.metadata.platforms.join(', ')}\n`;
  }

  if (analysis.metadata.categories.length > 0) {
    content += `**Categories**: ${analysis.metadata.categories.join(', ')}\n`;
  }

  content += `**Price Range**: $${analysis.metadata.priceRange.min} - $${analysis.metadata.priceRange.max}\n`;
  content += `\n**Confidence**: ${(analysis.confidence * 100).toFixed(1)}%`;

  // Generate suggestions
  const suggestions = [
    'View all extracted products',
    'Filter by discount percentage',
    'Export to database',
    'Upload another file',
  ];

  return {
    type: 'file',
    content,
    products: analysis.products,
    analysis,
    suggestions,
    confidence: analysis.confidence,
  };
}

/**
 * Batch process multiple multimodal inputs
 */
export async function batchProcessMultimodal(
  inputs: MultimodalInput[]
): Promise<MultimodalResponse[]> {
  const results: MultimodalResponse[] = [];

  for (const input of inputs) {
    try {
      const result = await processMultimodalInput(input);
      results.push(result);
    } catch (error) {
      console.error('Error processing input:', error);
      results.push({
        type: input.type,
        content: `Error processing ${input.type} input`,
        confidence: 0,
      });
    }
  }

  return results;
}

/**
 * Compare products from multiple sources (images, files, voice)
 */
export async function compareMultimodalProducts(
  inputs: MultimodalInput[]
): Promise<{
  bestDeal: any;
  allProducts: any[];
  comparison: MultimodalResponse[];
  savings: number;
}> {
  const responses = await batchProcessMultimodal(inputs);
  const allProducts: any[] = [];

  responses.forEach(response => {
    if (response.products) {
      allProducts.push(...response.products);
    }
    if (response.analysis && 'detectedPrice' in response.analysis) {
      const imageAnalysis = response.analysis as ImageAnalysisResult;
      if (imageAnalysis.detectedPrice) {
        allProducts.push({
          name: imageAnalysis.productName || 'Unknown',
          price: imageAnalysis.detectedPrice,
          originalPrice: imageAnalysis.originalPrice,
          platform: imageAnalysis.platform,
        });
      }
    }
  });

  // Find best deal
  let bestDeal = allProducts[0];
  let lowestPrice = bestDeal?.price || Infinity;

  for (const product of allProducts) {
    if (product.price && product.price < lowestPrice) {
      lowestPrice = product.price;
      bestDeal = product;
    }
  }

  // Calculate savings
  const prices = allProducts.map(p => p.price).filter(p => p > 0);
  const maxPrice = Math.max(...prices);
  const savings = maxPrice - lowestPrice;

  return {
    bestDeal,
    allProducts,
    comparison: responses,
    savings,
  };
}

/**
 * Create a multimodal shopping assistant session
 */
export class MultimodalShoppingAssistant {
  private conversationHistory: MultimodalResponse[] = [];
  private voiceRecorder: VoiceRecorder | null = null;

  async processInput(input: MultimodalInput): Promise<MultimodalResponse> {
    const response = await processMultimodalInput(input, {
      generateVoiceResponse: input.type === 'voice',
      detectDiscounts: true,
    });

    this.conversationHistory.push(response);
    return response;
  }

  async startVoiceRecording(): Promise<void> {
    if (!this.voiceRecorder) {
      this.voiceRecorder = new VoiceRecorder();
    }
    await this.voiceRecorder.startRecording({
      maxDuration: 60,
      autoStop: true,
      noiseReduction: true,
    });
  }

  async stopVoiceRecording(): Promise<MultimodalResponse> {
    if (!this.voiceRecorder) {
      throw new Error('No active recording');
    }

    const audioBlob = await this.voiceRecorder.stopRecording();
    return this.processInput({
      type: 'voice',
      data: audioBlob,
    });
  }

  async uploadImage(image: File | Blob): Promise<MultimodalResponse> {
    return this.processInput({
      type: 'image',
      data: image,
    });
  }

  async uploadFile(file: File): Promise<MultimodalResponse> {
    return this.processInput({
      type: 'file',
      data: file,
      metadata: {
        fileName: file.name,
        mimeType: file.type,
      },
    });
  }

  getHistory(): MultimodalResponse[] {
    return this.conversationHistory;
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}

export default {
  processMultimodalInput,
  batchProcessMultimodal,
  compareMultimodalProducts,
  MultimodalShoppingAssistant,
};

// Made with Bob
