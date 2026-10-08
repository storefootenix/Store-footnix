import React, { useState } from 'react';
import { StoreBannerConfig } from '../../data/storeConfig';
import { Image as ImageIcon, Save, Check, RefreshCw, Eye, Sparkles } from 'lucide-react';

interface AdminBannersProps {
  config: StoreBannerConfig;
  onUpdateConfig: (newConfig: StoreBannerConfig) => void;
}

export const AdminBanners: React.FC<AdminBannersProps> = ({ config, onUpdateConfig }) => {
  const [formData, setFormData] = useState<StoreBannerConfig>(config);
  const [savedToast, setSavedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-store font-semibold text-[#171923]">
            Banners &amp; Visual Showcase
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Manage your store hero arena banner, announcement ticker, and upload banners for Panini, Stickers, and Posters.
          </p>
        </div>

        {savedToast && (
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Store Banners Updated!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. TOP ANNOUNCEMENT BAR */}
        <div className="p-5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#171923]">
              1. Top Header Announcement Bar
            </h3>
            <span className="text-[10px] font-mono text-neutral-400">Fixed Top Ticker</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Announcement Text
            </label>
            <input
              type="text"
              value={formData.announcementText}
              onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded font-semibold focus:border-[#245bff] focus:outline-none"
              placeholder="e.g. SHOP FOR 2500 GET 1 CHROME X TOPPS FREE"
            />
          </div>

          {/* Live Preview */}
          <div className="mt-2">
            <span className="text-[10px] font-mono text-neutral-400 block mb-1">Live Preview:</span>
            <div className="w-full bg-[#101d3e] text-white py-2 px-4 text-center rounded text-xs font-semibold tracking-wider uppercase">
              {formData.announcementText || 'ANNOUNCEMENT BAR PREVIEW'}
            </div>
          </div>
        </div>

        {/* 2. HERO MATCH ATTAX ARENA BANNER */}
        <div className="p-5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#171923]">
                2. Main Store Opening Hero Banner (Match Attax Theme)
              </h3>
              <p className="text-xs text-neutral-500">
                The primary full-width theme banner displayed when visitors arrive at Footenix Store.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
              ACTIVE
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Hero Banner Image URL
            </label>
            <input
              type="url"
              value={formData.heroBannerUrl}
              onChange={(e) => setFormData({ ...formData, heroBannerUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded font-mono focus:border-[#245bff] focus:outline-none"
              placeholder="https://footenix-store-2.myshopify.com/cdn/shop/files/crop-safer-match-attax-banner.png..."
            />
          </div>

          {/* Live Preview Box */}
          {formData.heroBannerUrl && (
            <div className="rounded-lg overflow-hidden border border-neutral-200 bg-neutral-900 aspect-[16/6] relative">
              <img
                src={formData.heroBannerUrl}
                alt="Hero Banner Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                Preview: Hero Arena Banner
              </div>
            </div>
          )}
        </div>

        {/* 3. PANINI COLLECTIONS BANNER ("mein rakunga panini banner") */}
        <div className="p-5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#171923]">
                3. Panini Collections Feature Banner
              </h3>
              <p className="text-xs text-neutral-500">
                You can toggle this banner ON whenever you are ready with your Panini visual.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-neutral-600 font-medium">Show Banner:</span>
              <input
                type="checkbox"
                checked={formData.showPaniniBanner}
                onChange={(e) => setFormData({ ...formData, showPaniniBanner: e.target.checked })}
                className="w-4 h-4 text-[#245bff] rounded border-neutral-300 cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Panini Banner Image URL
            </label>
            <input
              type="url"
              value={formData.paniniBannerUrl}
              onChange={(e) => setFormData({ ...formData, paniniBannerUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded font-mono focus:border-[#245bff] focus:outline-none"
              placeholder="Paste your Panini collections banner image URL here..."
            />
          </div>

          {formData.paniniBannerUrl && (
            <div className="rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 aspect-[16/6] relative">
              <img
                src={formData.paniniBannerUrl}
                alt="Panini Banner Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain bg-amber-50"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                Status: {formData.showPaniniBanner ? 'VISIBLE ON HOMEPAGE' : 'HIDDEN (Draft mode)'}
              </div>
            </div>
          )}
        </div>

        {/* 4. FOOTBALL & ANIME STICKERS BANNER */}
        <div className="p-5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#171923]">
                4. Topps 24/25 Section Banner
              </h3>
              <p className="text-xs text-neutral-500">
                Upload or paste a banner image for the Topps 24/25 Collections collection.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-neutral-600 font-medium">Show Banner:</span>
              <input
                type="checkbox"
                checked={formData.showStickersBanner}
                onChange={(e) => setFormData({ ...formData, showStickersBanner: e.target.checked })}
                className="w-4 h-4 text-[#245bff] rounded border-neutral-300 cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Topps 24/25 Banner Image URL
            </label>
            <input
              type="url"
              value={formData.stickersBannerUrl}
              onChange={(e) => setFormData({ ...formData, stickersBannerUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded font-mono focus:border-[#245bff] focus:outline-none"
              placeholder="Paste your Topps 24/25 collection banner URL here..."
            />
          </div>

          {formData.stickersBannerUrl && (
            <div className="rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 aspect-[16/6] relative">
              <img
                src={formData.stickersBannerUrl}
                alt="Topps 24/25 Banner Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                Status: {formData.showStickersBanner ? 'VISIBLE ON HOMEPAGE' : 'HIDDEN (Draft mode)'}
              </div>
            </div>
          )}
        </div>

        {/* 5. FOOTBALL POSTERS BANNER */}
        <div className="p-5 bg-white rounded-lg border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#171923]">
                5. Posters Section Banner
              </h3>
              <p className="text-xs text-neutral-500">
                Upload or paste a banner image for the Archival A5 Football Posters collection.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-neutral-600 font-medium">Show Banner:</span>
              <input
                type="checkbox"
                checked={formData.showPostersBanner}
                onChange={(e) => setFormData({ ...formData, showPostersBanner: e.target.checked })}
                className="w-4 h-4 text-[#245bff] rounded border-neutral-300 cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Posters Banner Image URL
            </label>
            <input
              type="url"
              value={formData.postersBannerUrl}
              onChange={(e) => setFormData({ ...formData, postersBannerUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded font-mono focus:border-[#245bff] focus:outline-none"
              placeholder="Paste your posters collection banner URL here..."
            />
          </div>

          {formData.postersBannerUrl && (
            <div className="rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 aspect-[16/6] relative">
              <img
                src={formData.postersBannerUrl}
                alt="Posters Banner Preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                Status: {formData.showPostersBanner ? 'VISIBLE ON HOMEPAGE' : 'HIDDEN (Draft mode)'}
              </div>
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="p-4 bg-white rounded-lg border border-neutral-200 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Changes apply in real-time across the customer storefront.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#245bff] hover:bg-[#1a47d6] text-white font-semibold rounded text-xs shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Banner Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
