import React from 'react';
import { Product } from '../data/products';
import { ProductVisual } from './ProductVisual';
import { Eye, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isAdded?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isAdded = false,
}) => {
  return (
    <div className="group flex flex-col justify-between bg-white rounded-md overflow-hidden transition-all duration-300 select-none">
      {/* Visual Area with touch feedback */}
      <div
        className="relative overflow-hidden cursor-pointer rounded-sm bg-neutral-50 border border-neutral-100 active:opacity-90"
        onClick={() => onQuickView(product)}
      >
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-xs shadow-md">
              Sold Out
            </span>
          </div>
        )}
        <ProductVisual
          type={product.imageType}
          imageUrl={product.imageUrl}
          alt={product.name}
        />

        {/* Mobile quick-add button (Always visible on mobile bottom-right for instant 1-tap add, hover on desktop) */}
        {product.stock > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`absolute bottom-2 right-2 w-9 h-9 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-white/95 hover:bg-[#245bff] text-neutral-800 hover:text-white border border-neutral-200/80 active:scale-85'
            }`}
            title="Add to cart"
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
          </button>
        )}

        {/* Desktop hover quick view bar */}
        <div className="hidden sm:flex absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-1 px-2 bg-white/95 hover:bg-white text-[#212121] text-xs font-semibold rounded flex items-center justify-center gap-1 shadow-xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-2.5 pb-1 flex flex-col flex-1 justify-between">
        <div className="cursor-pointer" onClick={() => onQuickView(product)}>
          <h3 className="text-xs sm:text-sm font-normal text-[#212121] line-clamp-2 hover:text-[#245bff] transition-colors leading-snug">
            {product.name}
          </h3>
        </div>

        <div className="mt-1.5 flex items-baseline justify-between pt-1 border-t border-neutral-100">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-semibold text-[#212121] tabular-nums font-mono">
              Rs. {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-[11px] text-neutral-400 line-through tabular-nums font-mono">
                Rs. {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            disabled={product.stock <= 0}
            onClick={() => onAddToCart(product)}
            className={`text-[11px] font-semibold transition-colors px-1 py-0.5 rounded ${
              product.stock <= 0 ? 'text-neutral-400 cursor-not-allowed' :
              isAdded ? 'text-emerald-600 font-bold cursor-pointer' : 'text-[#245bff] hover:underline cursor-pointer'
            }`}
          >
            {product.stock <= 0 ? 'Sold Out' : isAdded ? 'Added ✓' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
};
