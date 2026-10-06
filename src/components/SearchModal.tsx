import React, { useState, useMemo } from 'react';
import { Product } from '../data/products';
import { ProductVisual } from './ProductVisual';
import { Search, X, ArrowRight, Tag } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  products?: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  products = [],
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        !query.trim() ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || product.category === selectedCategory;

      return matchesQuery && matchesCat;
    });
  }, [query, selectedCategory]);

  if (!isOpen) return null;

  const popularSearches = [
    'Match Attax',
    'Cristiano Ronaldo #372',
    'Messi',
    'Glue Dots',
    'A5 Posters',
    'Waterproof Stickers',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen sm:px-4 text-center flex items-start justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-2xl my-0 sm:my-12 text-left align-middle transition-all transform bg-white shadow-2xl rounded-none sm:rounded-lg overflow-hidden border-0 sm:border border-neutral-200 min-h-screen sm:min-h-0 flex flex-col">
          {/* Search Header */}
          <div className="p-3 sm:p-5 border-b border-neutral-200 flex items-center gap-2 sm:gap-3 bg-white shrink-0 pt-safe sm:pt-5">
            <Search className="w-5 h-5 text-neutral-400 shrink-0 ml-1" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cards, packs, posters, stickers..."
              className="w-full text-base sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#245bff]/20 py-2 px-3 bg-neutral-100 border border-neutral-200 rounded-lg transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-xs font-semibold text-[#245bff] hover:text-blue-800 uppercase tracking-wider px-2 py-1.5 shrink-0 cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Category Tabs */}
          <div className="px-3 sm:px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 flex items-center gap-1.5 sm:gap-2 overflow-x-auto text-xs shrink-0 scrollbar-none">
            {['all', 'packs', 'cards', 'stickers', 'posters'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors active:scale-95 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {cat === 'all'
                  ? 'All Items'
                  : cat === 'cards'
                  ? 'Match Attax Cards'
                  : cat}
              </button>
            ))}
          </div>

          {/* Popular Tag suggestions if query is empty */}
          {!query && (
            <div className="p-3 sm:p-4 bg-white border-b border-neutral-100 flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs text-neutral-500 shrink-0">
              <span className="font-semibold text-neutral-700 text-[11px] uppercase tracking-wide">Popular:</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-full transition-colors active:scale-95 text-xs cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {/* Results List */}
          <div className="flex-1 max-h-[calc(100vh-160px)] sm:max-h-[60vh] overflow-y-auto p-3 sm:p-4 space-y-2 pb-safe">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <p className="font-serif-store text-lg">No collectibles found</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Try searching for "Ronaldo", "Match Attax", or "Posters"
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="group flex items-center justify-between p-2.5 hover:bg-neutral-50 rounded-md cursor-pointer transition-colors border border-transparent hover:border-neutral-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 bg-neutral-100 rounded overflow-hidden shrink-0">
                      <ProductVisual type={product.imageType} imageUrl={product.imageUrl} className="scale-90" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-neutral-900 group-hover:text-[#245bff] transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                        <span className="uppercase font-mono text-[9px] bg-neutral-100 px-1.5 py-0.5 rounded">
                          {product.category}
                        </span>
                        <span>★ {product.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-neutral-900 tabular-nums">
                      Rs. {product.price.toFixed(2)}
                    </span>
                    <span className="block text-[11px] text-[#245bff] group-hover:translate-x-0.5 transition-transform">
                      View →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
