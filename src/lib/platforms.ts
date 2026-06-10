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
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/shopee.svg',
    primaryColor: '#EE4D2D',
    gradient: 'from-orange-500 to-red-500',
    badgeColor: 'bg-orange-500',
  },
  'tokopedia': {
    name: 'Tokopedia',
    logo: 'https://images.tokopedia.net/img/logo-tokopedia.svg',
    primaryColor: '#3CB043',
    gradient: 'from-green-500 to-emerald-600',
    badgeColor: 'bg-green-500',
  },
  'lazada': {
    name: 'Lazada',
    logo: 'https://laz-img-cdn.alicdn.com/images/ims-web/TB1T7K2d8Cw3KVjSZFuXXcAOpXa.png',
    primaryColor: '#0F146E',
    gradient: 'from-blue-800 to-indigo-800',
    badgeColor: 'bg-blue-700',
  },
  'bukalapak': {
    name: 'Bukalapak',
    logo: 'https://s0.bukalapak.com/ast/v7/img/logo-bukalapak.svg',
    primaryColor: '#E7184B',
    gradient: 'from-pink-600 to-rose-500',
    badgeColor: 'bg-pink-600',
  },
  'blibli': {
    name: 'Blibli',
    logo: 'https://www.static-src.com/siva/asset/blibli-logo.svg',
    primaryColor: '#0081CC',
    gradient: 'from-blue-500 to-cyan-500',
    badgeColor: 'bg-blue-500',
  },
  'amazon': {
    name: 'Amazon',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/amazon.svg',
    primaryColor: '#FF9900',
    gradient: 'from-orange-500 to-yellow-500',
    badgeColor: 'bg-orange-500',
  },
  'ebay': {
    name: 'eBay',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/ebay.svg',
    primaryColor: '#E53238',
    gradient: 'from-red-600 via-blue-600 to-yellow-500',
    badgeColor: 'bg-red-600',
  },
  'aliexpress': {
    name: 'AliExpress',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/aliexpress.svg',
    primaryColor: '#FF4747',
    gradient: 'from-red-500 to-orange-500',
    badgeColor: 'bg-red-500',
  },
  'woocommerce': {
    name: 'WooCommerce',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/woocommerce.svg',
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
