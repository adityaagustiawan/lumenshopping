import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Share2, MoreVertical, Volume2, VolumeX, ChevronUp } from "lucide-react";
import { formatIDR } from "@/lib/format";
import type { Product } from "@/lib/products.functions";

// Sample video products with real video URLs from the internet
const videoProducts: (Product & { video_url: string })[] = [
  {
    id: "v1",
    slug: "wireless-earbuds-pro",
    name: "Premium Wireless Earbuds Pro",
    description: "Experience crystal-clear sound with active noise cancellation and 30-hour battery life.",
    price_cents: 149900,
    compare_at_cents: 199900,
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
    category_slug: "electronics",
    rating: 4.8,
    sold_count: 1234,
    stock: 50,
    location: "Jakarta",
    is_featured: true,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: "v2",
    slug: "smart-watch-ultra",
    name: "Smart Watch Ultra - Fitness Tracker",
    description: "Track your health, fitness, and stay connected with this advanced smartwatch.",
    price_cents: 299900,
    compare_at_cents: 399900,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    category_slug: "electronics",
    rating: 4.9,
    sold_count: 2341,
    stock: 30,
    location: "Bandung",
    is_featured: true,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  },
  {
    id: "v3",
    slug: "portable-speaker",
    name: "Waterproof Portable Bluetooth Speaker",
    description: "360° sound with deep bass, waterproof design perfect for outdoor adventures.",
    price_cents: 89900,
    compare_at_cents: 129900,
    image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    category_slug: "electronics",
    rating: 4.7,
    sold_count: 876,
    stock: 75,
    location: "Surabaya",
    is_featured: false,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  },
  {
    id: "v4",
    slug: "gaming-headset",
    name: "RGB Gaming Headset with 7.1 Surround",
    description: "Immersive gaming audio with comfortable design and RGB lighting effects.",
    price_cents: 179900,
    compare_at_cents: 249900,
    image_url: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&q=80",
    category_slug: "electronics",
    rating: 4.6,
    sold_count: 543,
    stock: 40,
    location: "Jakarta",
    is_featured: false,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  },
  {
    id: "v5",
    slug: "wireless-charger",
    name: "Fast Wireless Charging Pad",
    description: "15W fast charging for all Qi-enabled devices with sleek design.",
    price_cents: 59900,
    compare_at_cents: 89900,
    image_url: "https://images.unsplash.com/photo-1591290619762-c588f0e8e0b4?w=400&q=80",
    category_slug: "electronics",
    rating: 4.5,
    sold_count: 1567,
    stock: 100,
    location: "Medan",
    is_featured: false,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
  }
];

const shortsQuery = queryOptions({
  queryKey: ["shorts"],
  queryFn: async () => videoProducts
});

export const Route = createFileRoute("/shorts")({
  head: () => ({
    meta: [
      { title: "Shorts — Lumen" },
      { name: "description", content: "Discover products through short videos" },
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoErrors, setVideoErrors] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Handle video playback when index changes
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      // Reset video to start
      currentVideo.currentTime = 0;
      
      // Attempt to play
      const playPromise = currentVideo.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Video play error:", error);
            // If autoplay fails, user needs to interact first
            setIsPlaying(false);
          });
      }
    }

    // Pause other videos
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex]);

  // Handle video errors
  const handleVideoError = (productId: string, error: any) => {
    console.error(`Video error for ${productId}:`, error);
    setVideoErrors(prev => ({ ...prev, [productId]: true }));
  };

  // Handle video click to play/pause
  const handleVideoClick = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      if (currentVideo.paused) {
        currentVideo.play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      } else {
        currentVideo.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const windowHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / windowHeight);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < products.length) {
      setCurrentIndex(newIndex);
    }
  };

  const toggleMute = () => {
    const newMutedState = !muted;
    setMuted(newMutedState);
    videoRefs.current.forEach(video => {
      if (video) video.muted = newMutedState;
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

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="relative h-screen w-full snap-start snap-always flex items-center justify-center"
          >
            {/* Video Background */}
            <video
              ref={el => { videoRefs.current[index] = el; }}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              src={product.video_url}
              loop
              muted={muted}
              playsInline
              preload="auto"
              poster={product.image_url}
              onClick={handleVideoClick}
              onError={(e) => handleVideoError(product.id, e)}
              onLoadedData={() => {
                // Video loaded successfully
                if (index === currentIndex) {
                  const video = videoRefs.current[index];
                  if (video) {
                    video.play().catch(console.error);
                  }
                }
              }}
            />

            {/* Video Error Overlay */}
            {videoErrors[product.id] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                <div className="text-center text-white p-6">
                  <p className="text-lg mb-2">Unable to load video</p>
                  <p className="text-sm text-white/70">Please check your connection</p>
                </div>
              </div>
            )}

            {/* Play/Pause Indicator */}
            {!isPlaying && index === currentIndex && !videoErrors[product.id] && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2" />
                </div>
              </div>
            )}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20">
              <div className="flex items-center gap-3">
                <button className="text-white text-sm font-semibold px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                  Following
                </button>
                <button className="text-white/70 text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/10 transition">
                  For You
                </button>
              </div>
              <button className="text-white p-2 hover:bg-white/10 rounded-full transition">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 pb-20 z-20">
              {/* Left Side - Product Info */}
              <div className="flex-1 space-y-3 max-w-[70%]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {product.name.charAt(0)}
                  </div>
                  <span className="text-white font-semibold">@lumen_store</span>
                  <button className="px-4 py-1 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition">
                    Follow
                  </button>
                </div>

                <h3 className="text-white font-semibold text-base leading-tight">
                  {product.name}
                </h3>

                <p className="text-white/90 text-sm leading-snug line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-lg">
                    {formatIDR(product.price_cents)}
                  </span>
                  {product.compare_at_cents && (
                    <span className="text-white/60 text-sm line-through">
                      {formatIDR(product.compare_at_cents)}
                    </span>
                  )}
                </div>

                <button className="bg-white text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-white/90 transition inline-flex items-center gap-2">
                  Shop Now
                </button>
              </div>

              {/* Right Side - Action Buttons */}
              <div className="flex flex-col items-center gap-5 pb-4">
                <button
                  onClick={() => toggleLike(product.id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition">
                    <Heart
                      className={`w-7 h-7 transition ${
                        likes[product.id]
                          ? "fill-red-500 text-red-500"
                          : "text-white"
                      }`}
                    />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    {likes[product.id] ? product.sold_count + 1 : product.sold_count}
                  </span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    {Math.floor(product.sold_count * 0.3)}
                  </span>
                </button>

                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition">
                    <Share2 className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-white text-xs font-semibold">Share</span>
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
    </div>
  );
}

// Made with Bob
