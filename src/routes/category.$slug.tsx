import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getCategory } from "@/lib/products.functions";
import { ProductCard } from "@/components/ProductCard";
import type { Product, Platform } from "@/lib/products.functions";
import {
  additionalFashionProducts,
  additionalHomeProducts,
  additionalBeautyProducts,
  additionalSportsProducts,
  additionalBooksProducts,
  additionalToysProducts,
  additionalFoodProducts,
  additionalAutomotiveProducts,
  additionalPetProducts,
} from "@/data/additional-products";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// SVG placeholders
const svgThumbnail1 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23e0f2fe' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%230284c7'%3E📱%3C/text%3E%3C/svg%3E";
const svgThumbnail2 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23fdf4ff' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%239333ea'%3E🎧%3C/text%3E%3C/svg%3E";
const svgThumbnail3 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23fef3c7' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%23d97706'%3E💻%3C/text%3E%3C/svg%3E";
const svgThumbnail4 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23fce7f3' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%23be185d'%3E🎮%3C/text%3E%3C/svg%3E";
const svgThumbnail5 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f0fdf4' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%2316a34a'%3E⌚%3C/text%3E%3C/svg%3E";
const svgThumbnail6 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23fef9c3' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%23a16207'%3E🎥%3C/text%3E%3C/svg%3E";
const svgThumbnail7 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23e0e7ff' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%234f46e5'%3E🖱️%3C/text%3E%3C/svg%3E";
const svgThumbnail8 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23d9f99d' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%234ade80'%3E🔌%3C/text%3E%3C/svg%3E";
const svgThumbnail9 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23fbcfe8' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%23f472b6'%3E🔋%3C/text%3E%3C/svg%3E";
const svgThumbnail10 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23fed7aa' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%23ea580c'%3E⌨️%3C/text%3E%3C/svg%3E";
const svgThumbnail11 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23ddd6fe' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%237c3aed'%3E📷%3C/text%3E%3C/svg%3E";
const svgThumbnail12 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%2399f6e4' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%230d9488'%3E🏠%3C/text%3E%3C/svg%3E";
const svgThumbnail13 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23fef3c7' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%23a16207'%3E👟%3C/text%3E%3C/svg%3E";
const svgThumbnail14 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23fce7f3' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%23be185d'%3E👕%3C/text%3E%3C/svg%3E";
const svgThumbnail15 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f0fdf4' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%2316a34a'%3E🪑%3C/text%3E%3C/svg%3E";
const svgThumbnail16 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23fef3c7' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%23a16207'%3E💄%3C/text%3E%3C/svg%3E";
const svgThumbnail17 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23dbeafe' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%233b82f6'%3E🏋️%3C/text%3E%3C/svg%3E";
const svgThumbnail18 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23fef3c7' width='400' height='400'/%3E%3Ctext x='200' y='210' text-anchor='middle' font-size='64' fill='%23a16207'%3E📚%3C/text%3E%3C/svg%3E";

// Electronics subcategories
const electronicsSubcategories = [
  { id: "smartphones", name: "Smartphones & Tablets", icon: "📱" },
  { id: "computers", name: "Computers & Laptops", icon: "💻" },
  { id: "audio", name: "Audio & Headphones", icon: "🎧" },
  { id: "cameras", name: "Cameras & Photography", icon: "📷" },
  { id: "gaming", name: "Gaming", icon: "🎮" },
  { id: "wearables", name: "Wearables & Smartwatches", icon: "⌚" },
  { id: "accessories", name: "Accessories", icon: "🔌" },
  { id: "smart-home", name: "Smart Home", icon: "🏠" },
];

