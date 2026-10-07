import React from 'react';
import { ArrowRight, Layers, Sparkles, Image as ImageIcon, Package, Sticker } from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  itemCount: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  thumbUrl: string;
}

import { CategoryConfigItem } from '../data/storeConfig';

interface ShopByCategoryProps {
  categories: CategoryConfigItem[];
  onSelectCategory: (category: string) => void;
  activeCategory?: string;
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({
  categories,
  onSelectCategory,
  activeCategory = 'all',
}) => {
  // Exactly 4 categories as requested: Packs, Match Attax Cards, Stickers, Posters
  const enrichedCategories = categories.map((cat) => {
    let icon = null;
    if (cat.id === 'packs') icon = <Package className="w-4 h-4 text-blue-600" />;
    else if (cat.id === 'cards') icon = <Sparkles className="w-4 h-4 text-amber-600" />;
    else if (cat.id === 'stickers') icon = <Sticker className="w-4 h-4 text-purple-600" />;
    else if (cat.id === 'posters') icon = <ImageIcon className="w-4 h-4 text-emerald-600" />;
    return { ...cat, icon };
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 rounded-full text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-neutral-600 font-semibold mb-2">
          <Layers className="w-3 h-3 text-[#245bff]" />
          <span>BROWSE BY CATEGORY</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif-store font-normal text-[#171923] tracking-tight">
          Shop by Category
        </h2>
        <p className="text-[11px] sm:text-sm text-neutral-500 mt-1 sm:mt-2 font-light max-w-md mx-auto">
          Find authentic Match Attax packs, rare holographic singles, archival football posters, and waterproof stickers.
        </p>
      </div>

      {/* Grid of exactly 4 Clean Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {enrichedCategories.map((cat) => {
          const isSelected = activeCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group cursor-pointer rounded-lg sm:rounded-xl overflow-hidden bg-white border transition-all duration-300 transform active:scale-[0.98] hover:-translate-y-1 flex flex-col justify-between shadow-2xs hover:shadow-xl ${
                isSelected
                  ? 'border-[#245bff] ring-2 ring-[#245bff] ring-offset-1'
                  : 'border-neutral-200/90 hover:border-neutral-300'
              }`}
            >
              {/* Top: 100% Clear, Bright Image Showcase */}
              <div className="relative w-full aspect-[4/4.2] bg-neutral-50 overflow-hidden flex items-center justify-center p-2.5 sm:p-3">
                <img
                  src={cat.thumbUrl}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-contain transform group-hover:scale-108 transition-transform duration-500"
                />

                {/* Badge top-right */}
                {cat.badge && (
                  <span
                    className={`absolute top-2 right-2 text-[8px] sm:text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded shadow-2xs ${
                      cat.badgeColor || 'bg-black text-white'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Bottom: Clean typography on white background */}
              <div className="p-2.5 sm:p-4 bg-white border-t border-neutral-100 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xs sm:text-base font-semibold text-[#171923] tracking-tight leading-snug group-hover:text-[#245bff] transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="mt-2 sm:mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-[#245bff]">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
