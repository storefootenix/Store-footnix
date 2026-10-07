import React, { useState } from 'react';
import { StoreBannerConfig } from '../../data/storeConfig';
import { Product } from '../../data/products';
import { Order } from '../../data/orders';
import { Save, Check, Download, RotateCcw, ShieldCheck, Truck, Banknote, Mail, Phone, Store } from 'lucide-react';

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
  
  const defaultKeys = { 
    razorpay_key_id: '', 
    razorpay_key_secret: '', 
    delhivery_api_key: '', 
    gmail_user: '', 
    gmail_app_password: '' 
  };
  const [apiKeys, setApiKeys] = useState(defaultKeys);
  const defaultCreds = { username: '', password: '' };
  const [creds, setCreds] = useState(defaultCreds);
  const [initialCreds, setInitialCreds] = useState(defaultCreds);
  const [credsSaved, setCredsSaved] = useState(false);
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [initialApiKeys, setInitialApiKeys] = useState(defaultKeys);
  const [keysSaved, setKeysSaved] = useState(false);
  const [isSavingKeys, setIsSavingKeys] = useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('footenixAdminToken');
    if (token) {
      fetch('/api/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(data => {
        if (!data.error && data) {
          const fetchedKeys = {
            razorpay_key_id: data.razorpay_key_id || '',
            razorpay_key_secret: data.razorpay_key_secret || '',
            delhivery_api_key: data.delhivery_api_key || '',
            gmail_user: data.gmail_user || '',
            gmail_app_password: data.gmail_app_password || ''
          };
          setApiKeys(fetchedKeys);
          setInitialApiKeys(fetchedKeys);
        }
      });
    }
  }, []);

  const handleSaveCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCreds(true);
    const token = localStorage.getItem('footenixAdminToken');
    if (token) {
      try {
        const res = await fetch('/api/admin/credentials', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(creds)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert('Failed to save credentials: ' + (err.error || 'Server error'));
          setIsSavingCreds(false);
          return;
        }
        setInitialCreds({...creds});
        setCredsSaved(true);
        alert('✅ SUCCESS: Admin Credentials updated!');
        setTimeout(() => setCredsSaved(false), 3000);
      } catch (err) {
        alert('Network error while saving credentials.');
      } finally {
        setIsSavingCreds(false);
      }
    } else {
      setIsSavingCreds(false);
    }
  };

  const handleSaveApiKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('footenixAdminToken');
    if (token) {
      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(apiKeys)
        });
        if (!res.ok) {
          const err = await res.json();
          alert('Failed to save keys: ' + (err.error || 'Server error'));
          return;
        }
        
        setInitialApiKeys({...apiKeys});
        setKeysSaved(true);
        alert('✅ SUCCESS: API Keys have been securely saved to the database!');
        setTimeout(() => setKeysSaved(false), 3000);
      } catch (err) {
        alert('Network error while saving keys.');
      }
    }
  };

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
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Standard Delivery Rate (Rs.)
              </label>
              <input
                type="number"
                min="0"
                value={formData.shippingRate ?? 49}
                onChange={(e) =>
                  setFormData({ ...formData, shippingRate: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Default flat delivery fee applied to orders below the free delivery minimum.
              </p>
            </div>
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

        {/* Promo Codes & Coupons */}
        <div className="p-5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#171923]">
            <Banknote className="w-4 h-4 text-[#245bff]" />
            <span>Promo Codes &amp; Coupons</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Active Promo Code
              </label>
              <input
                type="text"
                value={formData.activePromoCode || ''}
                onChange={(e) => setFormData({ ...formData, activePromoCode: e.target.value.toUpperCase() })}
                placeholder="e.g. FIRST5"
                className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none uppercase"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Discount Type
              </label>
              <select
                value={formData.activePromoDiscountType || 'percentage'}
                onChange={(e) => setFormData({ ...formData, activePromoDiscountType: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs.)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Discount Value
              </label>
              <input
                type="number"
                min="0"
                value={formData.activePromoDiscountValue || 0}
                onChange={(e) => setFormData({ ...formData, activePromoDiscountValue: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
              />
            </div>
          </div>
          <p className="text-[11px] text-neutral-400">
            Leave the Promo Code blank to disable coupons. The discount will be applied during checkout.
          </p>
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

        {/* Branding & Social Links */}
        <div className="p-5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#171923]">
            <Store className="w-4 h-4 text-[#245bff]" />
            <span>Store Branding &amp; Socials</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={formData.storeName || ''}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                Store Description (Footer)
              </label>
              <textarea
                value={formData.storeDescription || ''}
                onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none h-20"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl || ''}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Twitter URL
                </label>
                <input
                  type="url"
                  value={formData.twitterUrl || ''}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={formData.facebookUrl || ''}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
                  placeholder="https://facebook.com/..."
                />
              </div>
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

      {/* Secret API Keys (Database) */}
      <form onSubmit={handleSaveApiKeys} className="p-5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#171923]">
          <ShieldCheck className="w-4 h-4 text-[#245bff]" />
          <span>API Integrations & Keys</span>
        </div>
        
        <p className="text-[11px] text-neutral-500">
          These keys are stored securely in the database and applied instantly without needing to redeploy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Razorpay Key ID</label>
            <input type="text" value={apiKeys.razorpay_key_id} onChange={e => setApiKeys({...apiKeys, razorpay_key_id: e.target.value})} className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none" placeholder="rzp_test_..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Razorpay Key Secret</label>
            <input type="password" value={apiKeys.razorpay_key_secret} onChange={e => setApiKeys({...apiKeys, razorpay_key_secret: e.target.value})} className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none" placeholder="••••••••••••••••" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Delhivery API Token</label>
            <input type="password" value={apiKeys.delhivery_api_key} onChange={e => setApiKeys({...apiKeys, delhivery_api_key: e.target.value})} className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none" placeholder="••••••••••••••••" />
            <p className="text-[10px] text-neutral-400 mt-1">Delhivery will generate mock tracking numbers if this is blank.</p>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          {keysSaved ? (
            <div className="text-emerald-600 text-xs font-bold flex items-center gap-1.5"><Check className="w-4 h-4"/> Saved</div>
          ) : <div/>}
          <button 
            type="submit" 
            disabled={JSON.stringify(apiKeys) === JSON.stringify(initialApiKeys) || isSavingKeys}
            className={`px-6 py-2 font-semibold rounded text-xs shadow-xs flex items-center gap-2 transition-colors ${
              JSON.stringify(apiKeys) === JSON.stringify(initialApiKeys) 
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
                : 'bg-neutral-800 hover:bg-black text-white cursor-pointer'
            }`}
          >
            {isSavingKeys ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSavingKeys ? "Saving..." : "Save API Keys"}</span>
          </button>
        </div>
      </form>
      {/* Client Admin Credentials (Database) */}
      <form onSubmit={handleSaveCreds} className="p-5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#171923]">
          <ShieldCheck className="w-4 h-4 text-[#245bff]" />
          <span>Admin Login Credentials</span>
        </div>
        
        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Username</label>
            <input type="text" value={creds.username} onChange={e => setCreds({...creds, username: e.target.value})} className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none" placeholder="admin" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">New Password</label>
            <input type="password" value={creds.password} onChange={e => setCreds({...creds, password: e.target.value})} className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none" placeholder="••••••••••••••••" />
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          {credsSaved ? (
            <div className="text-emerald-600 text-xs font-bold flex items-center gap-1.5"><Check className="w-4 h-4"/> Saved</div>
          ) : <div/>}
          <button 
            type="submit" 
            disabled={JSON.stringify(creds) === JSON.stringify(initialCreds) || isSavingCreds}
            className={`px-6 py-2 font-semibold rounded text-xs shadow-xs flex items-center gap-2 transition-colors ${
              JSON.stringify(creds) === JSON.stringify(initialCreds) 
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
                : 'bg-neutral-800 hover:bg-black text-white cursor-pointer'
            }`}
          >
            {isSavingCreds ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSavingCreds ? "Saving..." : "Update Login"}</span>
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
