import React, { useState } from 'react';
import { Product } from '../../data/products';
import { Order } from '../../data/orders';
import { StoreBannerConfig, CategoryConfigItem } from '../../data/storeConfig';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminBanners } from './AdminBanners';
import { AdminCategories } from './AdminCategories';
import { AdminSettings } from './AdminSettings';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Image as ImageIcon,
  Layers,
  Settings,
  ArrowLeft,
  Store,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  ShieldCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  bannerConfig: StoreBannerConfig;
  categories: CategoryConfigItem[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updated: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status'], trackingNumber?: string) => void;
  onUpdateBannerConfig: (newConfig: StoreBannerConfig) => void;
  onUpdateCategories: (newCategories: CategoryConfigItem[]) => void;
  onResetData: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  bannerConfig,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateBannerConfig,
  onUpdateCategories,
  onResetData,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'banners' | 'categories' | 'settings'
  >('overview');

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;

  const navItems = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'products' as const, label: 'Products', icon: Package, badge: `${products.length}` },
    {
      id: 'orders' as const,
      label: 'Orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    { id: 'banners' as const, label: 'Banners & Hero', icon: ImageIcon },
    { id: 'categories' as const, label: '4 Categories', icon: Layers },
    { id: 'settings' as const, label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex text-[#171923]">
      {/* MOBILE BACKDROP */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#171923] text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-store text-xl font-bold tracking-tight text-white">
                  Footenix Store
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold uppercase">
                  Admin
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Store Live &amp; Accepting Orders</span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1 text-neutral-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Exit to Storefront */}
          <div className="p-3">
            <button
              onClick={onExitAdmin}
              className="w-full px-3 py-2 bg-neutral-800/80 hover:bg-neutral-800 text-cyan-300 hover:text-white rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-neutral-700/60"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Customer Store</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#245bff] text-white font-semibold shadow-xs'
                      : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        item.badgeColor || 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-neutral-800 text-xs text-neutral-400 flex items-center justify-between">
          <div>
            <div className="text-white font-semibold text-[11px]">Administrator</div>
            <div className="text-[10px] text-neutral-500 font-mono">Footenix Superuser</div>
          </div>

          <div className="w-7 h-7 rounded-full bg-[#245bff] text-white font-bold flex items-center justify-center text-xs">
            FX
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full min-w-0">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-neutral-600 hover:text-black lg:hidden rounded"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
              <span className="hidden sm:inline">Footenix Admin</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-[#171923] font-semibold capitalize font-mono text-[11px] uppercase">
                {activeTab}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('products');
                setIsAddProductModalOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#245bff] hover:bg-[#1a47d6] text-white rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="px-3 py-1.5 text-xs font-semibold rounded border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Return to customer store view"
            >
              <Store className="w-3.5 h-3.5 text-neutral-500" />
              <span>View Storefront</span>
            </button>
          </div>
        </header>

        {/* BODY TABS CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'overview' && (
            <AdminOverview
              products={products}
              orders={orders}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAddProduct={() => {
                setActiveTab('products');
                setIsAddProductModalOpen(true);
              }}
              onSelectOrder={(order) => {
                setSelectedOrderForDetail(order);
                setActiveTab('orders');
              }}
            />
          )}

          {activeTab === 'products' && (
            <AdminProducts
              products={products}
              onAddProduct={onAddProduct}
              onUpdateProduct={onUpdateProduct}
              onDeleteProduct={onDeleteProduct}
              isAddModalOpen={isAddProductModalOpen}
              onCloseAddModal={() => setIsAddProductModalOpen(false)}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders
              orders={orders}
              onUpdateOrderStatus={onUpdateOrderStatus}
              selectedOrder={selectedOrderForDetail}
              onClearSelectedOrder={() => setSelectedOrderForDetail(null)}
            />
          )}

          {activeTab === 'banners' && (
            <AdminBanners
              config={bannerConfig}
              onUpdateConfig={onUpdateBannerConfig}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategories
              products={products}
              categories={categories}
              onUpdateCategories={onUpdateCategories}
              onNavigateToCategoryProducts={(cat) => {
                setActiveTab('products');
              }}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettings
              config={bannerConfig}
              onUpdateConfig={onUpdateBannerConfig}
              products={products}
              orders={orders}
              onResetData={onResetData}
            />
          )}
        </main>
      </div>
    </div>
  );
};
