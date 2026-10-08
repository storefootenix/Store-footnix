/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ShopByCategory } from './components/ShopByCategory';
import { ProductSection } from './components/ProductSection';
import { Footer } from './components/Footer';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { SearchModal } from './components/SearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ContactModal } from './components/ContactModal';
import { CatalogView } from './components/CatalogView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { UserDashboard } from './components/UserDashboard';
import { LegalPages } from './components/LegalPages';
import { Product } from './data/products';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { Order } from './data/orders';
import { StoreBannerConfig, CategoryConfigItem } from './data/storeConfig';
import { Check, ArrowUp } from 'lucide-react';

const DEFAULT_CATEGORIES: CategoryConfigItem[] = [
  {
    id: 'packs',
    name: 'Packs',
    subtitle: 'Sealed Packs & Boxes',
    badge: 'Booster Packs',
    badgeColor: 'bg-blue-600 text-white',
    thumbUrl: 'https://footenix-store-2.myshopify.com/cdn/shop/files/Footenix_Store_Trading_Card_Packs.png?v=1790839312&width=600',
  },
  {
    id: 'cards',
    name: 'Match Attax Cards',
    subtitle: 'Singles, Foils & 100 Club',
    badge: 'Rare Foils',
    badgeColor: 'bg-amber-600 text-white',
    thumbUrl: 'https://footenix-store-2.myshopify.com/cdn/shop/files/WhatsApp_Image_2026-09-27_at_14.25.27.jpg?v=1790499453&width=600',
  },
  {
    id: 'panini',
    name: 'Panini Cards',
    subtitle: 'Authentic Collections',
    badge: 'Trending',
    badgeColor: 'bg-red-600 text-white',
    thumbUrl: 'https://footenix-store-2.myshopify.com/cdn/shop/files/Footenix_Store_Trading_Card_Packs.png?v=1790839312&width=600',
  },
  {
    id: 'stickers',
    name: 'Topps 24/25',
    subtitle: 'Topps 24/25 Collections',
    badge: 'Vinyl Die-Cut',
    badgeColor: 'bg-purple-600 text-white',
    thumbUrl: 'https://footenix-store-2.myshopify.com/cdn/shop/files/WhatsAppImage2026-09-13at18.13.44.jpg?v=1789304371&width=600',
  },
  {
    id: 'posters',
    name: 'Posters',
    subtitle: 'A5 Archival Wall Prints',
    badge: 'Football Posters',
    badgeColor: 'bg-emerald-600 text-white',
    thumbUrl: 'https://footenix-store-2.myshopify.com/cdn/shop/files/WhatsAppImage2026-09-29at20.10.24.jpg?v=1790698062&width=600',
  },
];

