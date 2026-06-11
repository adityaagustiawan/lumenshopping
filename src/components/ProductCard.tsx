import { Link, useNavigate } from "@tanstack/react-router";
import { Star, MapPin, ExternalLink, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/products.functions";
import { formatIDR, formatCompact } from "@/lib/format";
import { getPlatformInfo } from "@/lib/platforms";

export function ProductCard({ p }: { p: Product }) {
  const navigate = useNavigate();
  const discount = p.compare_at_cents ? Math.round((1 - p.price_cents / p.compare_at_cents) * 100) : 0;
  const platformInfo = getPlatformInfo(p.platform);
  const isAffiliate = p.seller_type === 'affiliate' && p.affiliate_link;

  const handleAffiliateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(p.affiliate_link, '_blank', 'noopener,noreferrer');
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate({ to: "/product/$slug", params: { slug: p.slug } });
  };

  if (isAffiliate) {
    return (
      <div className="group block rounded-2xl bg-card overflow-hidden border border-border/60 hover:border-accent/40 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] transition-all">
        <div
          className="aspect-square overflow-hidden bg-muted relative cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={p.image_url}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-discount text-accent-foreground text-[10px] font-medium px-2 py-1 rounded-full">
              −{discount}%
            </span>
          )}
          
          {/* Platform badge */}
          {platformInfo && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-white/95 backdrop-blur px-2 py-1 rounded-full shadow-sm">
              <img 
                src={platformInfo.logo} 
                alt={platformInfo.name} 
                className="h-4 w-auto object-contain"
              />
              <span className="text-[10px] font-semibold text-gray-700">
                {platformInfo.name}
              </span>
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </div>
          )}
        </div>
        <div className="p-3 space-y-1.5">
          <h3 className="text-sm font-medium line-clamp-2 leading-snug min-h-[2.5rem]">{p.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-foreground">{formatIDR(p.price_cents)}</span>
            {p.compare_at_cents && (
              <span className="text-xs text-muted-foreground line-through">{formatIDR(p.compare_at_cents)}</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-accent text-accent" />
              {p.rating.toFixed(1)}
            </span>
            <span>{formatCompact(p.sold_count)} sold</span>
            <span className="flex items-center gap-0.5 ml-auto">
              <MapPin className="w-3 h-3" /> {p.location}
            </span>
          </div>
          
          {/* Call to action buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleAffiliateClick}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-blue-600 hover:from-accent/90 hover:to-blue-500 text-white text-xs font-semibold py-2 rounded-xl transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Buy on {platformInfo?.name}
            </button>
            <button
              onClick={handleImageClick}
              className="w-full text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For non-affiliate products, use Link
  return (
    <Link
      to="/product/$slug"
      params={{ slug: p.slug }}
      className="group block rounded-2xl bg-card overflow-hidden border border-border/60 hover:border-accent/40 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] transition-all"
    >
      <div className="aspect-square overflow-hidden bg-muted relative">
        <img
          src={p.image_url}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-discount text-accent-foreground text-[10px] font-medium px-2 py-1 rounded-full">
            −{discount}%
          </span>
        )}
        
        {/* Platform badge */}
        {platformInfo && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-white/95 backdrop-blur px-2 py-1 rounded-full shadow-sm">
            <img 
              src={platformInfo.logo} 
              alt={platformInfo.name} 
              className="h-4 w-auto object-contain"
            />
            <span className="text-[10px] font-semibold text-gray-700">
              {platformInfo.name}
            </span>
          </div>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-medium line-clamp-2 leading-snug min-h-[2.5rem]">{p.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold text-foreground">{formatIDR(p.price_cents)}</span>
          {p.compare_at_cents && (
            <span className="text-xs text-muted-foreground line-through">{formatIDR(p.compare_at_cents)}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-accent text-accent" />
            {p.rating.toFixed(1)}
          </span>
          <span>{formatCompact(p.sold_count)} sold</span>
          <span className="flex items-center gap-0.5 ml-auto">
            <MapPin className="w-3 h-3" /> {p.location}
          </span>
        </div>
        
        {/* Call to action button */}
        <div className="pt-2">
          <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold py-2 rounded-xl transition-all">
            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}