// Product videos for affiliate marketing (Shopee-style shorts)
const productVideos = [
  {
    id: "v1",
    title: "iPhone 15 Pro Max Unboxing",
    thumbnail: svgThumbnail1,
    duration: "0:45",
    views: "125K",
    productSlug: "apple-iphone-15-pro",
  },
  {
    id: "v2",
    title: "Sony WH-1000XM5 Review",
    thumbnail: svgThumbnail2,
    duration: "1:20",
    views: "89K",
    productSlug: "sony-wh1000xm5",
  },
  {
    id: "v3",
    title: "MacBook Air M2 Performance Test",
    thumbnail: svgThumbnail3,
    duration: "2:15",
    views: "203K",
    productSlug: "macbook-air-m2",
  },
  {
    id: "v4",
    title: "AirPods Pro 2 Sound Test",
    thumbnail: svgThumbnail4,
    duration: "1:05",
    views: "156K",
    productSlug: "airpods-pro-2",
  },
];

// Sample products data for all categories - real e-commerce inspired!
const sampleProducts: Record<string, Product[]> = {
  electronics: [
    {
      id: "e1",
      slug: "sony-wh1000xm5",
      name: "Sony WH-1000XM5 Noise Cancelling Headphones",
      description: "Industry-leading noise cancellation with exceptional sound quality.",
      price_cents: 599900,
      compare_at_cents: 749900,
      image_url: svgThumbnail2,
      category_slug: "electronics",
      rating: 4.9,
      sold_count: 1254,
      stock: 0,
      location: "Tokopedia",
      is_featured: true,
      platform: "tokopedia",
      seller_type: "affiliate",
      affiliate_link: "https://www.tokopedia.com/search?q=sony+wh1000xm5"
    },
    {
      id: "e2",
      slug: "apple-iphone-15-pro",
      name: "Apple iPhone 15 Pro Max 256GB",
      description: "The latest iPhone with titanium design and A17 Pro chip.",
      price_cents: 2199900,
      compare_at_cents: 2499900,
      image_url: svgThumbnail1,
      category_slug: "electronics",
      rating: 4.8,
      sold_count: 2341,
      stock: 0,
      location: "Shopee",
      is_featured: true,
      platform: "shopee",
      seller_type: "affiliate",
      affiliate_link: "https://shopee.co.id/search?keyword=iphone+15+pro+max"
    },
    {
      id: "e3",
      slug: "samsung-galaxy-watch-6",
      name: "Samsung Galaxy Watch 6 Classic",
      description: "Smartwatch with rotating bezel and advanced health tracking.",
      price_cents: 449900,
      compare_at_cents: 549900,
      image_url: svgThumbnail5,
      category_slug: "electronics",
      rating: 4.7,
      sold_count: 876,
      stock: 0,
      location: "Lazada",
      is_featured: false,
      platform: "lazada",
      seller_type: "affiliate",
      affiliate_link: "https://www.lazada.co.id/catalog/?q=galaxy+watch+6"
    },
    {
      id: "e4",
      slug: "macbook-air-m2",
      name: "Apple MacBook Air M2 13.6 inch",
      description: "Thin and light laptop with powerful M2 chip.",
      price_cents: 1349900,
      compare_at_cents: 1599900,
      image_url: svgThumbnail3,
      category_slug: "electronics",
      rating: 4.9,
      sold_count: 567,
      stock: 0,
      location: "Blibli",
      is_featured: false,
      platform: "blibli",
      seller_type: "affiliate",
      affiliate_link: "https://www.blibli.com/cari?search=macbook+air+m2"
    },
    {
      id: "e5",
      slug: "airpods-pro-2",
      name: "Apple AirPods Pro 2nd Generation",
      description: "Wireless earbuds with MagSafe and Transparency mode.",
      price_cents: 329900,
      compare_at_cents: 399900,
      image_url: svgThumbnail4,
      category_slug: "electronics",
      rating: 4.8,
      sold_count: 1893,
      stock: 0,
      location: "Bukalapak",
      is_featured: false,
      platform: "bukalapak",
      seller_type: "affiliate",
      affiliate_link: "https://www.bukalapak.com/products?search%5Bkeywords%5D=airpods+pro+2"
    },
    {
      id: "e6",
      slug: "playstation-5",
      name: "Sony PlayStation 5 Digital Edition",
      description: "Next-gen gaming console with stunning graphics.",
      price_cents: 849900,
      compare_at_cents: 999900,
      image_url: svgThumbnail6,
      category_slug: "electronics",
      rating: 4.9,
      sold_count: 201,
      stock: 0,
      location: "Amazon",
      is_featured: false,
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/s?k=playstation+5+digital+edition"
    },
    {
      id: "e7",
      slug: "logitech-mx-master-3s",
      name: "Logitech MX Master 3S Wireless Mouse",
      description: "Ergonomic wireless mouse with 8K DPI and quiet clicks. Perfect for productivity.",
      price_cents: 139900,
      compare_at_cents: 169900,
      image_url: svgThumbnail7,
      category_slug: "electronics",
      rating: 4.8,
      sold_count: 1456,
      stock: 0,
      location: "Amazon",
      is_featured: true,
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/Logitech-MX-Master-3S-Graphite/dp/B09HM94VDS"
    },
    {
      id: "e8",
      slug: "anker-powercore-26800",
      name: "Anker PowerCore 26800mAh Power Bank",
      description: "High-capacity portable charger with 3 USB ports for multiple devices.",
      price_cents: 89900,
      compare_at_cents: 119900,
      image_url: svgThumbnail8,
      category_slug: "electronics",
      rating: 4.7,
      sold_count: 3421,
      stock: 0,
      location: "eBay",
      is_featured: false,
      platform: "ebay",
      seller_type: "affiliate",
      affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=anker+powercore+26800"
    },
    {
      id: "e9",
      slug: "xiaomi-redmi-buds-4-pro",
      name: "Xiaomi Redmi Buds 4 Pro",
      description: "Wireless earbuds with ANC, Bluetooth 5.3, and dual device connection.",
      price_cents: 109900,
      compare_at_cents: 149900,
      image_url: svgThumbnail9,
      category_slug: "electronics",
      rating: 4.5,
      sold_count: 2134,
      stock: 0,
      location: "AliExpress",
      is_featured: false,
      platform: "aliexpress",
      seller_type: "affiliate",
      affiliate_link: "https://www.aliexpress.com/w/wholesale-xiaomi-redmi-buds-4-pro.html"
    },
    {
      id: "e10",
      slug: "baseus-100w-usb-c-cable",
      name: "Baseus 100W USB-C Fast Charging Cable",
      description: "High-speed charging cable with 100W power delivery, 2m length.",
      price_cents: 24900,
      compare_at_cents: 39900,
      image_url: svgThumbnail10,
      category_slug: "electronics",
      rating: 4.6,
      sold_count: 5678,
      stock: 0,
      location: "AliExpress",
      is_featured: false,
      platform: "aliexpress",
      seller_type: "affiliate",
      affiliate_link: "https://www.aliexpress.com/w/wholesale-baseus-100w-usb-c-cable.html"
    },
    {
      id: "e11",
      slug: "keychron-k8-pro",
      name: "Keychron K8 Pro Wireless Mechanical Keyboard",
      description: "Hot-swappable mechanical keyboard with RGB backlight and wireless connectivity.",
      price_cents: 149900,
      compare_at_cents: 189900,
      image_url: svgThumbnail11,
      category_slug: "electronics",
      rating: 4.8,
      sold_count: 876,
      stock: 0,
      location: "Amazon",
      is_featured: true,
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/s?k=keychron+k8+pro"
    },
    {
      id: "e12",
      slug: "tp-link-archer-ax73",
      name: "TP-Link Archer AX73 WiFi 6 Router",
      description: "Dual-band WiFi 6 router with 5400 Mbps speed and OneMesh support.",
      price_cents: 179900,
      compare_at_cents: 229900,
      image_url: svgThumbnail12,
      category_slug: "electronics",
      rating: 4.7,
      sold_count: 654,
      stock: 0,
      location: "Amazon",
      is_featured: false,
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/TP-Link-AX5400-WiFi-Router/dp/B08KTXG8Q5"
    },
    {
      id: "e13",
      slug: "sandisk-extreme-1tb",
      name: "SanDisk Extreme Portable SSD 1TB",
      description: "Rugged external SSD with 1050MB/s read speed and IP55 water resistance.",
      price_cents: 169900,
      compare_at_cents: 219900,
      image_url: svgThumbnail13,
      category_slug: "electronics",
      rating: 4.9,
      sold_count: 1234,
      stock: 0,
      location: "eBay",
      is_featured: false,
      platform: "ebay",
      seller_type: "affiliate",
      affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=sandisk+extreme+portable+ssd+1tb"
    },
    {
      id: "e14",
      slug: "bose-quietcomfort-45",
      name: "Bose QuietComfort 45 Headphones",
      description: "Premium noise-cancelling headphones with 24-hour battery life.",
      price_cents: 449900,
      compare_at_cents: 549900,
      image_url: svgThumbnail2,
      category_slug: "electronics",
      rating: 4.8,
      sold_count: 987,
      stock: 0,
      location: "Amazon",
      is_featured: true,
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/Bose-QuietComfort-Wireless-Headphones-Cancelling/dp/B098FKXT8L"
    },
    {
      id: "e15",
      slug: "gopro-hero-12",
      name: "GoPro HERO12 Black Action Camera",
      description: "Waterproof 5.3K60 action camera with HyperSmooth 6.0 stabilization.",
      price_cents: 649900,
      compare_at_cents: 799900,
      image_url: svgThumbnail6,
      category_slug: "electronics",
      rating: 4.7,
      sold_count: 543,
      stock: 0,
      location: "eBay",
      is_featured: false,
      platform: "ebay",
      seller_type: "affiliate",
      affiliate_link: "https://www.ebay.com/sch/i.html?_nkw=gopro+hero+12+black"
    },
    {
      id: "e16",
      slug: "ring-video-doorbell",
      name: "Ring Video Doorbell Pro 2",
      description: "Smart doorbell with 1536p HD video, 3D motion detection, and Alexa integration.",
      price_cents: 349900,
      compare_at_cents: 429900,
      image_url: svgThumbnail12,
      category_slug: "electronics",
      rating: 4.6,
      sold_count: 1876,
      stock: 0,
      location: "Amazon",
      is_featured: false,
      platform: "amazon",
      seller_type: "affiliate",
      affiliate_link: "https://www.amazon.com/Ring-Video-Doorbell-Pro-2/dp/B086Q54K53"
    },
  ],
  fashion: [
    {
      id: "f1",
      slug: "nike-air-jordan-1",
      name: "Nike Air Jordan 1 Retro High OG",
      description: "Classic sneaker that never goes out of style.",
      price_cents: 219900,
      compare_at_cents: 289900,
      image_url: svgThumbnail13,
      category_slug: "fashion",
      rating: 4.8,
      sold_count: 1543,
      stock: 0,
      location: "Shopee",
      is_featured: true,
      platform: "shopee",
      seller_type: "affiliate",
      affiliate_link: "https://shopee.co.id/search?keyword=nike+air+jordan+1"
    },
    {
      id: "f2",
      slug: "minimalist-t-shirt",
      name: "Minimalist Cotton T-Shirt Unisex",
      description: "Comfortable 100% organic cotton tee in multiple colors.",
      price_cents: 8990,
      compare_at_cents: 12990,
      image_url: svgThumbnail14,
      category_slug: "fashion",
      rating: 4.5,
      sold_count: 3421,
      stock: 85,
      location: "Lumen Store",
      is_featured: true,
      platform: "own-store",
      seller_type: "own-store"
    },
    ...additionalFashionProducts,
  ],
  home: [
    {
      id: "h1",
      slug: "ergonomic-office-chair",
      name: "Premium Ergonomic Office Chair",
      description: "Comfortable chair with lumbar support for long work days.",
      price_cents: 249900,
      compare_at_cents: 349900,
      image_url: svgThumbnail15,
      category_slug: "home",
      rating: 4.7,
      sold_count: 765,
      stock: 12,
      location: "Lumen Store",
      is_featured: true,
      platform: "own-store",
      seller_type: "own-store"
    },
    {
      id: "h2",
      slug: "air-fryer-5.5l",
      name: "Air Fryer 5.5L Digital",
      description: "Healthy cooking with little to no oil.",
      price_cents: 149900,
      compare_at_cents: 199900,
      image_url: svgThumbnail16,
      category_slug: "home",
      rating: 4.6,
      sold_count: 987,
      stock: 0,
      location: "Tokopedia",
      is_featured: true,
      platform: "tokopedia",
      seller_type: "affiliate",
      affiliate_link: "https://www.tokopedia.com/search?q=air+fryer+5.5l"
    },
    ...additionalHomeProducts,
  ],
  beauty: [
    {
      id: "b1",
      slug: "skincare-bundle",
      name: "Korean Skincare Essentials Bundle",
      description: "Complete 5-step routine for glowing skin.",
      price_cents: 22490,
      compare_at_cents: 29990,
      image_url: svgThumbnail16,
      category_slug: "beauty",
      rating: 4.9,
      sold_count: 2134,
      stock: 0,
      location: "Shopee",
      is_featured: true,
      platform: "shopee",
      seller_type: "affiliate",
      affiliate_link: "https://shopee.co.id/search?keyword=korean+skincare+bundle"
    },
    ...additionalBeautyProducts,
  ],
  sports: [
    {
      id: "s1",
      slug: "adjustable-dumbbell-set",
      name: "Adjustable Dumbbell Set (10kg - 40kg)",
      description: "Space-saving solution for home workouts.",
      price_cents: 17490,
      compare_at_cents: 22490,
      image_url: svgThumbnail17,
      category_slug: "sports",
      rating: 4.7,
      sold_count: 876,
      stock: 18,
      location: "Lumen Store",
      is_featured: false,
      platform: "own-store",
      seller_type: "own-store"
    },
    ...additionalSportsProducts,
  ],
  books: [
    {
      id: "bk1",
      slug: "bestselling-novel-collection",
      name: "Bestselling Novel Collection (Set of 5)",
      description: "Must-read books for book lovers.",
      price_cents: 4490,
      compare_at_cents: 5990,
      image_url: svgThumbnail18,
      category_slug: "books",
      rating: 4.5,
      sold_count: 1567,
      stock: 0,
      location: "Tokopedia",
      is_featured: false,
      platform: "tokopedia",
      seller_type: "affiliate",
      affiliate_link: "https://www.tokopedia.com/search?q=bestselling+novels"
    },
    ...additionalBooksProducts,
  ],
  toys: [
    ...additionalToysProducts,
  ],
  food: [
    ...additionalFoodProducts,
  ],
  automotive: [
    ...additionalAutomotiveProducts,
  ],
  pets: [
    ...additionalPetProducts,
  ],
};

