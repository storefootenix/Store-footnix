import React, { useState, useMemo } from 'react';
import { Product } from '../../data/products';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Package,
  Layers,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminProductsProps {
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updated: Product) => void;
  onDeleteProduct: (productId: string) => void;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  isAddModalOpen = false,
  onCloseAddModal,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'packs' | 'cards' | 'panini' | 'stickers' | 'posters'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLocalAddOpen, setIsLocalAddOpen] = useState(false);

  // Form state for creating/editing product
  const initialFormData = {
    name: '',
    category: 'cards' as 'packs' | 'cards' | 'panini' | 'stickers' | 'posters',
    price: 199,
    originalPrice: 249,
    stock: 10,
    imageUrl: '',
    description: '',
    badge: 'New Arrival',
    dimensions: 'Standard Collector Size',
    condition: 'Mint Condition',
    finish: 'Holographic Foil',
    series: 'Footenix Official 2024/25',
    authenticity: '100% Genuine Guaranteed',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      const token = localStorage.getItem('footenixAdminToken');
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadFormData
      });
      const data = await res.json();
      
      if (data.success) {
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err: any) {
      console.error('Upload Error:', err);
      alert('Network error while uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  const showModal = isAddModalOpen || isLocalAddOpen || editingProduct !== null;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setIsLocalAddOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || Math.round(product.price * 1.25),
      stock: product.stock ?? 10,
      imageUrl: product.imageUrl || '',
      description: product.description,
      badge: product.badge || '',
      dimensions: product.specs.dimensions || 'Standard Collector Size',
      condition: product.specs.condition || 'Mint Condition',
      finish: product.specs.finish || 'Official Finish',
      series: product.specs.series || 'Footenix Release',
      authenticity: product.specs.authenticity || 'Verified Authentic',
    });
  };

  const handleCloseModal = () => {
    setIsLocalAddOpen(false);
    setEditingProduct(null);
    if (onCloseAddModal) onCloseAddModal();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProduct) {
      // Update
      const updated: Product = {
        ...editingProduct,
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stock: Number(formData.stock),
        imageUrl: formData.imageUrl,
        description: formData.description,
        badge: formData.badge || undefined,
        specs: {
          ...editingProduct.specs,
          dimensions: formData.dimensions,
          condition: formData.condition,
          finish: formData.finish,
          series: formData.series,
          authenticity: formData.authenticity,
        },
      };
      onUpdateProduct(updated);
    } else {
      // Create new product
      const newId = `${formData.category.slice(0, 3)}-${Date.now().toString().slice(-5)}`;
      const newProduct: Product = {
        id: newId,
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stock: Number(formData.stock),
        imageType: formData.category === 'cards' ? 'card_ronaldo_icon' : formData.category === 'packs' ? 'pack_match_attax' : formData.category === 'posters' ? 'poster_ronaldo' : 'sticker_messi',
        imageUrl: formData.imageUrl || 'https://footenix-store-2.myshopify.com/cdn/shop/files/Footenix_Store_Trading_Card_Packs.png?v=1790839312&width=700',
        description: formData.description || 'Authentic football collectible from Footenix Store.',
        badge: formData.badge || undefined,
        rating: 5.0,
        reviewsCount: 12,
        specs: {
          dimensions: formData.dimensions,
          condition: formData.condition,
          finish: formData.finish,
          series: formData.series,
          authenticity: formData.authenticity,
        },
      };
      onAddProduct(newProduct);
    }

    handleCloseModal();
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());

      const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [products, search, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-store font-semibold text-[#171923]">
            Products Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Add, update prices, inventory, and categories across Footenix Store.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-semibold rounded bg-[#245bff] hover:bg-[#1a47d6] text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-lg border border-neutral-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product title, SKU, keyword..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245bff]"
          />
        </div>

        {/* 4 Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-mono text-neutral-400 uppercase mr-1">Category:</span>
          {(['all', 'packs', 'cards', 'panini', 'stickers', 'posters'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded text-xs font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat === 'all'
                ? 'All Products'
                : cat === 'cards'
                ? 'Match Attax Cards'
                : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          <span className="font-mono text-[11px]">Category: {categoryFilter.toUpperCase()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4 w-16">Image</th>
                <th className="py-3 px-4">Title &amp; Series</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Original</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map((p) => {
                const categoryBadge = {
                  packs: 'bg-blue-50 text-blue-700 border-blue-200',
                  cards: 'bg-amber-50 text-amber-700 border-amber-200',
                  panini: 'bg-red-50 text-red-700 border-red-200',
                  stickers: 'bg-purple-50 text-purple-700 border-purple-200',
                  posters: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                }[p.category];

                return (
                  <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain p-0.5"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-neutral-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-neutral-900 leading-snug line-clamp-1">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        ID: {p.id} · {p.specs.series || 'Official Series'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${categoryBadge}`}
                      >
                        {p.category === 'cards' ? 'Match Attax' : p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                      Rs. {p.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-400 line-through">
                      {p.originalPrice ? `Rs. ${p.originalPrice.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      {p.badge ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-700 font-semibold border border-neutral-200">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.stock > 10 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        p.stock > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {p.stock ?? 0} {p.stock === 1 ? 'unit' : 'units'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-neutral-500 hover:text-[#245bff] hover:bg-neutral-100 rounded transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={handleCloseModal} />

            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-2xl border border-neutral-200">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#245bff] uppercase font-bold">
                    CATALOG MANAGEMENT
                  </span>
                  <h3 className="text-lg font-serif-store font-semibold text-[#171923]">
                    {editingProduct ? 'Edit Product Details' : 'Add New Product to Store'}
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1 text-neutral-400 hover:text-black rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Lionel Messi 100 Club Gold Limited Edition Card"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
                  />
                </div>

                {/* Category & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                      Store Category (4 Lines) *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none bg-white"
                    >
                      <option value="packs">Packs (Booster Packs &amp; Boxes)</option>
                      <option value="cards">Match Attax Cards (Singles &amp; Foils)</option>
                      <option value="stickers">Topps 24/25 (Waterproof Vinyl)</option>
                      <option value="posters">Posters (Football A5 Wall Prints)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                      Highlight Badge
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. 100 Club, Bestseller, Essential"
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Price, Original Price and Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                      Selling Price (Rs.) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      step="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                      Original Price (Rs.)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                      Available Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image URL & Upload */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-neutral-700 uppercase">
                      Product Image
                    </label>
                    <label className={`text-[10px] px-2 py-0.5 rounded border font-semibold transition-colors ${
                      isUploading ? 'bg-neutral-200 text-neutral-500 border-neutral-200 cursor-not-allowed' : 'bg-[#245bff] hover:bg-blue-600 text-white border-transparent cursor-pointer'
                    }`}>
                      {isUploading ? 'Uploading...' : 'Upload File'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Or paste an image URL..."
                      className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
                    />
                    {formData.imageUrl && (
                      <div className="w-10 h-10 rounded border border-neutral-200 overflow-hidden bg-neutral-50 shrink-0">
                        <img
                          src={formData.imageUrl}
                          alt="preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter details about condition, authentic sleeve, special finish..."
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
                  />
                </div>

                {/* Specifications Grid */}
                <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                  <span className="text-[11px] font-mono uppercase font-bold text-neutral-500 block mb-2">
                    Collector Specifications
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500">Dimensions</span>
                      <input
                        type="text"
                        value={formData.dimensions}
                        onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                        className="w-full mt-0.5 px-2 py-1 text-xs border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500">Condition</span>
                      <input
                        type="text"
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        className="w-full mt-0.5 px-2 py-1 text-xs border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500">Finish</span>
                      <input
                        type="text"
                        value={formData.finish}
                        onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                        className="w-full mt-0.5 px-2 py-1 text-xs border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500">Series / Authenticity</span>
                      <input
                        type="text"
                        value={formData.series}
                        onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                        className="w-full mt-0.5 px-2 py-1 text-xs border border-neutral-300 rounded bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-xs font-semibold rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold rounded bg-[#245bff] hover:bg-[#1a47d6] text-white shadow-xs"
                  >
                    {editingProduct ? 'Save Changes' : 'Publish Product to Store'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
