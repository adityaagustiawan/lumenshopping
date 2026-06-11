/**
 * Multimodal File Processing
 * Handles document uploads (PDF, Excel, CSV) for product catalogs and price lists
 */

export interface FileAnalysisResult {
  fileName: string;
  fileType: string;
  fileSize: number;
  products: ExtractedProduct[];
  metadata: {
    totalProducts: number;
    hasDiscounts: boolean;
    platforms: string[];
    categories: string[];
    priceRange: { min: number; max: number };
  };
  confidence: number;
}

export interface ExtractedProduct {
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  platform?: string;
  category?: string;
  description?: string;
  sku?: string;
  url?: string;
  imageUrl?: string;
  confidence: number;
}

/**
 * Process uploaded file (PDF, Excel, CSV, etc.)
 */
export async function processFile(
  file: File,
  options?: {
    extractProducts?: boolean;
    detectDiscounts?: boolean;
    validatePrices?: boolean;
  }
): Promise<FileAnalysisResult> {
  const {
    extractProducts = true,
    detectDiscounts = true,
    validatePrices = true,
  } = options || {};

  try {
    // Convert file to base64
    const base64File = await fileToBase64(file);

    // Call Coze AI Document Processing API
    const response = await fetch(`${process.env.COZE_API_ENDPOINT}/document/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
        'X-API-Version': 'v3',
      },
      body: JSON.stringify({
        bot_id: process.env.COZE_BOT_ID,
        file: base64File,
        file_name: file.name,
        file_type: file.type,
        tasks: {
          product_extraction: extractProducts,
          discount_detection: detectDiscounts,
          price_validation: validatePrices,
          table_extraction: true,
          text_extraction: true,
        },
        model: 'document-ai-v3',
      }),
    });

    if (!response.ok) {
      throw new Error(`Document API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Process and structure the results
    return processFileResults(file, data);
  } catch (error) {
    console.error('Error processing file:', error);
    throw error;
  }
}

/**
 * Process file analysis results
 */
function processFileResults(file: File, data: any): FileAnalysisResult {
  const products: ExtractedProduct[] = [];

  // Extract products from data
  if (data.products) {
    products.push(
      ...data.products.map((product: any) => ({
        name: product.name || 'Unknown Product',
        price: parseFloat(product.price) || 0,
        originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
        discount: product.discount,
        platform: product.platform,
        category: product.category,
        description: product.description,
        sku: product.sku,
        url: product.url,
        imageUrl: product.image_url,
        confidence: product.confidence || 0,
      }))
    );
  }

  // Calculate metadata
  const prices = products.map(p => p.price).filter(p => p > 0);
  const platforms = [...new Set(products.map(p => p.platform).filter(Boolean))];
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const hasDiscounts = products.some(p => p.originalPrice && p.price < p.originalPrice);

  return {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    products,
    metadata: {
      totalProducts: products.length,
      hasDiscounts,
      platforms: platforms as string[],
      categories: categories as string[],
      priceRange: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0,
      },
    },
    confidence: data.confidence || 0,
  };
}

/**
 * Convert file to base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Process CSV file
 */
