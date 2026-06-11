import type { Product } from "@/lib/products.functions";

// Additional products for all categories
export const additionalFashionProducts: Product[] = [
  {
    id: "f3",
    slug: "adidas-ultraboost",
    name: "Adidas Ultraboost 23 Running Shoes",
    description: "Premium running shoes with Boost cushioning and Primeknit upper.",
    price_cents: 269900000,
    compare_at_cents: 329900000,
    image_url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80",
    category_slug: "fashion",
    rating: 4.8,
    sold_count: 987,
    stock: 0,
    location: "Amazon",
    is_featured: true,
    platform: "amazon",
    seller_type: "affiliate",
    affiliate_link: "https://www.amazon.com/s?k=adidas+ultraboost+23",
    metadata: {
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/s?k=adidas+ultraboost+23",
      promo_badge: "Flash Sale",
      promo_type: "flash_sale"
    }
  },
  {
    id: "f4",
    slug: "levis-501-jeans",
    name: "Levi's 501 Original Fit Jeans",
    description: "Classic straight-leg jeans with button fly, the original since 1873.",
    price_cents: 119900000,
    compare_at_cents: 159900000,
    image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
    category_slug: "fashion",
    rating: 4.7,
    sold_count: 2341,
    stock: 0,
    location: "eBay",
    is_featured: false,
    platform: "ebay",
    seller_type: "affiliate",
    affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=levis+501+original+jeans",
    metadata: {
      platform: "ebay",
      seller_type: "affiliate",
      affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=levis+501+original+jeans",
      promo_badge: "Best Seller",
      promo_type: "best_seller"
    }
  },
  {
    id: "f5",
    slug: "ray-ban-aviator",
    name: "Ray-Ban Aviator Classic Sunglasses",
    description: "Iconic teardrop shape with 100% UV protection and metal frame.",
    price_cents: 229900000,
    compare_at_cents: 289900000,
    image_url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80",
    category_slug: "fashion",
    rating: 4.9,
    sold_count: 1543,
    stock: 0,
    location: "Amazon",
    is_featured: true,
    platform: "amazon",
    seller_type: "affiliate",
    affiliate_link: "https://www.amazon.com/Ray-Ban-Aviator-Classic-Sunglasses/dp/B001GNBJQW",
    metadata: {
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/Ray-Ban-Aviator-Classic-Sunglasses/dp/B001GNBJQW",
      promo_badge: "Free Gift",
      promo_type: "free_gift"
    }
  },
  {
    id: "f6",
    slug: "north-face-jacket",
    name: "The North Face Nuptse 1996 Jacket",
    description: "Iconic puffer jacket with 700-fill goose down insulation.",
    price_cents: 449900000,
    compare_at_cents: 549900000,
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
    category_slug: "fashion",
    rating: 4.8,
    sold_count: 765,
    stock: 0,
    location: "eBay",
    is_featured: false,
    platform: "ebay",
    seller_type: "affiliate",
    affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=north+face+nuptse+1996",
    metadata: {
      platform: "ebay",
      seller_type: "affiliate",
      affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=north+face+nuptse+1996",
      promo_badge: "Limited Stock",
      promo_type: "limited_stock"
    }
  },
];

