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
import { Product, PRODUCTS } from './data/products';
import { Order, INITIAL_ORDERS } from './data/orders';
import { StoreBannerConfig, INITIAL_STORE_CONFIG } from './data/storeConfig';
import { Check, ArrowUp } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'contact'>('home');
  const [catalogFilter, setCatalogFilter] = useState<string>('all');
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Live Store State
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [bannerConfig, setBannerConfig] = useState<StoreBannerConfig>(INITIAL_STORE_CONFIG);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Initial sample items matching store
    { product: PRODUCTS[0], quantity: 1 }, // Glue dots
    { product: PRODUCTS[6], quantity: 2 }, // Messi sticker
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recentlyAddedIds, setRecentlyAddedIds] = useState<Set<string>>(new Set());

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
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = (newOrder?: Order) => {
    if (newOrder) {
      setOrders((prev) => [newOrder, ...prev]);
    }
    setCartItems([]);
  };

  // Admin Management Handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    triggerToast(`Product "${newProduct.name}" added to catalog!`);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    triggerToast(`Product "${updated.name}" updated!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    triggerToast('Product deleted from catalog.');
  };

  const handleUpdateOrderStatus = (
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
  };

  const handleUpdateBannerConfig = (newConfig: StoreBannerConfig) => {
    setBannerConfig(newConfig);
    triggerToast('Store banners & settings updated!');
  };

  const handleResetData = () => {
    setProducts(PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setBannerConfig(INITIAL_STORE_CONFIG);
    triggerToast('Store reset to initial demo data.');
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
    return (
      <AdminDashboard
        products={products}
        orders={orders}
        bannerConfig={bannerConfig}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateBannerConfig={handleUpdateBannerConfig}
        onResetData={handleResetData}
        onExitAdmin={() => {
          setViewMode('store');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
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
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={() => {
          setViewMode('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        announcementText={bannerConfig.announcementText}
        activeTab={activeTab}
        onNavigate={(tab) => {
          if (tab === 'contact') {
            setIsContactOpen(true);
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

            {/* Optional Stickers Banner (Only shown if toggled ON in Admin) */}
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
        onNavigateSection={handleNavigateSection}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={() => {
          setViewMode('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
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
        onOrderComplete={handleOrderComplete}
      />

      {/* Collector Contact & Support Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onOpenAdmin={() => {
          setIsContactOpen(false);
          setViewMode('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* App-like Mobile Bottom Navigation Bar (Nike / ASOS / Amazon standard) */}
      <MobileBottomNav
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
        onOpenAdmin={() => {
          setViewMode('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenContact={() => setIsContactOpen(true)}
      />
    </div>
  );
}

