import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onShopMatchAttax: () => void;
  imageUrl?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopMatchAttax, imageUrl }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const bannerUrl =
    imageUrl ||
    'https://footenix-store-2.myshopify.com/cdn/shop/files/crop-safer-match-attax-banner.png?v=1790839358&width=1920';

  return (
    <section className="relative w-full bg-[#0a1128] overflow-hidden">
      {/* Prominent Callout Button right above/center the banner as shown in screenshot */}
      <div className="w-full bg-[#0d1633] py-2.5 px-4 flex justify-center border-b border-blue-900/40 relative z-20">
        <button
          onClick={onShopMatchAttax}
          className="inline-flex items-center gap-2 bg-[#245bff] hover:bg-[#1a4de6] text-white font-bold text-xs md:text-sm tracking-wider uppercase px-6 py-2.5 rounded shadow-[0_4px_16px_rgba(36,91,255,0.4)] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>SHOP ALL MATCH ATTAX</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Main Electric Stadium Hero Arena */}
      <div className="relative w-full aspect-[16/8] sm:aspect-[16/6] md:aspect-[21/8] min-h-[180px] sm:min-h-[220px] max-h-[520px] flex items-center justify-center overflow-hidden bg-[#0a1128]">
        {!imageFailed ? (
          <img
            src={bannerUrl}
            alt="Match Attax 2024/25 Official Football Trading Cards"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover object-center select-none"
          />
        ) : (
          /* Fallback Electric Arena Vector Graphic */
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0e1838] via-[#091129] to-[#040817]" />
            <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-sm sm:text-base">★</span>
                ))}
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-blue-500 font-sans">
                MATCH ATTAX
              </h1>
              <span className="mt-2 text-[10px] font-mono tracking-widest text-cyan-300 uppercase px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40">
                2024/25 OFFICIAL LICENSED CARDS
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Marquee Ticker Bar (Light Blue, matching screenshot) */}
      <div className="w-full bg-[#e8f0fe] border-y border-[#cddbf5] py-2 overflow-hidden select-none">
        <div className="animate-marquee flex items-center whitespace-nowrap text-xs md:text-sm font-medium text-[#101d3e]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="mx-6 flex items-center gap-6">
              <span>Get 5% off your first order use <strong>FIRST5</strong></span>
              <span className="text-blue-400">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
