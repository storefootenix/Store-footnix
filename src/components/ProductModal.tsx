import React, { useState } from 'react';
import { Product } from '../data/products';
import { ProductVisual } from './ProductVisual';
import { X, Star, ShieldCheck, Check, Truck, ArrowRight, Plus, Minus } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuy = () => {
    onBuyNow(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end sm:items-center justify-center p-0 sm:p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Window: Native Bottom Sheet on Mobile, Centered Modal on Desktop */}
        <div className="relative transform overflow-hidden rounded-t-2xl sm:rounded-lg bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-3xl border border-neutral-200 max-h-[92vh] sm:max-h-none flex flex-col">
          {/* Mobile Drag Indicator Bar & Header */}
          <div className="pt-2 pb-1 bg-white sm:hidden shrink-0 flex flex-col items-center border-b border-neutral-100">
            <div className="w-12 h-1 bg-neutral-300 rounded-full" />
            <span className="text-[10px] text-neutral-400 font-mono tracking-wider mt-1 uppercase">Swipe or tap X to close</span>
          </div>

          {/* Close button with large touch target */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 active:scale-90 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto flex-1">
            {/* Visual Column */}
            <div className="bg-neutral-50 p-5 sm:p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-200 relative shrink-0">
              <div className="w-full max-w-[240px] sm:max-w-[280px]">
                <ProductVisual
                  type={product.imageType}
                  imageUrl={product.imageUrl}
                  alt={product.name}
                />
              </div>
              {product.badge && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black text-white text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded shadow-xs">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                  <span className="uppercase tracking-widest font-mono text-[10px] text-[#245bff] font-bold">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                    <span className="text-neutral-400 font-normal">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* Product Title */}
                <h2 className="text-lg sm:text-2xl font-serif-store font-semibold text-[#212121] leading-snug mb-2 sm:mb-3">
                  {product.name}
                </h2>

                {/* Price Display */}
                <div className="flex items-baseline gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl font-bold text-[#212121] tabular-nums font-mono">
                    Rs. {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs sm:text-sm text-neutral-400 line-through tabular-nums font-mono">
                      Rs. {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4 sm:mb-5">
                  {product.description}
                </p>

                {/* Specs Table */}
                <div className="bg-neutral-50 rounded p-3 mb-4 sm:mb-6 border border-neutral-100 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-neutral-600">
                    {product.specs.dimensions && (
                      <div>
                        <span className="text-neutral-400 block text-[9px] sm:text-[10px] uppercase font-mono">Dimensions</span>
                        <span className="font-medium text-neutral-800 text-[11px] sm:text-xs">{product.specs.dimensions}</span>
                      </div>
                    )}
                    {product.specs.condition && (
                      <div>
                        <span className="text-neutral-400 block text-[9px] sm:text-[10px] uppercase font-mono">Condition</span>
                        <span className="font-medium text-neutral-800 text-[11px] sm:text-xs">{product.specs.condition}</span>
                      </div>
                    )}
                    {product.specs.finish && (
                      <div>
                        <span className="text-neutral-400 block text-[9px] sm:text-[10px] uppercase font-mono">Finish / Material</span>
                        <span className="font-medium text-neutral-800 text-[11px] sm:text-xs">{product.specs.finish}</span>
                      </div>
                    )}
                    {product.specs.authenticity && (
                      <div>
                        <span className="text-neutral-400 block text-[9px] sm:text-[10px] uppercase font-mono">Authenticity</span>
                        <span className="font-medium text-neutral-800 text-[11px] sm:text-xs">{product.specs.authenticity}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Purchase Actions (Sticky bar on mobile viewport) */}
              <div className="space-y-2.5 pt-3 border-t border-neutral-100 pb-safe sm:pb-0 bg-white sticky bottom-0 z-10">
                {product.stock <= 0 ? (
                  <div className="flex items-center justify-center bg-neutral-100 text-neutral-500 font-bold uppercase tracking-wider h-11 px-4 rounded shadow-inner w-full">
                    Sold Out
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center border border-neutral-300 rounded h-11">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full flex items-center justify-center hover:bg-neutral-100 text-neutral-600 transition-colors active:scale-90 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-semibold tabular-nums text-neutral-900 font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-full flex items-center justify-center hover:bg-neutral-100 text-neutral-600 transition-colors active:scale-90 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    className="flex-1 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold uppercase tracking-wider h-11 px-3 sm:px-4 rounded transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Added ✓</span>
                      </>
                    ) : (
                      <span>Add to Cart</span>
                    )}
                  </button>
                </div>

                <button
                  onClick={handleBuy}
                  className="w-full bg-[#245bff] hover:bg-[#1a4de6] text-white text-xs sm:text-sm font-bold uppercase tracking-wider h-11 px-4 rounded shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                  </>
                )}

                <div className="flex items-center justify-center gap-4 text-[10px] text-neutral-500 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#245bff]" /> Verified Authentic
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#245bff]" /> Fast Dispatch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