export const additionalHomeProducts: Product[] = [
  {
    id: "h3",
    slug: "dyson-v15-vacuum",
    name: "Dyson V15 Detect Cordless Vacuum",
    description: "Laser detection technology reveals microscopic dust. Up to 60 minutes runtime.",
    price_cents: 1099900000,
    compare_at_cents: 1399900000,
    image_url: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&q=80",
    category_slug: "home",
    rating: 4.8,
    sold_count: 543,
    stock: 0,
    location: "Amazon",
    is_featured: true,
    platform: "amazon",
    seller_type: "affiliate",
    affiliate_link: "https://www.amazon.com/s?k=dyson+v15+detect",
    metadata: {
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/s?k=dyson+v15+detect",
      promo_badge: "Mega Sale",
      promo_type: "mega_sale"
    }
  },
  {
    id: "h4",
    slug: "instant-pot-duo",
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    description: "Multi-use programmable cooker: pressure cooker, slow cooker, rice cooker, and more.",
    price_cents: 179900000,
    compare_at_cents: 229900000,
    image_url: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80",
    category_slug: "home",
    rating: 4.7,
    sold_count: 3421,
    stock: 0,
    location: "Amazon",
    is_featured: false,
    platform: "amazon",
    seller_type: "affiliate",
    affiliate_link: "https://www.amazon.com/Instant-Pot-Multi-Use-Programmable-Pressure/dp/B00FLYWNYQ",
    metadata: {
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/Instant-Pot-Multi-Use-Programmable-Pressure/dp/B00FLYWNYQ",
      promo_badge: "Hot Deal",
      promo_type: "hot_deal"
    }
  },
  {
    id: "h5",
    slug: "philips-hue-starter",
    name: "Philips Hue White & Color Smart Bulb Starter Kit",
    description: "Smart LED bulbs with 16 million colors, voice control compatible.",
    price_cents: 279900000,
    compare_at_cents: 349900000,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    category_slug: "home",
    rating: 4.6,
    sold_count: 1234,
    stock: 0,
    location: "eBay",
    is_featured: false,
    platform: "ebay",
    seller_type: "affiliate",
    affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=philips+hue+starter+kit",
    metadata: {
      platform: "ebay",
      seller_type: "affiliate",
      affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=philips+hue+starter+kit",
      promo_badge: "Free Shipping",
      promo_type: "free_shipping"
    }
  },
];

export const additionalBeautyProducts: Product[] = [
  {
    id: "b2",
    slug: "dyson-airwrap",
    name: "Dyson Airwrap Multi-Styler Complete",
    description: "Styles and dries simultaneously with no extreme heat damage.",
    price_cents: 899900000,
    compare_at_cents: 1099900000,
    image_url: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80",
    category_slug: "beauty",
    rating: 4.8,
    sold_count: 876,
    stock: 0,
    location: "Amazon",
    is_featured: true,
    platform: "amazon",
    seller_type: "affiliate",
    affiliate_link: "https://www.amazon.com/s?k=dyson+airwrap",
    metadata: {
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/s?k=dyson+airwrap",
      promo_badge: "Exclusive Deal",
      promo_type: "exclusive"
    }
  },
  {
    id: "b3",
    slug: "ordinary-skincare-set",
    name: "The Ordinary Skincare Essentials Set",
    description: "Complete skincare routine with hyaluronic acid, niacinamide, and retinol.",
    price_cents: 89900000,
    compare_at_cents: 129900000,
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
    category_slug: "beauty",
    rating: 4.7,
    sold_count: 2341,
    stock: 0,
    location: "eBay",
    is_featured: false,
    platform: "ebay",
    seller_type: "affiliate",
    affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=the+ordinary+skincare+set",
    metadata: {
      platform: "ebay",
      seller_type: "affiliate",
      affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=the+ordinary+skincare+set",
      promo_badge: "Buy 1 Get 1",
      promo_type: "bogo"
    }
  },
];

export const additionalSportsProducts: Product[] = [
  {
    id: "s2",
    slug: "peloton-bike",
    name: "Peloton Bike+ Indoor Exercise Bike",
    description: "Premium indoor cycling bike with rotating HD touchscreen and live classes.",
    price_cents: 3999900000,
    compare_at_cents: 4999900000,
    image_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
    category_slug: "sports",
    rating: 4.8,
    sold_count: 234,
    stock: 0,
    location: "Amazon",
    is_featured: true,
    platform: "amazon",
    seller_type: "affiliate",
    affiliate_link: "https://www.amazon.com/s?k=peloton+bike",
    metadata: {
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/s?k=peloton+bike",
      promo_badge: "Premium Choice",
      promo_type: "premium"
    }
  },
  {
    id: "s3",
    slug: "yoga-mat-premium",
    name: "Lululemon The Reversible Mat 5mm",
    description: "Premium yoga mat with antimicrobial additive and superior grip.",
    price_cents: 149900000,
    compare_at_cents: 199900000,
    image_url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80",
    category_slug: "sports",
    rating: 4.9,
    sold_count: 1543,
    stock: 0,
    location: "eBay",
    is_featured: false,
    platform: "ebay",
    seller_type: "affiliate",
    affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=lululemon+reversible+mat",
    metadata: {
      platform: "ebay",
      seller_type: "affiliate",
      affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=lululemon+reversible+mat",
      promo_badge: "Top Rated",
      promo_type: "top_rated"
    }
  },
];

