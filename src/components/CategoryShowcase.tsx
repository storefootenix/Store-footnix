import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface CategoryShowcaseProps {
  onSelectCategory: (category: 'packs' | 'cards') => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
  const [packsImgFailed, setPacksImgFailed] = useState(false);
  const [cardsImgFailed, setCardsImgFailed] = useState(false);

  const packsImgUrl =
    'https://footenix-store-2.myshopify.com/cdn/shop/files/Footenix_Store_Trading_Card_Packs.png?v=1790839312&width=1000';
  const cardsImgUrl =
    'https://footenix-store-2.myshopify.com/cdn/shop/files/WhatsApp_Image_2026-09-27_at_14.25.27.jpg?v=1790499453&width=1000';

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Editorial Section Headline */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-store font-normal text-[#212121] tracking-tight">
          What are you looking for?
        </h2>
      </div>

      {/* Two Column Visual Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* PACKS CATEGORY CARD */}
        <div
          onClick={() => onSelectCategory('packs')}
          className="group relative cursor-pointer overflow-hidden rounded-md bg-[#0a0f1d] aspect-[16/9] sm:aspect-[16/8] shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-neutral-800"
        >
          {/* Real CDN image with dark gradient scrim */}
          {!packsImgFailed ? (
            <img
              src={packsImgUrl}
              alt="Trading Card Booster Packs"
              referrerPolicy="no-referrer"
              onError={() => setPacksImgFailed(true)}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-slate-900 to-black" />
          )}

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />

          {/* Action & Label Overlay */}
          <div className="relative z-20 h-full flex flex-col justify-end p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif-store font-semibold tracking-tight group-hover:text-cyan-300 transition-colors">
                  Packs
                </h3>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Factory sealed booster packs &amp; boxes
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs group-hover:bg-white text-white group-hover:text-black flex items-center justify-center transition-all duration-300 shadow-sm">
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* CARDS CATEGORY CARD */}
        <div
          onClick={() => onSelectCategory('cards')}
          className="group relative cursor-pointer overflow-hidden rounded-md bg-[#091024] aspect-[16/9] sm:aspect-[16/8] shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-neutral-800"
        >
          {/* Real CDN image with dark gradient scrim */}
          {!cardsImgFailed ? (
            <img
              src={cardsImgUrl}
              alt="Premier League Match Attax Cards"
              referrerPolicy="no-referrer"
              onError={() => setCardsImgFailed(true)}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-amber-950 via-slate-900 to-black" />
          )}

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />

          {/* Action & Label Overlay */}
          <div className="relative z-20 h-full flex flex-col justify-end p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif-store font-semibold tracking-tight group-hover:text-yellow-300 transition-colors">
                  Cards
                </h3>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Singles, rare foils, rookies &amp; 100 club
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs group-hover:bg-white text-white group-hover:text-black flex items-center justify-center transition-all duration-300 shadow-sm">
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
