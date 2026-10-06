import React, { useState } from 'react';
import { Product } from '../data/products';
import { ProductCard } from './ProductCard';

interface ProductSectionProps {
  id?: string;
  title: string;
  products: Product[];
  onShopAll: () => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  addedIds?: Set<string>;
  reverse?: boolean;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  id,
  title,
  products,
  onShopAll,
  onQuickView,
  onAddToCart,
  addedIds = new Set(),
  reverse = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate products to form a seamless infinite loop
  const marqueeItems = [...products, ...products, ...products, ...products];

  // Speed normalization:
  // Each product card advances at the EXACT same physical velocity across all sections (3.0s per card)
  const SECONDS_PER_CARD = 3.0;
  const normalizedDuration = (marqueeItems.length / 2) * SECONDS_PER_CARD;

  return (
    <section
      id={id}
      className="w-full py-6 sm:py-8 md:py-12 border-b border-neutral-100 last:border-b-0 scroll-mt-20 overflow-hidden"
    >
      {/* Header Bar - Clean matching screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-serif-store tracking-wide uppercase text-[#212121] font-normal truncate pr-2">
            {title}
          </h2>

          {/* SHOP ALL Button (Solid black rectangle matching screenshot) */}
          <button
            onClick={onShopAll}
            className="shrink-0 bg-black hover:bg-neutral-800 text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase px-3.5 sm:px-5 py-2 rounded-xs transition-colors shadow-xs active:scale-95"
          >
            SHOP ALL
          </button>
        </div>
      </div>

      {/* INFINITE MARQUEE SHOWCASE CONTAINER */}
      <div
        className="relative w-full overflow-hidden select-none touch-pan-y"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {/* Left & Right Soft Fade Gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-4 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-4 sm:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Marquee Track with exact normalized physical speed */}
        <div
          className={`flex gap-3 sm:gap-6 py-2 px-2.5 sm:px-4 w-max ${
            reverse ? 'animate-product-marquee-reverse' : 'animate-product-marquee'
          }`}
          style={{
            animationDuration: `${normalizedDuration}s`,
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
        >
          {marqueeItems.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="w-[150px] sm:w-[220px] md:w-[250px] shrink-0 transform transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]"
            >
              <ProductCard
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                isAdded={addedIds.has(product.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
