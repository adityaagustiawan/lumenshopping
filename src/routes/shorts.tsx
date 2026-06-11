import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Share2, MoreVertical, Volume2, VolumeX, ChevronUp } from "lucide-react";
import { formatIDR } from "@/lib/format";
import type { Product } from "@/lib/products.functions";

// Sample video products with reliable test video URLs
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
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
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
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
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
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
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
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
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
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
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
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Handle initial user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      const currentVideo = videoRefs.current[currentIndex];
      if (currentVideo && currentVideo.paused) {
        currentVideo.play().catch(console.error);
      }
    };

    if (!hasInteracted) {
      window.addEventListener('click', handleFirstInteraction, { once: true });
      window.addEventListener('touchstart', handleFirstInteraction, { once: true });
      
      return () => {
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
      };
    }
  }, [hasInteracted, currentIndex]);

  // Handle video playback when index changes
  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      // Reset video to start
      currentVideo.currentTime = 0;
      
      // Attempt to play only if user has interacted
      if (hasInteracted) {
        const playPromise = currentVideo.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Video play error:", error);
              setIsPlaying(false);
            });
        }
      }
    }

    // Pause other videos
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, hasInteracted]);

  // Handle video errors
  const handleVideoError = (productId: string, error: any) => {
    console.error(`Video error for ${productId}:`, error);
    setVideoErrors(prev => ({ ...prev, [productId]: true }));
  };

  // Handle video click to play/pause
  const handleVideoClick = () => {
    setHasInteracted(true);
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
            {!videoErrors[product.id] ? (
              <video
                ref={el => { videoRefs.current[index] = el; }}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                src={product.video_url}
                loop
                muted={muted}
                playsInline
                preload="metadata"
                poster={product.image_url}
                crossOrigin="anonymous"
                onClick={handleVideoClick}
                onError={(e) => {
                  console.error(`Video load error for ${product.id}:`, e);
                  handleVideoError(product.id, e);
                }}
                onLoadedMetadata={() => {
                  console.log(`Video metadata loaded for ${product.id}`);
                  // Video metadata loaded - ready to play
                  if (index === currentIndex && hasInteracted) {
                    const video = videoRefs.current[index];
                    if (video && video.paused) {
                      video.play().then(() => {
                        console.log(`Video playing for ${product.id}`);
                        setIsPlaying(true);
                      }).catch((err) => {
                        console.error(`Video play error for ${product.id}:`, err);
                      });
                    }
                  }
                }}
                onPlay={() => {
                  if (index === currentIndex) {
                    setIsPlaying(true);
                  }
                }}
                onPause={() => {
                  if (index === currentIndex) {
                    setIsPlaying(false);
                  }
                }}
              />
            ) : (
              /* Fallback to poster image when video fails */
              <img
                src={product.image_url}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Video Error Overlay */}
            {videoErrors[product.id] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10">
                <div className="text-center text-white p-8 bg-black/50 backdrop-blur-sm rounded-2xl max-w-sm mx-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold mb-2">Video Unavailable</p>
                  <p className="text-sm text-white/70 mb-4">This video cannot be loaded at the moment</p>
                  <p className="text-xs text-white/50">Showing product image instead</p>
                </div>
              </div>
            )}

            {/* Initial Play Prompt */}
            {!hasInteracted && index === currentIndex && !videoErrors[product.id] && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center text-white p-6 bg-black/50 backdrop-blur-sm rounded-2xl">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2" />
                  </div>
                  <p className="text-lg font-semibold mb-2">Tap to start</p>
                  <p className="text-sm text-white/70">Tap anywhere to play videos</p>
                </div>
              </div>
            )}

            {/* Play/Pause Indicator */}
            {hasInteracted && !isPlaying && index === currentIndex && !videoErrors[product.id] && (
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
