import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Share2, MoreVertical, Volume2, VolumeX, ChevronUp, ShoppingBag, X, Eye, Send } from "lucide-react";
import { formatIDR } from "@/lib/format";
import type { Product } from "@/lib/products.functions";

interface VideoProduct extends Product {
  video_url: string;
  is_live?: boolean;
  seller_name: string;
  seller_avatar: string;
  viewer_count?: number;
}

const videoProducts: VideoProduct[] = [
  {
    id: "v1",
    slug: "wireless-earbuds-pro",
    name: "Premium Wireless Earbuds Pro",
    description: "Experience crystal-clear sound with active noise cancellation and 30-hour battery life. Perfect for music lovers!",
    price_cents: 149900,
    compare_at_cents: 199900,
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    category_slug: "electronics",
    rating: 4.8,
    sold_count: 1234,
    stock: 50,
    location: "Jakarta",
    is_featured: true,
    is_live: true,
    seller_name: "TechStore Official",
    seller_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tech",
    viewer_count: 2847,
  },
  {
    id: "v2",
    slug: "smart-watch-ultra",
    name: "Smart Watch Ultra - Fitness Tracker",
    description: "Track your health, fitness, and stay connected with this advanced smartwatch. Water resistant up to 50m!",
    price_cents: 299900,
    compare_at_cents: 399900,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    category_slug: "electronics",
    rating: 4.9,
    sold_count: 2341,
    stock: 30,
    location: "Bandung",
    is_featured: true,
    is_live: false,
    seller_name: "Gadget Paradise",
    seller_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gadget",
  },
  {
    id: "v3",
    slug: "portable-speaker",
    name: "Waterproof Portable Bluetooth Speaker",
    description: "360° sound with deep bass, waterproof design perfect for outdoor adventures. 24-hour battery life!",
    price_cents: 89900,
    compare_at_cents: 129900,
    image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    category_slug: "electronics",
    rating: 4.7,
    sold_count: 876,
    stock: 75,
    location: "Surabaya",
    is_featured: false,
    is_live: true,
    seller_name: "AudioMaster",
    seller_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=audio",
    viewer_count: 1523,
  },
  {
    id: "v4",
    slug: "gaming-headset",
    name: "RGB Gaming Headset with 7.1 Surround",
    description: "Immersive gaming audio with comfortable design and RGB lighting effects. Pro gamer approved!",
    price_cents: 179900,
    compare_at_cents: 249900,
    image_url: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&q=80",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    category_slug: "electronics",
    rating: 4.6,
    sold_count: 543,
    stock: 40,
    location: "Jakarta",
    is_featured: false,
    is_live: false,
    seller_name: "Gaming Hub",
    seller_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gaming",
  },
  {
    id: "v5",
    slug: "wireless-charger",
    name: "Fast Wireless Charging Pad",
    description: "15W fast charging for all Qi-enabled devices with sleek design. Charge 3 devices simultaneously!",
    price_cents: 59900,
    compare_at_cents: 89900,
    image_url: "https://images.unsplash.com/photo-1591290619762-c588f7e8e2f4?w=400&q=80",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    category_slug: "electronics",
    rating: 4.5,
    sold_count: 1567,
    stock: 100,
    location: "Medan",
    is_featured: false,
    is_live: true,
    seller_name: "PowerTech",
    seller_avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=power",
    viewer_count: 892,
  }
];

const shortsQuery = queryOptions({
  queryKey: ["shorts"],
  queryFn: async () => videoProducts
});

