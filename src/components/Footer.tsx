import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight, ShieldCheck, Truck, RefreshCw, Instagram, Twitter, Facebook } from 'lucide-react';
import { StoreBannerConfig } from '../data/storeConfig';

interface FooterProps {
  config: StoreBannerConfig;
  onNavigateSection: (category: string) => void;
  onOpenContact: () => void;
  onOpenAdmin?: () => void;
  onNavigateLegal?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onNavigateSection, onOpenContact, onOpenAdmin, onNavigateLegal }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [promoRevealed, setPromoRevealed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setPromoRevealed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#171923] text-white">
      {/* NEWSLETTER SECTION (Terracotta / Coral Red background matching screenshot) */}
      <div className="w-full bg-[#dc4a38] py-12 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-4xl mx-auto">
          <span className="text-[11px] font-mono tracking-widest uppercase block mb-3 text-white/90 font-bold">
            NEWSLETTER
          </span>

          <form onSubmit={handleSubscribe} className="relative">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-baseline gap-4 sm:gap-6 border-b border-white/60 pb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-transparent text-xl sm:text-2xl md:text-3xl font-serif-store placeholder-white/70 text-white focus:outline-none py-1"
              />
              <button
                type="submit"
                className="text-sm font-bold uppercase tracking-widest text-white hover:text-black transition-colors whitespace-nowrap self-end sm:self-auto py-2 px-3 rounded-xs bg-black/20 hover:bg-white"
              >
                SUBSCRIBE
              </button>
            </div>
          </form>

          {subscribed && (
            <div className="mt-4 p-3 bg-white/10 rounded border border-white/30 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>Thank you for subscribing! Your 5% discount code is <strong>FIRST5</strong></span>
              </div>
              <span className="font-mono text-xs bg-black/30 px-2 py-0.5 rounded">CODE: FIRST5</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Footer Links & Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Giant Wordmark Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif-store font-light tracking-tight text-white mb-4">
                {config.storeName || 'Store'}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed mb-6 whitespace-pre-line">
                {config.storeDescription || 'Welcome to the store.'}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs text-neutral-400 pt-4 border-t border-neutral-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#245bff]" />
                <span>100% Authentic Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#245bff]" />
                <span>Safe Armored Packaging</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {config.instagramUrl && (
                <a href={config.instagramUrl} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {config.twitterUrl && (
                <a href={config.twitterUrl} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {config.facebookUrl && (
                <a href={config.facebookUrl} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Nav Columns (SHOP, CUSTOMER CARE, INFORMATION) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* SHOP */}
            <div>
              <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-300 mb-4 border-b border-neutral-800 pb-1">
                SHOP
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <button onClick={() => onNavigateSection('packs')} className="hover:text-white transition-colors">
                    Booster Packs &amp; Boxes
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateSection('cards')} className="hover:text-white transition-colors">
                    Match Attax Cards &amp; Singles
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateSection('stickers')} className="hover:text-white transition-colors">
                    Waterproof Vinyl Stickers
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateSection('posters')} className="hover:text-white transition-colors">
                    Football A5 Wall Posters
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateSection('all')} className="hover:text-white transition-colors">
                    View Complete Catalog
                  </button>
                </li>
              </ul>
            </div>

            {/* CUSTOMER CARE */}
            <div>
              <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-300 mb-4 border-b border-neutral-800 pb-1">
                CUSTOMER CARE
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <button onClick={onOpenContact} className="hover:text-white transition-colors">
                    Track Your Order
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateLegal && onNavigateLegal('shipping')} className="hover:text-white transition-colors">
                    Shipping &amp; Delivery Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateLegal && onNavigateLegal('refund')} className="hover:text-white transition-colors">
                    Returns &amp; Replacement
                  </button>
                </li>
                <li>
                  <button onClick={onOpenContact} className="hover:text-white transition-colors">
                    Cash on Delivery Terms
                  </button>
                </li>
                <li>
                  <button onClick={onOpenContact} className="hover:text-white transition-colors">
                    Collector Packaging Guide
                  </button>
                </li>
              </ul>
            </div>

            {/* INFORMATION */}
            <div>
              <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-300 mb-4 border-b border-neutral-800 pb-1">
                INFORMATION
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <button onClick={() => onNavigateLegal && onNavigateLegal('about')} className="hover:text-white transition-colors">
                    About Footenix Store
                  </button>
                </li>
                <li>
                  <button onClick={onOpenContact} className="hover:text-white transition-colors">
                    Card Grading (PSA/BGS Contenders)
                  </button>
                </li>
                <li>
                  <button onClick={onOpenContact} className="hover:text-white transition-colors">
                    Authenticity Verification
                  </button>
                </li>
                <li>
                  <button onClick={onOpenContact} className="hover:text-white transition-colors">
                    Bulk Collector Orders
                  </button>
                </li>
                <li>
                  <button onClick={onOpenContact} className="hover:text-white transition-colors">
                    Contact Us
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateLegal && onNavigateLegal('privacy')} className="hover:text-white transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateLegal && onNavigateLegal('terms')} className="hover:text-white transition-colors">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar: Copyright & Payment Badges */}
        <div className="mt-14 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-6">
            <p>© {new Date().getFullYear()} {config.storeName || 'Store'}. All rights reserved.</p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-white font-medium transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">SECURE PAYMENTS:</span>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400">
              <span className="bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">UPI</span>
              <span className="bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">CARDS</span>
              <span className="bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">NETBANKING</span>
              <span className="bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