export const additionalBooksProducts: Product[] = [
  {
    id: "bk2",
    slug: "atomic-habits",
    name: "Atomic Habits by James Clear",
    description: "Tiny changes, remarkable results. #1 New York Times bestseller.",
    price_cents: 14900000,
    compare_at_cents: 19900000,
    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
    category_slug: "books",
    rating: 4.9,
    sold_count: 5432,
    stock: 0,
    location: "Amazon",
    is_featured: true,
    platform: "amazon",
    seller_type: "affiliate",
    affiliate_link: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299",
    metadata: {
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299",
      promo_badge: "Bestseller",
      promo_type: "bestseller"
    }
  },
  {
    id: "bk3",
    slug: "sapiens",
    name: "Sapiens: A Brief History of Humankind",
    description: "International bestseller exploring the history of our species.",
    price_cents: 16900000,
    compare_at_cents: 22900000,
    image_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
    category_slug: "books",
    rating: 4.8,
    sold_count: 3210,
    stock: 0,
    location: "eBay",
    is_featured: false,
    platform: "ebay",
    seller_type: "affiliate",
    affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=sapiens+yuval+noah+harari",
    metadata: {
      platform: "ebay",
      seller_type: "affiliate",
      affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=sapiens+yuval+noah+harari",
      promo_badge: "Must Read",
      promo_type: "recommended"
    }
  },
];

// New categories products
export const additionalToysProducts: Product[] = [
  {
    id: "t1",
    slug: "lego-star-wars",
    name: "LEGO Star Wars Millennium Falcon",
    description: "Iconic starship building set with 7,541 pieces. Perfect for display.",
    price_cents: 1499900000,
    compare_at_cents: 1899900000,
    image_url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80",
    category_slug: "toys",
    rating: 4.9,
    sold_count: 432,
    stock: 0,
    location: "Amazon",
    is_featured: true,
    platform: "amazon",
    seller_type: "affiliate",
    affiliate_link: "https://www.amazon.com/s?k=lego+star+wars+millennium+falcon",
    metadata: {
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/s?k=lego+star+wars+millennium+falcon",
      promo_badge: "Collector's Item",
      promo_type: "collectors"
    }
  },
  {
    id: "t2",
    slug: "hot-wheels-track",
    name: "Hot Wheels Ultimate Garage Playset",
    description: "Multi-level garage with car wash, gas station, and helicopter pad.",
    price_cents: 189900000,
    compare_at_cents: 249900000,
    image_url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80",
    category_slug: "toys",
    rating: 4.7,
    sold_count: 1234,
    stock: 0,
    location: "Tokopedia",
    is_featured: false,
    platform: "tokopedia",
    seller_type: "affiliate",
    affiliate_link: "https://www.tokopedia.com/search?q=hot+wheels+ultimate+garage",
    metadata: {
      platform: "tokopedia",
      seller_type: "affiliate",
      affiliate_link: "https://www.tokopedia.com/search?q=hot+wheels+ultimate+garage",
      promo_badge: "Kids Favorite",
      promo_type: "popular"
    }
  },
  {
    id: "t3",
    slug: "barbie-dreamhouse",
    name: "Barbie Dreamhouse Playset",
    description: "3-story dollhouse with 8 rooms, elevator, and pool with slide.",
    price_cents: 399900000,
    compare_at_cents: 499900000,
    image_url: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&q=80",
    category_slug: "toys",
    rating: 4.8,
    sold_count: 876,
    stock: 0,
    location: "Shopee",
    is_featured: true,
    platform: "shopee",
    seller_type: "affiliate",
    affiliate_link: "https://shopee.co.id/search?keyword=barbie+dreamhouse",
    metadata: {
      platform: "shopee",
      seller_type: "affiliate",
      affiliate_link: "https://shopee.co.id/search?keyword=barbie+dreamhouse",
      promo_badge: "Free Gift Wrap",
      promo_type: "free_gift"
    }
  },
];