const categoryQuery = (slug: string) => queryOptions({
  queryKey: ["category", slug],
  queryFn: () => getCategory({ data: { slug } }),
});

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Lumen` },
      { name: "description", content: `Browse ${params.slug} products on Lumen.` },
    ],
  }),
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(categoryQuery(params.slug));
    if (!data.category) throw notFound();
    return data;
  },
  component: CategoryPage,
  errorComponent: ({ error }) => <div className="p-8 text-center text-sm text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">Category not found.</div>,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(categoryQuery(slug));
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isSubcategoriesOpen, setIsSubcategoriesOpen] = useState(slug === "electronics");
  
  // If no products from DB, use our sample data!
  const allProducts = data.products.length > 0
    ? data.products
    : (sampleProducts[slug as keyof typeof sampleProducts] || []);
  
  // Get unique platforms from products
  const platforms = useMemo(() => {
    const uniquePlatforms = new Set(
      allProducts.map(p => p.platform).filter((p): p is Platform => p !== undefined)
    );
    return Array.from(uniquePlatforms);
  }, [allProducts]);
  
  // Filter and sort products
  const productsToShow = useMemo(() => {
    let filtered = [...allProducts];
    
    // Subcategory filter (for electronics)
    if (selectedSubcategory && slug === "electronics") {
      filtered = filtered.filter(p => {
        const name = p.name.toLowerCase();
        const desc = p.description.toLowerCase();
        
        switch (selectedSubcategory) {
          case "smartphones":
            return name.includes("iphone") || name.includes("phone") || name.includes("smartphone") || name.includes("galaxy");
          case "computers":
            return name.includes("macbook") || name.includes("laptop") || name.includes("computer") || name.includes("pc");
          case "audio":
            return name.includes("headphone") || name.includes("earbuds") || name.includes("speaker") || name.includes("airpods") || name.includes("audio") || name.includes("sony wh");
          case "cameras":
            return name.includes("camera") || name.includes("gopro") || name.includes("photography");
          case "gaming":
            return name.includes("gaming") || name.includes("playstation") || name.includes("xbox") || name.includes("nintendo") || name.includes("game");
          case "wearables":
            return name.includes("watch") || name.includes("wearable") || name.includes("fitness") || name.includes("tracker");
          case "accessories":
            return name.includes("cable") || name.includes("charger") || name.includes("mouse") || name.includes("keyboard") || name.includes("power bank") || name.includes("accessory");
          case "smart-home":
            return name.includes("smart") || name.includes("home") || name.includes("ring") || name.includes("hue") || name.includes("alexa");
          default:
            return true;
        }
      });
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }
    
    // Platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter(p => p.platform === platformFilter);
    }
    
    // Price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter(p => {
        const price = p.price_cents / 100;
        switch (priceRange) {
          case "under-100": return price < 100;
          case "100-500": return price >= 100 && price < 500;
          case "500-1000": return price >= 500 && price < 1000;
          case "over-1000": return price >= 1000;
          default: return true;
        }
      });
    }
    
    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price_cents - b.price_cents);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price_cents - a.price_cents);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a, b) => b.sold_count - a.sold_count);
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }
    
    return filtered;
  }, [allProducts, searchQuery, platformFilter, priceRange, sortBy, selectedSubcategory, slug]);
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Category</p>
        <h1 className="font-display text-4xl mt-1">{data.category?.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {productsToShow.length} of {allProducts.length} products
        </p>
      </div>

      {/* Electronics Subcategories */}
      {slug === "electronics" && (
        <Collapsible open={isSubcategoriesOpen} onOpenChange={setIsSubcategoriesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Browse by Subcategory
              </span>
              {isSubcategoriesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {electronicsSubcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(selectedSubcategory === sub.id ? null : sub.id)}
                  className={`rounded-xl p-4 text-center transition-all ${
                    selectedSubcategory === sub.id
                      ? "bg-accent text-accent-foreground shadow-lg scale-105"
                      : "bg-card border border-border hover:border-accent hover:shadow-md"
                  }`}
                >
                  <div className="text-3xl mb-2">{sub.icon}</div>
                  <div className="text-xs font-medium leading-tight">{sub.name}</div>
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Video Shorts Section - Only for electronics */}
      {slug === "electronics" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl flex items-center gap-2">
              <Play className="w-6 h-6 text-accent" />
              Product Videos
            </h2>
            <span className="text-sm text-muted-foreground">Shopee-style shorts</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {productVideos.map((video) => (
              <a
                key={video.id}
                href={`#${video.productSlug}`}
                className="group relative rounded-2xl overflow-hidden bg-muted aspect-[9/16] hover:shadow-xl transition-all"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-accent fill-accent ml-1" />
                  </div>
                </div>
                
                {/* Video info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="text-sm font-semibold line-clamp-2 mb-1">{video.title}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span>{video.duration}</span>
                    <span>{video.views} views</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
      
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filters Row */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          {/* Sort By */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Platform Filter */}
          {platforms.length > 0 && (
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {platforms.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {/* Price Range Filter */}
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-100">Under $100</SelectItem>
              <SelectItem value="100-500">$100 - $500</SelectItem>
              <SelectItem value="500-1000">$500 - $1,000</SelectItem>
              <SelectItem value="over-1000">Over $1,000</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Clear Filters */}
          {(searchQuery || platformFilter !== "all" || priceRange !== "all" || sortBy !== "featured") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setPlatformFilter("all");
                setPriceRange("all");
                setSortBy("featured");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Products Grid */}
      {productsToShow.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {productsToShow.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setPlatformFilter("all");
              setPriceRange("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
