import React, { useState, useMemo } from 'react';
import { Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CatalogViewProps {
  products?: Product[];
  initialCategory?: string;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  addedIds?: Set<string>;
  categories?: any[];
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products = [],
  initialCategory = 'all',
  onQuickView,
  onAddToCart,
  addedIds = new Set(),
  categories = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const displayCategories = [
    { id: 'all', name: 'All Collectibles' },
    ...categories,
  ];

  const filteredAndSorted = useMemo(() => {
    let result = products.filter((item) => {
      if (selectedCategory === 'all') return true;
      return item.category === selectedCategory;
    });

    switch (sortBy) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating);
      default:
        return result;
    }
  }, [selectedCategory, sortBy]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-10">
      {/* Title & Filter Header */}
      <div className="mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-neutral-200 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-bold block mb-1">
            FULL COLLECTION
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif-store font-normal text-[#212121]">
            Collector Catalog
          </h1>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 text-xs">
          <span className="text-neutral-500 font-medium">
            Showing {filteredAndSorted.length} items
          </span>

          <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-neutral-800 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sticky Category Filter Pills on Mobile */}
      <div className="sticky top-14 sm:top-18 z-20 bg-white/95 backdrop-blur-md py-2.5 mb-5 sm:mb-8 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 border-b border-neutral-100 sm:border-0 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {displayCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full sm:rounded-xs text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-black text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
        {filteredAndSorted.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
            isAdded={addedIds.has(product.id)}
          />
        ))}
      </div>
    </div>
  );
};