export const Route = createFileRoute("/shorts")({
  head: () => ({
    meta: [
      { title: "Live Shopping — Lumen" },
      { name: "description", content: "Watch live shopping videos and discover amazing products" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(shortsQuery),
  component: ShortsPage,
});

function ShortsPage() {
  const { data: products } = useSuspenseQuery(shortsQuery);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [showProductBasket, setShowProductBasket] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ user: string; message: string; avatar: string }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const currentProduct = products[currentIndex];

  // Simulate live chat messages
  useEffect(() => {
    if (!currentProduct.is_live) return;
    
    const messages = [
      { user: "Sarah_123", message: "Wow! This looks amazing! 😍", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
      { user: "TechLover", message: "How much is the discount?", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tech1" },
      { user: "Buyer_99", message: "Just ordered one! 🛒", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=buyer" },
      { user: "Gadget_Fan", message: "Is it available in blue?", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fan" },
      { user: "ShopQueen", message: "Added to cart! 💳", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=queen" },
    ];

    const interval = setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setChatMessages(prev => [...prev.slice(-4), randomMessage]);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, currentProduct.is_live]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < products.length) {
        setCurrentIndex(newIndex);
        // Pause previous video
        const prevVideo = videoRefs.current[products[currentIndex].id];
        if (prevVideo) prevVideo.pause();
        // Play new video
        const newVideo = videoRefs.current[products[newIndex].id];
        if (newVideo) newVideo.play().catch(() => {});
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [currentIndex, products]);

  // Auto-play current video
  useEffect(() => {
    const video = videoRefs.current[currentProduct.id];
    if (video) {
      video.play().catch(() => {});
    }
  }, [currentIndex, currentProduct.id]);

  const toggleMute = () => {
    setMuted(!muted);
    Object.values(videoRefs.current).forEach(video => {
      if (video) video.muted = !muted;
    });
  };

  const toggleLike = (productId: string) => {
    setLikes(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  const scrollToNext = () => {
    if (currentIndex < products.length - 1 && containerRef.current) {
      containerRef.current.scrollTo({
        top: (currentIndex + 1) * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    setChatMessages(prev => [...prev, {
      user: "You",
      message: chatMessage,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you"
    }]);
    setChatMessage("");
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="relative h-screen w-full snap-start snap-always flex items-center justify-center"
          >
            {/* Video Background */}
            <video
              ref={el => { videoRefs.current[product.id] = el; }}
              src={product.video_url}
              className="absolute inset-0 w-full h-full object-cover"
              loop
              muted={muted}
              playsInline
              poster={product.image_url}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20">
              <div className="flex items-center gap-3">
                {product.is_live && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    <span className="text-white text-xs font-bold">LIVE</span>
                  </div>
                )}
                {product.is_live && product.viewer_count && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-white text-xs font-semibold">
                      {product.viewer_count.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <button className="text-white p-2 hover:bg-white/10 rounded-full transition">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Live Chat Messages (floating) */}
            {product.is_live && !showChat && chatMessages.length > 0 && (
              <div className="absolute left-4 bottom-32 z-20 space-y-2 max-w-[60%]">
                {chatMessages.slice(-3).map((msg, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-black/40 backdrop-blur-md rounded-2xl p-2 animate-in slide-in-from-left"
                  >
                    <img src={msg.avatar} alt={msg.user} className="w-6 h-6 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-xs font-semibold">{msg.user}</p>
                      <p className="text-white text-xs">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 pb-20 z-20">
              {/* Left Side - Product Info */}
              <div className="flex-1 space-y-3 max-w-[70%]">
                <div className="flex items-center gap-3">
                  <img
                    src={product.seller_avatar}
                    alt={product.seller_name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <span className="text-white font-semibold text-sm">@{product.seller_name}</span>
                  <button className="px-4 py-1 bg-white text-black text-xs font-bold rounded-full hover:bg-white/90 transition">
                    Follow
                  </button>
                </div>

                <h3 className="text-white font-bold text-base leading-tight">
                  {product.name}
                </h3>

                <p className="text-white/90 text-sm leading-snug line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-xl">
                    {formatIDR(product.price_cents)}
                  </span>
                  {product.compare_at_cents && (
                    <>
                      <span className="text-white/60 text-sm line-through">
                        {formatIDR(product.compare_at_cents)}
                      </span>
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                        {Math.round((1 - product.price_cents / product.compare_at_cents) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition inline-flex items-center gap-2 shadow-lg">
                    <ShoppingBag className="w-4 h-4" />
                    Buy Now
                  </button>
                  <button
                    onClick={() => setShowProductBasket(true)}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-full font-semibold text-sm hover:bg-white/30 transition"
                  >
                    View Products
                  </button>
                </div>
              </div>

              {/* Right Side - Action Buttons */}
              <div className="flex flex-col items-center gap-4 pb-4">
                <button
                  onClick={() => toggleLike(product.id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition">
                    <Heart
                      className={`w-7 h-7 transition ${
                        likes[product.id]
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-white"
                      }`}
                    />
                  </div>
                  <span className="text-white text-xs font-bold">
                    {likes[product.id] ? product.sold_count + 1 : product.sold_count}
                  </span>
                </button>

                <button
                  onClick={() => setShowChat(!showChat)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition relative">
                    <MessageCircle className="w-7 h-7 text-white" />
                    {product.is_live && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className="text-white text-xs font-bold">
                    {Math.floor(product.sold_count * 0.3)}
                  </span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition">
                    <Share2 className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-white text-xs font-bold">Share</span>
                </button>

                <button
                  onClick={toggleMute}
                  className="flex flex-col items-center gap-1 group mt-2"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition">
                    {muted ? (
                      <VolumeX className="w-6 h-6 text-white" />
                    ) : (
                      <Volume2 className="w-6 h-6 text-white" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Scroll Indicator */}
            {index < products.length - 1 && (
              <button
                onClick={scrollToNext}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white transition animate-bounce"
              >
                <ChevronUp className="w-6 h-6 rotate-180" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-20 right-4 z-30 flex flex-col gap-1">
        {products.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-8 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white"
                : index < currentIndex
                ? "bg-white/50"
                : "bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Product Basket Popup (Shopee-style) */}
      {showProductBasket && (
        <div className="absolute inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowProductBasket(false)}
          />
          <div className="relative w-full bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Products in this video</h3>
              <button
                onClick={() => setShowProductBasket(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {[currentProduct].map((product) => (
                <div key={product.id} className="flex gap-3 p-3 border rounded-xl hover:bg-gray-50 transition">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-orange-600 font-bold">
                        {formatIDR(product.price_cents)}
                      </span>
                      {product.compare_at_cents && (
                        <span className="text-gray-400 text-xs line-through">
                          {formatIDR(product.compare_at_cents)}
                        </span>
                      )}
                    </div>
                    <button className="mt-2 w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Panel */}
      {showChat && currentProduct.is_live && (
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-lg rounded-t-3xl p-4 max-h-[50vh] flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">Live Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 mb-3">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <img src={msg.avatar} alt={msg.user} className="w-8 h-8 rounded-full" />
                <div className="flex-1 bg-white/10 rounded-2xl p-2">
                  <p className="text-white/90 text-xs font-semibold">{msg.user}</p>
                  <p className="text-white text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Say something..."
              className="flex-1 bg-white/10 text-white placeholder-white/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button
              onClick={sendChatMessage}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-2 rounded-full hover:opacity-90 transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