export const additionalFoodProducts: Product[] = [
  {
    id: "fd1",
    slug: "organic-coffee-beans",
    name: "Arabica Organic Coffee Beans 1kg",
    description: "Premium single-origin coffee beans from Aceh, Indonesia.",
    price_cents: 14990000,
    compare_at_cents: 18990000,
    image_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80",
    category_slug: "food",
    rating: 4.8,
    sold_count: 2341,
    stock: 0,
    location: "Tokopedia",
    is_featured: true,
    platform: "tokopedia",
    seller_type: "affiliate",
    affiliate_link: "https://www.tokopedia.com/search?q=arabica+organic+coffee",
    metadata: {
      platform: "tokopedia",
      seller_type: "affiliate",
      affiliate_link: "https://www.tokopedia.com/search?q=arabica+organic+coffee",
      promo_badge: "Local Product",
      promo_type: "local"
    }
  },
  {
    id: "fd2",
    slug: "protein-powder",
    name: "Optimum Nutrition Gold Standard Whey Protein",
    description: "24g protein per serving, 5.5g BCAAs, gluten-free.",
    price_cents: 99990000,
    compare_at_cents: 129990000,
    image_url: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80",
    category_slug: "food",
    rating: 4.9,
    sold_count: 3421,
    stock: 0,
    location: "Amazon",
    is_featured: true,
    platform: "amazon",
    seller_type: "affiliate",
    affiliate_link: "https://www.amazon.com/s?k=optimum+nutrition+gold+standard",
    metadata: {
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/s?k=optimum+nutrition+gold+standard",
      promo_badge: "Fitness Essential",
      promo_type: "essential"
    }
  },
  {
    id: "fd3",
    slug: "olive-oil-extra-virgin",
    name: "Extra Virgin Olive Oil 1L - Cold Pressed",
    description: "Premium quality olive oil from Mediterranean region.",
    price_cents: 24990000,
    compare_at_cents: 29990000,
    image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
    category_slug: "food",
    rating: 4.7,
    sold_count: 1543,
    stock: 0,
    location: "Lazada",
    is_featured: false,
    platform: "lazada",
    seller_type: "affiliate",
    affiliate_link: "https://www.lazada.co.id/catalog/?q=extra+virgin+olive+oil",
    metadata: {
      platform: "lazada",
      seller_type: "affiliate",
      affiliate_link: "https://www.lazada.co.id/catalog/?q=extra+virgin+olive+oil",
      promo_badge: "Healthy Choice",
      promo_type: "healthy"
    }
  },
];

