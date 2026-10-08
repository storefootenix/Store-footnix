import React from 'react';
import { Product } from '../../data/products';
import { Order } from '../../data/orders';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Truck,
  Plus,
} from 'lucide-react';

interface AdminOverviewProps {
  products: Product[];
  orders: Order[];
  categories: any[];
  onNavigateTab: (tab: 'products' | 'orders' | 'banners' | 'categories' | 'settings') => void;
  onOpenAddProduct: () => void;
  onSelectOrder: (order: Order) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  products,
  orders,
  categories,
  onNavigateTab,
  onOpenAddProduct,
  onSelectOrder,
}) => {
  // Compute analytics
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  // Breakdown by category
  const categoryCounts = {
    packs: products.filter((p) => p.category === 'packs').length,
    cards: products.filter((p) => p.category === 'cards').length,
    panini: products.filter((p) => p.category === 'panini').length,
    stickers: products.filter((p) => p.category === 'stickers').length,
    posters: products.filter((p) => p.category === 'posters').length,
  };

  // Recent 5 orders
  const recentOrders = [...orders].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-store font-semibold text-[#171923]">
            Store Overview
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Real-time sales, order fulfillment, and collectible inventory across Footenix Store.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center w-full sm:w-auto gap-2.5">
          <button
            onClick={() => onNavigateTab('orders')}
            className="flex-1 sm:flex-none justify-center px-3.5 py-2 text-xs font-semibold rounded border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Fulfill Orders ({pendingOrders.length})
          </button>
          <button
            onClick={onOpenAddProduct}
            className="flex-1 sm:flex-none justify-center px-4 py-2 text-xs font-semibold rounded bg-[#245bff] hover:bg-[#1a47d6] text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-4 sm:p-5 rounded-lg bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#171923] font-mono tracking-tight">
              Rs. {totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% this week</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-4 sm:p-5 rounded-lg bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#245bff] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#171923] font-mono tracking-tight">
              {orders.length}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-500">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{pendingOrders.length} pending shipment</span>
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="p-4 sm:p-5 rounded-lg bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Avg Order Value</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#171923] font-mono tracking-tight">
              Rs. {averageOrderValue.toLocaleString('en-IN')}
            </div>
            <div className="mt-2 text-xs text-neutral-500">
              Free delivery on orders over Rs. 499
            </div>
          </div>
        </div>

        {/* Active Catalog Items */}
        <div className="p-4 sm:p-5 rounded-lg bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Products</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-semibold text-[#171923] font-mono tracking-tight">
              {products.length}
            </div>
            <div className="mt-2 text-xs text-neutral-500 flex items-center gap-2">
              <span>Across {categories.length} categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Quick Stock Glance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Category Distribution */}
        <div className="lg:col-span-2 p-5 rounded-lg bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#171923]">
                Inventory by Category
              </h3>
              <p className="text-xs text-neutral-500">Products live on the storefront</p>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-[#245bff] hover:underline font-semibold"
            >
              Manage Catalog →
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map(cat => {
              const count = products.filter(p => p.category === cat.id).length;
              return (
                <div key={cat.id} className="p-3 rounded-md bg-neutral-50 border border-neutral-200/80 w-[45%] sm:w-36 grow shrink-0">
                  <span className="text-[11px] font-mono uppercase text-neutral-500 block">{cat.name}</span>
                  <span className="text-xl font-semibold text-[#171923] mt-1 block">
                    {count} Items
                  </span>
                  <span className="text-[10px] text-neutral-600 font-medium truncate block max-w-full">{cat.badge}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Fulfillment Status summary */}
        <div className="p-5 rounded-lg bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#171923] mb-1">
              Fulfillment Status
            </h3>
            <p className="text-xs text-neutral-500 mb-4">Current order workflow</p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="flex items-center gap-2 text-neutral-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Pending Review
                </span>
                <span className="font-mono font-semibold">
                  {orders.filter((o) => o.status === 'pending').length}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="flex items-center gap-2 text-neutral-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Processing / Packing
                </span>
                <span className="font-mono font-semibold">
                  {orders.filter((o) => o.status === 'processing').length}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="flex items-center gap-2 text-neutral-700">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Shipped (In Transit)
                </span>
                <span className="font-mono font-semibold">
                  {orders.filter((o) => o.status === 'shipped').length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-neutral-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Delivered Safely
                </span>
                <span className="font-mono font-semibold">{deliveredOrders.length}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="w-full mt-4 py-2 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-center cursor-pointer"
          >
            Open Orders Hub
          </button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-5 rounded-lg bg-white border border-neutral-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#171923]">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-neutral-500">Live order activity from the store</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-[#245bff] hover:underline font-semibold"
          >
            View all {orders.length} orders →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recentOrders.map((order) => {
                const statusStyles = {
                  pending: 'bg-amber-50 text-amber-700 border-amber-200',
                  processing: 'bg-blue-50 text-blue-700 border-blue-200',
                  shipped: 'bg-purple-50 text-purple-700 border-purple-200',
                  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
                }[order.status];

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-neutral-50/80 transition-colors cursor-pointer"
                    onClick={() => onSelectOrder(order)}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-[#171923]">{order.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-neutral-800">{order.customerName}</div>
                      <div className="text-[11px] text-neutral-400">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3 text-neutral-600">{order.city}</td>
                    <td className="py-3 px-3 text-neutral-600">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} items
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-neutral-900">
                      Rs. {order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 uppercase text-[10px] font-mono text-neutral-500">
                      {order.paymentMethod}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${statusStyles}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order);
                        }}
                        className="text-xs text-[#245bff] hover:underline font-semibold"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
