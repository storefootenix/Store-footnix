import React from 'react';
import { Home, Grid, Search, ShoppingBag, ShieldCheck, User } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

interface MobileBottomNavProps {
  session: Session | null;
  activeTab: string;
  cartCount: number;
  onNavigateHome: () => void;
  onNavigateCatalog: () => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenContact: () => void;
  onOpenAccount: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  session,
  activeTab,
  cartCount,
  onNavigateHome,
  onNavigateCatalog,
  onOpenSearch,
  onOpenCart,
  onOpenContact,
  onOpenAccount,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] pb-safe md:hidden select-none"
    >
      <div className="grid grid-cols-5 h-14 items-center px-2">
        {/* 1. Home */}
        <button
          onClick={onNavigateHome}
          className={`flex flex-col items-center justify-center h-full py-1 active:scale-90 transition-transform cursor-pointer relative ${
            activeTab === 'home' ? 'text-[#245bff]' : 'text-neutral-500 hover:text-neutral-900'
          }`}
          aria-label="Home"
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>
            Home
          </span>
          {activeTab === 'home' && (
            <span className="w-1 h-1 bg-[#245bff] rounded-full absolute bottom-1" />
          )}
        </button>

        {/* 2. Catalog */}
        <button
          onClick={onNavigateCatalog}
          className={`flex flex-col items-center justify-center h-full py-1 active:scale-90 transition-transform cursor-pointer relative ${
            activeTab === 'catalog' ? 'text-[#245bff]' : 'text-neutral-500 hover:text-neutral-900'
          }`}
          aria-label="Catalog"
        >
          <Grid className={`w-5 h-5 ${activeTab === 'catalog' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'catalog' ? 'font-bold' : 'font-medium'}`}>
            Catalog
          </span>
          {activeTab === 'catalog' && (
            <span className="w-1 h-1 bg-[#245bff] rounded-full absolute bottom-1" />
          )}
        </button>

        {/* 3. Search */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center h-full py-1 text-neutral-600 hover:text-neutral-900 active:scale-90 transition-transform cursor-pointer"
          aria-label="Search"
        >
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shadow-2xs">
            <Search className="w-4 h-4 stroke-[2.2] text-neutral-800" />
          </div>
          <span className="text-[10px] font-medium mt-0.5 tracking-tight text-neutral-600">
            Search
          </span>
        </button>

        {/* 4. Cart Bag */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center h-full py-1 text-neutral-600 hover:text-neutral-900 active:scale-90 transition-transform cursor-pointer relative"
          aria-label={`Cart, ${cartCount} items`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 bg-[#245bff] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs animate-scale-in">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5 tracking-tight">
            Bag
          </span>
        </button>

        {/* 5. Account */}
        <button
          onClick={onOpenAccount}
          className={`flex flex-col items-center justify-center h-full py-1 active:scale-90 transition-transform cursor-pointer relative ${
            activeTab === 'account' ? 'text-[#245bff]' : 'text-neutral-500 hover:text-neutral-900'
          }`}
          aria-label="Account"
        >
          {session?.user?.user_metadata?.avatar_url ? (
            <img src={session.user.user_metadata.avatar_url} referrerPolicy="no-referrer" alt="Profile" className="w-5 h-5 rounded-full border border-neutral-200" />
          ) : (
            <User className={`w-5 h-5 ${activeTab === 'account' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          )}
          <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'account' ? 'font-bold' : 'font-medium'}`}>
            Account
          </span>
          {activeTab === 'account' && (
            <span className="w-1 h-1 bg-[#245bff] rounded-full absolute bottom-1" />
          )}
        </button>
      </div>
    </nav>
  );
};
