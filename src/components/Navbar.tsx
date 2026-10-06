import React, { useState } from 'react';
import { Search, ShoppingBag, User, ShieldCheck, Menu, X, ArrowRight, Package, Layers, Sparkles, Image as ImageIcon, Sticker } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenContact: () => void;
  onOpenAdmin?: () => void;
  announcementText?: string;
  activeTab: 'home' | 'catalog' | 'contact';
  onNavigate: (tab: 'home' | 'catalog' | 'contact', category?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenContact,
  onOpenAdmin,
  announcementText = 'SHOP FOR 2500 GET 1 CHROME X TOPPS FREE',
  activeTab,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = (tab: 'home' | 'catalog' | 'contact', category?: string) => {
    setMobileMenuOpen(false);
    onNavigate(tab, category);
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-neutral-100">
      {/* 1. TOP ANNOUNCEMENT BAR (Matching exact screenshot: Deep Navy) */}
      <div className="w-full bg-[#101d3e] text-white py-2 px-3 sm:px-4 text-center">
        <p className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase truncate">
          {announcementText}
        </p>
      </div>

      {/* 2. MAIN BRAND & UTILITIES BAR */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18">
          {/* Left: Mobile Menu Toggle + Search Trigger */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-1 text-neutral-800 hover:text-[#245bff] md:hidden rounded-full hover:bg-neutral-50 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 stroke-[2]" />
            </button>

            <button
              onClick={onOpenSearch}
              className="p-2 text-neutral-800 hover:text-[#245bff] transition-colors rounded-full hover:bg-neutral-50 flex items-center gap-2 group"
              title="Search collectibles"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
              <span className="hidden md:inline text-xs text-neutral-500 group-hover:text-neutral-800">
                Search cards...
              </span>
            </button>
          </div>

          {/* Center: Brand Wordmark (Newsreader Serif) */}
          <div className="text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xl sm:text-3xl md:text-4xl font-serif-store font-light tracking-tight text-[#171923] hover:opacity-90 transition-opacity truncate max-w-[200px] sm:max-w-none"
            >
              Footenix Store
            </button>
          </div>

          {/* Right: Admin Button, Collector Profile & Shopping Bag */}
          <div className="flex items-center gap-1 sm:gap-2">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-[#171923] hover:bg-[#245bff] text-white text-[11px] font-semibold transition-colors shadow-2xs mr-1 cursor-pointer"
                title="Store Admin Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Admin Panel</span>
              </button>
            )}

            <button
              onClick={onOpenContact}
              className="hidden sm:flex p-2 text-neutral-800 hover:text-[#245bff] transition-colors rounded-full hover:bg-neutral-50"
              title="Collector Support"
              aria-label="Account / Support"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
            </button>

            <button
              onClick={onOpenCart}
              className="p-2 text-neutral-800 hover:text-[#245bff] transition-colors rounded-full hover:bg-neutral-50 relative cursor-pointer"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-[#245bff] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. PRIMARY NAVIGATION LINKS (Hidden on small mobile, clean on md+) */}
        <nav className="hidden md:flex items-center justify-center gap-8 py-2.5 border-t border-neutral-100 text-xs sm:text-sm font-medium text-neutral-700">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors py-1 border-b-2 ${
              activeTab === 'home'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className={`transition-colors py-1 border-b-2 ${
              activeTab === 'catalog'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`transition-colors py-1 border-b-2 ${
              activeTab === 'contact'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Contact
          </button>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="transition-colors py-1 border-b-2 border-transparent text-[#245bff] hover:text-[#1a47d6] font-semibold"
            >
              Admin
            </button>
          )}
        </nav>
      </div>

      {/* MOBILE SLIDE-OUT DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="fixed inset-y-0 left-0 w-[80vw] max-w-xs bg-white shadow-2xl flex flex-col justify-between z-10 animate-slide-right">
            <div>
              {/* Header */}
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                <div>
                  <span className="font-serif-store text-lg font-bold text-[#171923]">
                    Footenix Store
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono block">
                    Authentic Collectibles
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-black rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Nav Items */}
              <div className="p-3 space-y-1">
                <button
                  onClick={() => handleMobileNav('home')}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-semibold flex items-center justify-between ${
                    activeTab === 'home' ? 'bg-neutral-100 text-[#245bff]' : 'text-neutral-800'
                  }`}
                >
                  <span>Home</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>

                <button
                  onClick={() => handleMobileNav('catalog')}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-semibold flex items-center justify-between ${
                    activeTab === 'catalog' ? 'bg-neutral-100 text-[#245bff]' : 'text-neutral-800'
                  }`}
                >
                  <span>All Catalog Products</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>

                {/* 4 Core Categories Sub-list */}
                <div className="pt-2 pb-1 px-3">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-neutral-400">
                    SHOP BY 4 CATEGORIES
                  </span>
                </div>

                <button
                  onClick={() => handleMobileNav('catalog', 'packs')}
                  className="w-full text-left px-3 py-2 rounded-md text-xs font-medium text-neutral-700 flex items-center gap-2 hover:bg-neutral-50"
                >
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>Booster Packs &amp; Boxes</span>
                </button>

                <button
                  onClick={() => handleMobileNav('catalog', 'cards')}
                  className="w-full text-left px-3 py-2 rounded-md text-xs font-medium text-neutral-700 flex items-center gap-2 hover:bg-neutral-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Match Attax Cards</span>
                </button>

                <button
                  onClick={() => handleMobileNav('catalog', 'stickers')}
                  className="w-full text-left px-3 py-2 rounded-md text-xs font-medium text-neutral-700 flex items-center gap-2 hover:bg-neutral-50"
                >
                  <Sticker className="w-4 h-4 text-purple-600" />
                  <span>Waterproof Stickers</span>
                </button>

                <button
                  onClick={() => handleMobileNav('catalog', 'posters')}
                  className="w-full text-left px-3 py-2 rounded-md text-xs font-medium text-neutral-700 flex items-center gap-2 hover:bg-neutral-50"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Football A5 Wall Posters</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions inside Mobile Drawer */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 space-y-2 pb-safe">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-2 px-3 text-xs font-semibold rounded border border-neutral-200 bg-white text-neutral-800 flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-neutral-500" />
                <span>Collector Support &amp; FAQ</span>
              </button>

              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full py-2 px-3 text-xs font-semibold rounded bg-[#171923] text-white flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Store Owner Admin Panel</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