export async function processCSV(file: File): Promise<FileAnalysisResult> {
  const text = await file.text();
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  const products: ExtractedProduct[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < headers.length) continue;

    const product: ExtractedProduct = {
      name: '',
      price: 0,
      confidence: 1.0,
    };

    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      if (!value) return;

      if (header.includes('name') || header.includes('product')) {
        product.name = value;
      } else if (header.includes('price') && !header.includes('original')) {
        product.price = parseFloat(value.replace(/[^0-9.]/g, ''));
      } else if (header.includes('original') && header.includes('price')) {
        product.originalPrice = parseFloat(value.replace(/[^0-9.]/g, ''));
      } else if (header.includes('discount')) {
        product.discount = parseFloat(value.replace(/[^0-9.]/g, ''));
      } else if (header.includes('platform') || header.includes('store')) {
        product.platform = value;
      } else if (header.includes('category')) {
        product.category = value;
      } else if (header.includes('sku') || header.includes('id')) {
        product.sku = value;
      } else if (header.includes('url') || header.includes('link')) {
        product.url = value;
      }
    });

    if (product.name && product.price > 0) {
      products.push(product);
    }
  }

  const prices = products.map(p => p.price);
  const platforms = [...new Set(products.map(p => p.platform).filter(Boolean))];
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  return {
    fileName: file.name,
    fileType: 'text/csv',
    fileSize: file.size,
    products,
    metadata: {
      totalProducts: products.length,
      hasDiscounts: products.some(p => p.originalPrice && p.price < p.originalPrice),
      platforms: platforms as string[],
      categories: categories as string[],
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
      },
    },
    confidence: 1.0,
  };
}

/**
 * Process Excel file
 */
export async function processExcel(file: File): Promise<FileAnalysisResult> {
  // For Excel files, we'll use the Coze AI API
  return processFile(file, {
    extractProducts: true,
    detectDiscounts: true,
    validatePrices: true,
  });
}

/**
 * Process PDF file
 */
export async function processPDF(file: File): Promise<FileAnalysisResult> {
  // For PDF files, we'll use the Coze AI API with OCR
  return processFile(file, {
    extractProducts: true,
    detectDiscounts: true,
    validatePrices: true,
  });
}

/**
 * Batch process multiple files
 */
export async function batchProcessFiles(
  files: File[]
): Promise<FileAnalysisResult[]> {
  const results: FileAnalysisResult[] = [];

  for (const file of files) {
    try {
      let result: FileAnalysisResult;

      if (file.type === 'text/csv') {
        result = await processCSV(file);
      } else if (file.type.includes('excel') || file.name.endsWith('.xlsx')) {
        result = await processExcel(file);
      } else if (file.type === 'application/pdf') {
        result = await processPDF(file);
      } else {
        result = await processFile(file);
      }

      results.push(result);
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
    }
  }

  return results;
}

/**
 * Merge products from multiple files
 */
export function mergeFileResults(
  results: FileAnalysisResult[]
): {
  allProducts: ExtractedProduct[];
  totalFiles: number;
  totalProducts: number;
  platforms: string[];
  categories: string[];
} {
  const allProducts: ExtractedProduct[] = [];
  const platformsSet = new Set<string>();
  const categoriesSet = new Set<string>();

  results.forEach(result => {
    allProducts.push(...result.products);
    result.metadata.platforms.forEach(p => platformsSet.add(p));
    result.metadata.categories.forEach(c => categoriesSet.add(c));
  });

  return {
    allProducts,
    totalFiles: results.length,
    totalProducts: allProducts.length,
    platforms: Array.from(platformsSet),
    categories: Array.from(categoriesSet),
  };
}

/**
 * Validate file type
 */
export function isValidFileType(file: File): boolean {
  const validTypes = [
    'text/csv',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/json',
  ];

  return validTypes.includes(file.type) || 
         file.name.endsWith('.csv') || 
         file.name.endsWith('.xlsx') || 
         file.name.endsWith('.pdf');
}

/**
 * Get file type icon
 */
export function getFileTypeIcon(file: File): string {
  if (file.type === 'text/csv' || file.name.endsWith('.csv')) return '📊';
  if (file.type.includes('excel') || file.name.endsWith('.xlsx')) return '📈';
  if (file.type === 'application/pdf') return '📄';
  if (file.type === 'text/plain') return '📝';
  if (file.type === 'application/json') return '🔧';
  return '📁';
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export default {
  processFile,
  processCSV,
  processExcel,
  processPDF,
  batchProcessFiles,
  mergeFileResults,
  isValidFileType,
  getFileTypeIcon,
  formatFileSize,
};

// Made with Bob
