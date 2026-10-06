import React, { useState } from 'react';
import { StoreBannerConfig } from '../../data/storeConfig';
import { Product } from '../../data/products';
import { Order } from '../../data/orders';
import { Save, Check, Download, RotateCcw, ShieldCheck, Truck, Banknote, Mail, Phone } from 'lucide-react';

interface AdminSettingsProps {
  config: StoreBannerConfig;
  onUpdateConfig: (newConfig: StoreBannerConfig) => void;
  products: Product[];
  orders: Order[];
  onResetData: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  config,
  onUpdateConfig,
  products,
  orders,
  onResetData,
}) => {
  const [formData, setFormData] = useState<StoreBannerConfig>(config);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      store: 'Footenix Store',
      exportDate: new Date().toISOString(),
      config: formData,
      productsCount: products.length,
      ordersCount: orders.length,
      products,
      orders,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `footenix-store-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-store font-semibold text-[#171923]">
            Store Policies &amp; Settings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Configure delivery charges, promotional spend thresholds, and contact channels.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping & Delivery Rules */}
        <div className="p-5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#171923]">
            <Truck className="w-4 h-4 text-[#245bff]" />
            <span>Shipping &amp; Delivery Thresholds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Free Delivery Minimum Order (Rs.)
              </label>
              <input
                type="number"
                min="0"
                value={formData.freeShippingThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Orders under this amount are charged Rs. 49 flat delivery fee.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Free Chrome X Topps Promotion Threshold (Rs.)
              </label>
              <input
                type="number"
                min="0"
                value={formData.freeGiftThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, freeGiftThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Currently promoted in the top bar: "SHOP FOR 2500 GET 1 CHROME X TOPPS FREE".
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-800 block">
                Enable Cash on Delivery (COD)
              </span>
              <span className="text-[11px] text-neutral-400">
                Allow customers across India to pay upon packet arrival.
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.codEnabled}
              onChange={(e) => setFormData({ ...formData, codEnabled: e.target.checked })}
              className="w-4 h-4 text-[#245bff] rounded border-neutral-300 cursor-pointer"
            />
          </div>
        </div>

        {/* Contact & Support */}
        <div className="p-5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#171923]">
            <Phone className="w-4 h-4 text-[#245bff]" />
            <span>Store Support Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Support WhatsApp / Phone
              </label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="p-4 bg-white rounded-lg border border-neutral-200 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#245bff] hover:bg-[#1a47d6] text-white font-semibold rounded text-xs shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>

      {/* Data Backup & Reset */}
      <div className="p-5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#171923]">
          Data Backup &amp; Diagnostics
        </h3>
        <p className="text-xs text-neutral-500">
          Export full store database ({products.length} products, {orders.length} orders) as a JSON backup.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Database JSON</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all catalog and orders to default demo data?')) {
                onResetData();
              }
            }}
            className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Store State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
