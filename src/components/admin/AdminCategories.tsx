import React, { useState } from 'react';
import { Product } from '../../data/products';
import { Layers, Package, Sparkles, Image as ImageIcon, Sticker, Edit2, Save, Check } from 'lucide-react';
import { CategoryConfigItem } from '../../data/storeConfig';

interface AdminCategoriesProps {
  products: Product[];
  categories: CategoryConfigItem[];
  onUpdateCategories: (newCategories: CategoryConfigItem[]) => void;
  onNavigateToCategoryProducts: (cat: string) => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  products,
  categories,
  onUpdateCategories,
  onNavigateToCategoryProducts,
}) => {

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<CategoryConfigItem | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStartEdit = (cat: CategoryConfigItem) => {
    setEditingId(cat.id);
    setEditFormData({ ...cat });
  };

  const handleSaveEdit = () => {
    if (editFormData) {
      const newCategories = categories.map((c) => (c.id === editFormData.id ? editFormData : c));
      onUpdateCategories(newCategories);
      setEditingId(null);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-store font-semibold text-[#171923]">
            Category Settings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Manage the active categories shown in the "Shop by Category" storefront section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4" />
              <span>Categories updated!</span>
            </div>
          )}
          <button
            onClick={() => {
              const id = prompt('Enter a short unique ID for the new category (e.g., "jerseys"):');
              if (id) {
                if (categories.find(c => c.id === id)) return alert('Category ID already exists!');
                const newCat = {
                  id,
                  name: 'New Category',
                  subtitle: 'Short description',
                  badge: 'NEW',
                  badgeColor: 'bg-neutral-600 text-white',
                  thumbUrl: ''
                };
                onUpdateCategories([...categories, newCat]);
                handleStartEdit(newCat);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#245bff] hover:bg-[#1a47d6] text-white rounded text-xs font-semibold transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Grid of the 5 Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {categories.map((cat) => {
          const itemCount = products.filter((p) => p.category === cat.id).length;
          const isEditing = editingId === cat.id && editFormData;

          return (
            <div
              key={cat.id}
              className="p-5 bg-white rounded-lg border border-neutral-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-neutral-50 border border-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
                      <img
                        src={cat.thumbUrl}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900 text-base">{cat.name}</h3>
                        <span className="font-mono text-[10px] text-neutral-400">ID: {cat.id}</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{cat.subtitle}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {cat.badge}
                  </span>
                </div>

                {/* Edit Form if active */}
                {isEditing ? (
                  <div className="p-3 bg-neutral-50 rounded border border-neutral-200 space-y-3 mb-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-0.5">
                        Category Display Name
                      </label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-neutral-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-0.5">
                        Subtitle Tagline
                      </label>
                      <input
                        type="text"
                        value={editFormData.subtitle}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, subtitle: e.target.value })
                        }
                        className="w-full px-2 py-1 bg-white border border-neutral-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-0.5">
                        Badge Text
                      </label>
                      <input
                        type="text"
                        value={editFormData.badge}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, badge: e.target.value })
                        }
                        className="w-full px-2 py-1 bg-white border border-neutral-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-0.5">
                        Thumbnail Image (URL or Upload)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={editFormData.thumbUrl}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, thumbUrl: e.target.value })
                          }
                          className="flex-1 px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-mono"
                        />
                        <label className="px-3 py-1 bg-neutral-100 border border-neutral-300 rounded text-xs text-neutral-700 cursor-pointer hover:bg-neutral-200 whitespace-nowrap flex items-center justify-center">
                          Upload
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const uploadFormData = new FormData();
                              uploadFormData.append('file', file);
                              const token = localStorage.getItem('footenixAdminToken');
                              try {
                                const res = await fetch('/api/upload', {
                                  method: 'POST',
                                  headers: { 'Authorization': `Bearer ${token}` },
                                  body: uploadFormData
                                });
                                const data = await res.json();
                                if (data.success) {
                                  setEditFormData({ ...editFormData, thumbUrl: data.url });
                                } else {
                                  alert('Upload failed: ' + data.error);
                                }
                              } catch (err) {
                                alert('Upload error');
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 text-xs border border-neutral-300 rounded text-neutral-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 text-xs bg-[#245bff] text-white rounded font-semibold"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="font-mono text-neutral-500 font-semibold">
                  {itemCount} Active Products
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToCategoryProducts(cat.id)}
                    className="text-[#245bff] hover:underline font-semibold"
                  >
                    View Products →
                  </button>
                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="p-1 text-neutral-400 hover:text-black rounded"
                      title="Edit Category details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