export default function App() {
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'contact' | 'account' | 'legal'>('home');
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'refund' | 'shipping'>('privacy');
  const [catalogFilter, setCatalogFilter] = useState<string>('all');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('footenixAdminToken'));
  
  // Live Store State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bannerConfig, setBannerConfig] = useState<StoreBannerConfig>({
    heroBannerUrl: '',
    paniniBannerUrl: '',
    stickersBannerUrl: '',
    postersBannerUrl: '',
    showPaniniBanner: false,
    showStickersBanner: false,
    showPostersBanner: false,
    announcementText: '',
    freeShippingThreshold: 0,
    freeGiftThreshold: 0,
    codEnabled: false,
    supportPhone: '',
    supportEmail: '',
    storeName: 'Footenix Store',
    storeDescription: 'RARE CARDS AND PREMIUM QUALITY. Welcome to the ultimate destination for football card collectors. Authentic trading cards, graded rookies, limited editions, and archival wall posters.',
    instagramUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    activePromoCode: 'FIRST5',
    activePromoDiscountType: 'percentage',
    activePromoDiscountValue: 5,
    shippingRate: 49
  });
  const [categories, setCategories] = useState<CategoryConfigItem[]>(DEFAULT_CATEGORIES);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recentlyAddedIds, setRecentlyAddedIds] = useState<Set<string>>(new Set());
  const [session, setSession] = useState<Session | null>(null);

  // Supabase Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_IN') {
        setToastMessage(`Welcome back, ${session?.user?.user_metadata?.full_name?.split(' ')[0] || 'Collector'}!`);
        setTimeout(() => setToastMessage(null), 2500);
      } else if (event === 'SIGNED_OUT') {
        setToastMessage('You have been securely signed out.');
        setTimeout(() => setToastMessage(null), 2500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch initial data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, ordersRes, configRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/config'),
          fetch('/api/categories')
        ]);
        
        if (prodRes.ok) {
          const data = await prodRes.json();
          if (data && data.length > 0) setProducts(data);
        }
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          if (data && data.length > 0) setOrders(data);
        }
        if (configRes.ok) {
          const data = await configRes.json();
          if (data && data.heroBannerUrl) setBannerConfig(data);
        }
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          if (data && data.length > 0) setCategories(data);
        }
      } catch (err) {
        console.error('Failed to fetch store data', err);
      }
    };
    fetchData();
  }, []);
  // Listen to scroll for mobile & desktop back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show brief toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    setRecentlyAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setRecentlyAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);

    triggerToast(`Added "${product.name}" to your cart`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    const item = cartItems.find(i => i.product.id === productId);
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    if (item) triggerToast(`Removed "${item.product.name}" from cart`);
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = async (newOrder?: Order): Promise<boolean> => {
    if (newOrder) {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...newOrder,
            user_id: session?.user?.id || undefined
          })
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.error || 'Failed to save order to database');
        }
        
        const savedOrder = await res.json();
        setOrders((prev) => [savedOrder, ...prev]);
        setCartItems([]); // Only clear cart if successful
        
        // Update local product stock without needing a full refresh
        setProducts(prevProducts => prevProducts.map(p => {
          const orderedItem = newOrder.items.find(i => i.id === p.id);
          if (orderedItem) {
            return { ...p, stock: Math.max(0, p.stock - orderedItem.quantity) };
          }
          return p;
        }));
        
        triggerToast('Order placed successfully! Check your email for confirmation.');
        return true;

      } catch (e: any) {
        console.error('Error saving order', e);
        triggerToast(`Order failed: ${e.message}`);
        // Do NOT clear cart or add to local state if order failed!
        return false;
      }
    } else {
      // If called without newOrder (e.g. manual clear), just clear cart
      setCartItems([]);
      return true;
    }
  };

  // Admin Management Handlers
  const handleAddProduct = async (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    triggerToast(`Product "${newProduct.name}" added to catalog!`);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(newProduct)
      });
    } catch (e) { console.error(e); }
  };

  const handleUpdateProduct = async (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    triggerToast(`Product "${updated.name}" updated!`);
    try {
      await fetch(`/api/products/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(updated)
      });
    } catch (e) { console.error(e); }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    triggerToast('Product deleted from catalog.');
    try {
      await fetch(`/api/products/${productId}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
    } catch (e) { console.error(e); }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: Order['status'],
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber,
            }
          : o
      )
    );
    triggerToast(`Order ${orderId} updated to ${newStatus.toUpperCase()}`);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ status: newStatus, trackingNumber })
      });
    } catch (e) { console.error(e); }
  };

  const handleUpdateBannerConfig = async (newConfig: StoreBannerConfig) => {
    setBannerConfig(newConfig);
    triggerToast('Store banners & settings updated!');
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(newConfig)
      });
    } catch (e) { console.error(e); }
  };

  const handleUpdateCategories = async (newCategories: CategoryConfigItem[]) => {
    setCategories(newCategories);
    triggerToast('Categories updated successfully!');
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify(newCategories)
      });
    } catch (e) { console.error(e); }
  };

  const handleResetData = () => {
    triggerToast('Reset is disabled. Data is loaded from the database.');
  };

  // Categorized products for homepage sections (live from products state)
  const posterProducts = products.filter((p) => p.category === 'posters');
  const stickerProducts = products.filter((p) => p.category === 'stickers');

  const handleShopMatchAttax = () => {
    setCatalogFilter('packs');
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (cat: string) => {
    if (cat === 'posters') {
      const el = document.getElementById('football-posters');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    } else if (cat === 'stickers') {
      const el = document.getElementById('football-stickers');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Default: switch to catalog with filter
    setCatalogFilter(cat);
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopAllPosters = () => {
    setCatalogFilter('posters');
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopAllStickers = () => {
    setCatalogFilter('stickers');
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenContact = () => {
    const phoneNumber = bannerConfig?.supportPhone?.replace(/\D/g, '') || '919876543210';
    window.open(`https://wa.me/${phoneNumber}?text=Hi%2C%20I%20need%20help%20with%20my%20order`, '_blank');
  };

  const handleNavigateSection = (category: string) => {
    if (category === 'all') {
      setCatalogFilter('all');
    } else {
      setCatalogFilter(category);
    }
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // RENDER ADMIN DASHBOARD IF IN ADMIN MODE
  if (viewMode === 'admin') {
    if (!adminToken) {
      return (
        <AdminLogin 
          onLoginSuccess={(token) => {
            localStorage.setItem('footenixAdminToken', token);
            setAdminToken(token);
          }} 
        />
      );
    }

    return (
      <>
        {toastMessage && (
          <div className="fixed top-4 right-4 z-[9999] bg-[#171923] text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 text-sm animate-fade-in border border-neutral-700 max-w-md">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        )}
        <AdminDashboard
          products={products}
          orders={orders}
          bannerConfig={bannerConfig}
          categories={categories}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateBannerConfig={handleUpdateBannerConfig}
          onUpdateCategories={handleUpdateCategories}
          onResetData={handleResetData}
          onExitAdmin={() => {
            setViewMode('store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#212121]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-18 md:bottom-6 right-3 sm:right-6 z-50 bg-[#171923] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg shadow-2xl flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm animate-fade-in border border-neutral-700 max-w-[90vw] sm:max-w-md">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-auto text-cyan-300 hover:text-white underline font-semibold shrink-0 cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Floating Back to Top Button on Mobile & Desktop */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-18 md:bottom-6 right-3 sm:right-6 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#171923]/95 text-white shadow-xl border border-neutral-700 flex items-center justify-center hover:bg-[#245bff] active:scale-90 transition-all cursor-pointer backdrop-blur-xs"
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>
      )}

      {/* Main Top Navigation */}
      <Navbar
        session={session}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenContact={handleOpenContact}
        onOpenAccount={() => {
          setActiveTab('account');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        config={bannerConfig}
        activeTab={activeTab}
        onNavigate={(tab) => {
          if (tab === 'contact') {
            handleOpenContact();
          } else {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Body Content */}
      <main className="flex-1 pb-16 md:pb-0">
        {activeTab === 'home' ? (
          <>
            {/* 1. Electric Hero Banner with Match Attax theme & promo ticker */}
            <HeroBanner
              imageUrl={bannerConfig.heroBannerUrl}
              onShopMatchAttax={handleShopMatchAttax}
            />

            {/* 2. DEDICATED SHOP BY CATEGORY SECTION (right below the theme hero) */}
            <ShopByCategory
              categories={categories}
              onSelectCategory={handleCategorySelect}
              activeCategory={catalogFilter}
            />

            {/* Optional Panini Collections Banner (Only shown if toggled ON in Admin) */}
            {bannerConfig.showPaniniBanner && bannerConfig.paniniBannerUrl && (
              <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div
                  onClick={() => {
                    setCatalogFilter('cards');
                    setActiveTab('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full rounded-xl overflow-hidden border border-neutral-200 shadow-md cursor-pointer aspect-[16/6] bg-neutral-900 group"
                >
                  <img
                    src={bannerConfig.paniniBannerUrl}
                    alt="Panini Collections Banner"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
              </section>
            )}

            {/* Optional Topps 24/25 Banner (Only shown if toggled ON in Admin) */}
            {bannerConfig.showStickersBanner && bannerConfig.stickersBannerUrl && (
              <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div
                  onClick={handleShopAllStickers}
                  className="w-full rounded-xl overflow-hidden border border-neutral-200 shadow-md cursor-pointer aspect-[16/5] bg-neutral-900 group"
                >
                  <img
                    src={bannerConfig.stickersBannerUrl}
                    alt="Stickers Collection Banner"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
              </section>
            )}

            {/* 3. "FOOTBALL POSTERS" Section with SHOP ALL button */}
            <ProductSection
              id="football-posters"
              title="FOOTBALL POSTERS"
              products={posterProducts}
              onShopAll={handleShopAllPosters}
              onQuickView={(p) => setSelectedProduct(p)}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              addedIds={recentlyAddedIds}
            />

            {/* Optional Posters Banner (Only shown if toggled ON in Admin) */}
            {bannerConfig.showPostersBanner && bannerConfig.postersBannerUrl && (
              <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div
                  onClick={handleShopAllPosters}
                  className="w-full rounded-xl overflow-hidden border border-neutral-200 shadow-md cursor-pointer aspect-[16/5] bg-neutral-900 group"
                >
                  <img
                    src={bannerConfig.postersBannerUrl}
                    alt="Posters Collection Banner"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
              </section>
            )}

            {/* 4. "FOOTBALL & ANIME STICKERS" Section with SHOP ALL button */}
            <ProductSection
              id="football-stickers"
              title="FOOTBALL & ANIME STICKERS"
              products={stickerProducts}
              onShopAll={handleShopAllStickers}
              onQuickView={(p) => setSelectedProduct(p)}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              addedIds={recentlyAddedIds}
            />
          </>
        ) : activeTab === 'account' ? (
          <UserDashboard session={session} />
        ) : activeTab === 'legal' ? (
          <LegalPages 
            initialTab={legalTab} 
            onBack={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        ) : (
          /* Full Catalog View */
          <CatalogView
            products={products}
            initialCategory={catalogFilter}
            onQuickView={(p) => setSelectedProduct(p)}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            addedIds={recentlyAddedIds}
          />
        )}
      </main>

      {/* Comprehensive Footer with Terracotta Newsletter & Admin Link */}
      <Footer
        config={bannerConfig}
        onNavigateSection={handleNavigateSection}
        onOpenContact={handleOpenContact}
        onOpenAdmin={() => {
          setViewMode('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateLegal={(tab) => {
          setLegalTab(tab as any);
          setActiveTab('legal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        config={bannerConfig}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Product Quick View & Purchase Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, q) => handleAddToCart(p, q)}
        onBuyNow={(p, q) => handleBuyNow(p, q)}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        products={products}
      />

      {/* Order Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        config={bannerConfig}
        onOrderComplete={handleOrderComplete}
        session={session}
      />

      {/* Collector Contact & Support Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* App-like Mobile Bottom Navigation Bar (Nike / ASOS / Amazon standard) */}
      <MobileBottomNav
        session={session}
        activeTab={activeTab}
        cartCount={totalCartCount}
        onNavigateHome={() => {
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateCatalog={() => {
          setActiveTab('catalog');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenContact={handleOpenContact}
        onOpenAccount={() => {
          setActiveTab('account');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

