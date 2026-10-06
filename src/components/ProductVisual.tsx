import React, { useState } from 'react';
import { Product } from '../data/products';

interface ProductVisualProps {
  type: Product['imageType'];
  imageUrl?: string;
  alt?: string;
  className?: string;
  isHeroSpotlight?: boolean;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  type,
  imageUrl,
  alt = 'Footenix Collectible',
  className = '',
  isHeroSpotlight = false,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // If we have a valid image URL and it hasn't failed to load, render the authentic photo with fallback
  if (imageUrl && !imageFailed) {
    return (
      <div
        className={`relative w-full ${
          isHeroSpotlight
            ? 'h-full min-h-[380px] flex items-center justify-center p-2'
            : type.startsWith('sticker_')
            ? 'aspect-square bg-white flex items-center justify-center p-2'
            : 'aspect-[4/5] bg-neutral-100 flex items-center justify-center overflow-hidden'
        } ${className}`}
      >
        <img
          src={imageUrl}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImageFailed(true)}
          className={`w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300 ${
            type.startsWith('sticker_') ? 'filter drop-shadow-md' : 'rounded-sm'
          }`}
        />
      </div>
    );
  }

  // Fallback / Built-in high-fidelity styled visual
  switch (type) {
    case 'glue_dots':
      return (
        <div className={`relative w-full aspect-[4/5] bg-gradient-to-b from-[#111827] via-[#0b0f19] to-[#030712] rounded-md overflow-hidden flex flex-col items-center justify-between p-3 text-white shadow-inner select-none ${className}`}>
          {/* Header */}
          <div className="w-full flex items-center justify-between border-b border-yellow-500/30 pb-1.5">
            <span className="text-[10px] font-mono tracking-wider text-yellow-400 font-bold">FOOTENIX STORE</span>
            <span className="text-[9px] uppercase tracking-wider text-neutral-300">Stick • Display • Vibe</span>
          </div>

          <div className="text-center my-1">
            <h4 className="text-sm font-black tracking-tight text-yellow-400 uppercase drop-shadow">FOOTBALL POSTERS</h4>
            <p className="text-[9px] text-neutral-300 font-medium">THE PERFECT STICKING SOLUTION</p>
          </div>

          {/* Dots Grid Graphic */}
          <div className="w-full bg-[#1e293b]/80 border border-neutral-700/80 rounded-md p-2.5 my-1 shadow-inner relative overflow-hidden">
            <div className="grid grid-cols-5 gap-2 justify-items-center py-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full bg-gradient-to-br from-white via-cyan-100 to-blue-200 shadow-[0_0_6px_rgba(255,255,255,0.7)] border border-white/60 transform hover:scale-110 transition-transform"
                />
              ))}
            </div>
            {/* Center ribbon */}
            <div className="absolute inset-x-0 bottom-1 flex justify-center">
              <span className="bg-yellow-400 text-black text-[8px] font-black uppercase px-2 py-0.5 rounded shadow">
                EACH SHEET HAS 20 GLUE DOTS
              </span>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-1 w-full text-center text-[7px] text-neutral-300">
            <div className="bg-neutral-800/80 p-1 rounded border border-neutral-700">
              <span className="block font-bold text-yellow-400">NO WALL</span>
              DAMAGE
            </div>
            <div className="bg-neutral-800/80 p-1 rounded border border-neutral-700">
              <span className="block font-bold text-yellow-400">STRONG</span>
              HOLD
            </div>
            <div className="bg-neutral-800/80 p-1 rounded border border-neutral-700">
              <span className="block font-bold text-yellow-400">EASY TO</span>
              REMOVE
            </div>
          </div>
        </div>
      );

    case 'poster_haaland':
    case 'poster_mbappe':
    case 'poster_ronaldo':
    case 'poster_madrid':
    case 'poster_messi': {
      const posterDetails = {
        poster_haaland: {
          title: 'ERLING HAALAND',
          subtitle: 'MEDITATION CELEBRATION',
          bgColor: 'from-sky-900 via-sky-800 to-indigo-950',
          accent: 'text-sky-300',
          playerIcon: '🧘‍♂️ 9',
        },
        poster_mbappe: {
          title: 'KYLIAN MBAPPÉ',
          subtitle: '9 • REAL MADRID CF',
          bgColor: 'from-neutral-900 via-stone-800 to-zinc-950',
          accent: 'text-amber-300',
          playerIcon: '⚡ 9',
        },
        poster_ronaldo: {
          title: 'CLEAR YOUR MIND',
          subtitle: 'RONALDO BICYCLE KICK 2018',
          bgColor: 'from-blue-950 via-slate-900 to-black',
          accent: 'text-blue-300',
          playerIcon: '⚽ 7',
        },
        poster_madrid: {
          title: 'LOS BLANCOS',
          subtitle: 'EUROPEAN CHAMPIONS TRIO',
          bgColor: 'from-purple-950 via-slate-900 to-amber-950',
          accent: 'text-yellow-400',
          playerIcon: '👑 15',
        },
        poster_messi: {
          title: 'LIONEL MESSI',
          subtitle: 'WORLD CUP IMMORTALITY',
          bgColor: 'from-cyan-950 via-sky-900 to-amber-950',
          accent: 'text-cyan-300',
          playerIcon: '🏆 10',
        },
      }[type];

      return (
        <div className={`relative w-full aspect-[4/5] bg-[#e8ded5] overflow-hidden flex flex-col justify-between shadow-inner select-none ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#e3d8cd] via-[#ece2d9] to-[#ded2c5]" />

          <div className="relative z-10 mx-auto mt-5 w-[52%] aspect-[1/1.4] bg-white p-1 rounded-xs shadow-[0_12px_24px_rgba(0,0,0,0.35)] transform transition-transform group-hover:scale-105 duration-300">
            <div className={`w-full h-full bg-gradient-to-br ${posterDetails.bgColor} flex flex-col justify-between p-2 text-white overflow-hidden relative border border-white/20`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none" />

              <div className="flex justify-between items-start">
                <span className="text-[7px] font-bold tracking-widest text-white/80 font-mono">A5 EDITION</span>
                <span className={`text-[7px] font-bold ${posterDetails.accent}`}>{posterDetails.playerIcon}</span>
              </div>

              <div className="my-auto text-center py-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-sm shadow-inner mb-1 backdrop-blur-xs">
                  {type === 'poster_haaland' && '🧘'}
                  {type === 'poster_mbappe' && '🙅‍♂️'}
                  {type === 'poster_ronaldo' && '🤸‍♂️'}
                  {type === 'poster_madrid' && '👑'}
                  {type === 'poster_messi' && '🏆'}
                </div>
                <div className="text-[9px] font-black uppercase tracking-wider text-white drop-shadow-md">
                  {posterDetails.title}
                </div>
              </div>

              <div className="border-t border-white/20 pt-1 text-center">
                <span className="text-[6px] tracking-widest uppercase text-white/70 block">
                  {posterDetails.subtitle}
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-0 w-full mt-auto">
            <div className="w-full h-12 bg-gradient-to-t from-[#c5b5a2] to-[#d6c7b4] rounded-t-xl shadow-inner relative">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-[#b5a38f]/40" />
            </div>

            <div className="w-full h-6 bg-[#8b7762] relative flex items-center justify-center">
              <div className="absolute -top-7 w-5 h-7 bg-[#ede5db] rounded-t-full shadow-md flex items-center justify-center">
                <div className="absolute -top-5 flex gap-0.5">
                  <div className="w-1 h-5 bg-[#bda586] rounded-full transform -rotate-15" />
                  <div className="w-1 h-7 bg-[#ceb696] rounded-full" />
                  <div className="w-1 h-5 bg-[#bda586] rounded-full transform rotate-15" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'sticker_messi':
    case 'sticker_sui':
    case 'sticker_neymar':
    case 'sticker_united':
    case 'sticker_anime':
    case 'sticker_madrid':
      return (
        <div className={`relative w-full aspect-square bg-[#fcfcfc] flex items-center justify-center p-3 select-none ${className}`}>
          <div className="relative flex flex-col items-center justify-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-105">
            <div className="bg-white p-2.5 rounded-xl border-2 border-slate-200 shadow-xs flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-neutral-100 flex items-center justify-center text-2xl font-bold">
                {type === 'sticker_messi' && '🇦🇷 10'}
                {type === 'sticker_sui' && '⚡ SIUUU'}
                {type === 'sticker_neymar' && '🇧🇷 10'}
                {type === 'sticker_united' && '🔱 MUFC'}
                {type === 'sticker_anime' && '⚔️ ANIME'}
                {type === 'sticker_madrid' && '👑 REAL'}
              </div>
            </div>
            <span className="mt-1 text-[8px] font-bold text-neutral-400 font-mono tracking-wider">
              WATERPROOF DIE-CUT
            </span>
          </div>
        </div>
      );

    case 'card_ronaldo_icon':
      return (
        <div className={`relative w-full ${isHeroSpotlight ? 'h-full min-h-[380px]' : 'aspect-[2.5/3.5]'} bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-lg p-2 shadow-[0_20px_40px_rgba(0,0,0,0.35)] select-none group flex flex-col justify-between overflow-hidden border-2 border-amber-300/80 ${className}`}>
          <div className="absolute inset-0 holo-shimmer pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 flex items-center justify-between bg-black/60 backdrop-blur-xs px-2 py-1 rounded-sm border border-white/20 text-white">
            <div className="flex items-center gap-1.5">
              <div className="bg-white text-black font-black text-[9px] px-1 rounded-xs">FIFA</div>
              <span className="text-[10px] font-black tracking-wider text-yellow-300">#372</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-300">ICON</span>
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-600 to-red-600 border border-yellow-300 flex items-center justify-center text-[7px] font-black text-white">
                🇵🇹
              </div>
            </div>
          </div>

          <div className="relative z-10 flex-1 my-1.5 rounded-sm overflow-hidden bg-gradient-to-b from-blue-900/60 via-red-950/70 to-black/80 border border-amber-400/40 flex flex-col items-center justify-between p-2">
            <div className="relative z-10 flex flex-col items-center mt-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#e8be99] to-[#c79a70] border-2 border-white/80 overflow-hidden relative flex flex-col items-center justify-center shadow-lg">
                <span className="text-xl">⚽</span>
              </div>

              <div className="w-24 h-24 bg-gradient-to-b from-[#dc2626] to-[#991b1b] rounded-t-2xl border-2 border-black mt-1 p-2 flex flex-col items-center justify-between shadow-md relative overflow-hidden">
                <span className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1 font-serif-store">
                  7
                </span>
                <span className="text-[9px] font-black tracking-widest text-emerald-200 uppercase bg-black/40 px-2 py-0.5 rounded">
                  PORTUGAL
                </span>
              </div>
            </div>

            <div className="relative z-10 w-full grid grid-cols-4 gap-1 text-center bg-black/80 rounded border border-yellow-400/50 p-1">
              <div className="bg-red-900/60 rounded px-0.5 py-0.5">
                <span className="text-[7px] text-neutral-300 block">DEF</span>
                <span className="text-[11px] font-black text-white">68</span>
              </div>
              <div className="bg-cyan-900/60 rounded px-0.5 py-0.5">
                <span className="text-[7px] text-neutral-300 block">PASS</span>
                <span className="text-[11px] font-black text-white">86</span>
              </div>
              <div className="bg-emerald-900/60 rounded px-0.5 py-0.5">
                <span className="text-[7px] text-neutral-300 block">ATK</span>
                <span className="text-[11px] font-black text-emerald-300">93</span>
              </div>
              <div className="bg-amber-900/60 rounded px-0.5 py-0.5">
                <span className="text-[7px] text-neutral-300 block">TOT</span>
                <span className="text-[11px] font-black text-yellow-300">247</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-black text-white px-2 py-1.5 rounded-sm border border-yellow-400/80 flex items-center justify-between">
            <span className="text-xs font-black tracking-wider uppercase text-yellow-400 drop-shadow">
              CRISTIANO RONALDO
            </span>
            <span className="text-[9px] font-black text-white/90 bg-red-600 px-1 py-0.5 rounded-xs">
              PANINI
            </span>
          </div>

          <div className="relative z-10 text-right mt-0.5">
            <span className="text-[7px] font-mono tracking-wider text-black/80 font-bold uppercase">
              todocoleccion • verified
            </span>
          </div>
        </div>
      );

    default:
      return (
        <div className="w-full aspect-square bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs font-mono">
          Footenix Official
        </div>
      );
  }
};