export const additionalAutomotiveProducts: Product[] = [
  {
    id: "a1",
    slug: "dash-cam-4k",
    name: "4K Dash Cam with Night Vision",
    description: "Front and rear camera, GPS, parking mode, 256GB support.",
    price_cents: 299900000,
    compare_at_cents: 399900000,
    image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80",
    category_slug: "automotive",
    rating: 4.6,
    sold_count: 987,
    stock: 0,
    location: "Amazon",
    is_featured: true,
    platform: "amazon",
    seller_type: "affiliate",
    affiliate_link: "https://www.amazon.com/s?k=4k+dash+cam",
    metadata: {
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/s?k=4k+dash+cam",
      promo_badge: "Safety First",
      promo_type: "safety"
    }
  },
  {
    id: "a2",
    slug: "car-vacuum-cleaner",
    name: "Portable Car Vacuum Cleaner 120W",
    description: "Cordless handheld vacuum with HEPA filter and LED light.",
    price_cents: 8990000,
    compare_at_cents: 12990000,
    image_url: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&q=80",
    category_slug: "automotive",
    rating: 4.5,
    sold_count: 2134,
    stock: 0,
    location: "Shopee",
    is_featured: false,
    platform: "shopee",
    seller_type: "affiliate",
    affiliate_link: "https://shopee.co.id/search?keyword=car+vacuum+cleaner",
    metadata: {
      platform: "shopee",
      seller_type: "affiliate",
      affiliate_link: "https://shopee.co.id/search?keyword=car+vacuum+cleaner",
      promo_badge: "Best Value",
      promo_type: "value"
    }
  },
  {
    id: "a3",
    slug: "tire-pressure-monitor",
    name: "TPMS Tire Pressure Monitoring System",
    description: "Real-time tire pressure and temperature monitoring with 4 sensors.",
    price_cents: 14990000,
    compare_at_cents: 19990000,
    image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80",
    category_slug: "automotive",
    rating: 4.7,
    sold_count: 765,
    stock: 0,
    location: "AliExpress",
    is_featured: false,
    platform: "aliexpress",
    seller_type: "affiliate",
    affiliate_link: "https://www.aliexpress.com/w/wholesale-tpms-tire-pressure-monitor.html",
    metadata: {
      platform: "aliexpress",
      seller_type: "affiliate",
      affiliate_link: "https://www.aliexpress.com/w/wholesale-tpms-tire-pressure-monitor.html",
      promo_badge: "Tech Upgrade",
      promo_type: "tech"
    }
  },
];

export const additionalPetProducts: Product[] = [
  {
    id: "p1",
    slug: "automatic-pet-feeder",
    name: "Smart Automatic Pet Feeder with Camera",
    description: "WiFi-enabled feeder with HD camera, voice recording, and app control.",
    price_cents: 249900000,
    compare_at_cents: 329900000,
    image_url: "https://images.unsplash.com/photo-1591768575557-5ac2b0a0d7f5?w=400&q=80",
    category_slug: "pets",
    rating: 4.7,
    sold_count: 1234,
    stock: 0,
    location: "Amazon",
    is_featured: true,
    platform: "amazon",
    seller_type: "affiliate",
    affiliate_link: "https://www.amazon.com/s?k=smart+automatic+pet+feeder",
    metadata: {
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/s?k=smart+automatic+pet+feeder",
      promo_badge: "Pet Care",
      promo_type: "pet_care"
    }
  },
  {
    id: "p2",
    slug: "cat-tree-tower",
    name: "Multi-Level Cat Tree Tower 6ft",
    description: "Large cat condo with scratching posts, hammock, and toys.",
    price_cents: 179900000,
    compare_at_cents: 249900000,
    image_url: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&q=80",
    category_slug: "pets",
    rating: 4.8,
    sold_count: 876,
    stock: 0,
    location: "eBay",
    is_featured: false,
    platform: "ebay",
    seller_type: "affiliate",
    affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=cat+tree+tower+6ft",
    metadata: {
      platform: "ebay",
      seller_type: "affiliate",
      affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=cat+tree+tower+6ft",
      promo_badge: "Cat Favorite",
      promo_type: "popular"
    }
  },
  {
    id: "p3",
    slug: "dog-gps-tracker",
    name: "GPS Dog Tracker with Activity Monitor",
    description: "Real-time location tracking, geofencing, and health monitoring.",
    price_cents: 129900000,
    compare_at_cents: 179900000,
    image_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80",
    category_slug: "pets",
    rating: 4.6,
    sold_count: 1543,
    stock: 0,
    location: "Amazon",
    is_featured: true,
    platform: "amazon",
    seller_type: "affiliate",
    affiliate_link: "https://www.amazon.com/s?k=gps+dog+tracker",
    metadata: {
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/s?k=gps+dog+tracker",
      promo_badge: "Smart Pet",
      promo_type: "smart"
    }
  },
];

// Made with Bob
