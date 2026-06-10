import type { Platform } from './products.functions';

export const PLATFORM_INFO: Record<Platform, { 
  name: string; 
  logo: string; 
  primaryColor: string; 
  gradient: string;
  badgeColor: string;
}> = {
  'shopee': {
    name: 'Shopee',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee_Logo_2022.svg',
    primaryColor: '#EE4D2D',
    gradient: 'from-orange-500 to-red-500',
    badgeColor: 'bg-orange-500',
  },
  'tokopedia': {
    name: 'Tokopedia',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Tokopedia_Logo.svg',
    primaryColor: '#3CB043',
    gradient: 'from-green-500 to-emerald-600',
    badgeColor: 'bg-green-500',
  },
  'lazada': {
    name: 'Lazada',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Lazada_Logo.svg',
    primaryColor: '#0F146E',
    gradient: 'from-blue-800 to-indigo-800',
    badgeColor: 'bg-blue-700',
  },
  'bukalapak': {
    name: 'Bukalapak',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Bukalapak_Logo.svg',
    primaryColor: '#E7184B',
    gradient: 'from-pink-600 to-rose-500',
    badgeColor: 'bg-pink-600',
  },
  'blibli': {
    name: 'Blibli',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Blibli_Logo.svg',
    primaryColor: '#0081CC',
    gradient: 'from-blue-500 to-cyan-500',
    badgeColor: 'bg-blue-500',
  },
  'amazon': {
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    primaryColor: '#FF9900',
    gradient: 'from-orange-500 to-yellow-500',
    badgeColor: 'bg-orange-500',
  },
  'ebay': {
    name: 'eBay',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg',
    primaryColor: '#E53238',
    gradient: 'from-red-600 via-blue-600 to-yellow-500',
    badgeColor: 'bg-red-600',
  },
  'woocommerce': {
    name: 'WooCommerce',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/98/WooCommerce_logo.svg',
    primaryColor: '#96588A',
    gradient: 'from-purple-600 to-pink-500',
    badgeColor: 'bg-purple-600',
  },
  'own-store': {
    name: 'Lumen Store',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    primaryColor: '#0ea5e9',
    gradient: 'from-sky-500 to-blue-600',
    badgeColor: 'bg-sky-500',
  },
};

export function getPlatformInfo(platform?: Platform) {
  if (!platform) return null;
  return PLATFORM_INFO[platform];
}

export function getPlatformBadgeClass(platform?: Platform) {
  if (!platform) return 'bg-gray-500';
  return PLATFORM_INFO[platform].badgeColor;
}
