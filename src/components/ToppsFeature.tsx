import React, { useState } from 'react';
import { Product } from '../data/products';

interface ToppsFeatureProps {
  id?: string;
  cardProduct: Product;
  onViewAllTopps: () => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ToppsFeature: React.FC<ToppsFeatureProps> = ({
  id,
  cardProduct,
  onViewAllTopps,
  onQuickView,
  onAddToCart,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const ronaldoCardImageUrl =
    'https://footenix-store-2.myshopify.com/cdn/shop/files/673754240.jpg?height=2400&v=1785043221';

  return (
    <section id={id} className="w-full bg-[#fbf9f6] pt-12 md:pt-16 pb-0 scroll-mt-24">
      {/* Editorial Header - Aligned with the content */}
      <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 mb-6">
        <div className="flex items-end justify-between border-b border-neutral-200/50 pb-2">
          <div>
            <span className="text-[11px] font-sans tracking-widest uppercase text-neutral-600 font-medium block mb-1">
              FOOTENIX STORE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-store italic font-normal text-[#171923] tracking-tight">
              Shop the Topps Collection
            </h2>
          </div>

          <button
            onClick={onViewAllTopps}
            className="text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:text-black transition-colors"
          >
            VIEW ALL
          </button>
        </div>
      </div>

      {/* FULL WIDTH SPLIT HERO SECTION (Matches image.png edge-to-edge layout) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[500px] lg:min-h-[620px] xl:min-h-[700px]">
        {/* Left Column: Pale Periwinkle / Lilac Showcase (Spans ~58% of screen) */}
        <div className="lg:col-span-7 bg-[#edf0fc] p-8 sm:p-14 lg:p-20 xl:p-24 flex flex-col justify-between">
          {/* Top Kicker */}
          <div>
            <span className="text-[11px] sm:text-xs font-sans tracking-widest uppercase text-neutral-600 font-medium block">
              OUR BESTSELLING PRODUCT
            </span>
          </div>

          {/* Middle Typography */}
          <div className="my-auto py-10 lg:py-16 max-w-xl">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif-store font-normal text-[#171923] tracking-tight mb-4">
              The Ultimate Card
            </h3>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-light">
              Own the iconic moment. Cristiano Ronaldo in premium Panini football card condition. Rare collectible with verified authenticity.
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onQuickView(cardProduct)}
              className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              SHOP NOW
            </button>
            <button
              onClick={() => onAddToCart(cardProduct)}
              className="text-xs sm:text-sm font-semibold text-[#245bff] hover:underline"
            >
              Quick Add • Rs. {cardProduct.price.toFixed(2)}
            </button>
          </div>
        </div>

        {/* Right Column: Full-height Real High-Res Card Image (Spans ~42% of screen to edge) */}
        <div
          onClick={() => onQuickView(cardProduct)}
          className="lg:col-span-5 relative cursor-pointer bg-[#cf9720] flex items-center justify-center overflow-hidden min-h-[420px] lg:min-h-full"
        >
          {!imgFailed ? (
            <img
              src={ronaldoCardImageUrl}
              alt="Cristiano Ronaldo Panini Icon Football Card #372"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover lg:object-contain object-center transform hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full p-8 flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-700 text-white">
              <span className="font-serif-store text-2xl">Cristiano Ronaldo #372 Icon Card</span>
            </div>
          )}
        </div>
      </div>

      {/* FULL WIDTH BLUE RIBBON MARQUEE (Edge to edge beneath the split section) */}
      <div className="w-full bg-[#245bff] text-white py-3.5 overflow-hidden select-none shadow-sm">
        <div className="animate-marquee flex items-center whitespace-nowrap text-xs sm:text-sm font-medium tracking-wide">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="mx-6 flex items-center gap-6">
              <span>Discover your next favourite</span>
              <span className="text-amber-300">✦</span>
              <span>Football cards and collectibles</span>
              <span className="text-amber-300">✦</span>
              <span>Made for the beautiful game</span>
              <span className="text-amber-300">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
