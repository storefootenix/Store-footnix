import React, { useState } from 'react';
import { Product } from '../data/products';
import { ProductVisual } from './ProductVisual';
import { X, Trash2, Plus, Minus, ArrowRight, Gift, Tag, Check, ShieldCheck } from 'lucide-react';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = rawSubtotal * appliedDiscount;
  const subtotalAfterDiscount = rawSubtotal - discountAmount;
  const shipping = rawSubtotal >= 499 || rawSubtotal === 0 ? 0 : 49;
  const grandTotal = subtotalAfterDiscount + shipping;

  const FREE_GIFT_THRESHOLD = 2500;
  const qualifiesForFreeGift = rawSubtotal >= FREE_GIFT_THRESHOLD;
  const amountNeededForFreeGift = Math.max(0, FREE_GIFT_THRESHOLD - rawSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'FIRST5') {
      setAppliedDiscount(0.05);
      setCouponSuccess('5% FIRST5 discount applied!');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try FIRST5');
      setCouponSuccess('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-[420px] bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-serif-store font-semibold text-[#212121]">
                Your Collector Cart
              </h2>
              <span className="text-xs bg-neutral-100 text-neutral-700 font-mono px-2 py-0.5 rounded-full font-medium">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Promotion / Free Gift Progress Bar (SHOP FOR 2500 GET 1 CHROME X TOPPS FREE) */}
          <div className="bg-[#eef4ff] px-4 py-3 border-b border-blue-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#101d3e] mb-1.5">
              <Gift className="w-4 h-4 text-[#245bff] shrink-0" />
              {qualifiesForFreeGift ? (
                <span className="text-emerald-700 font-bold">
                  🎉 Free Chrome X Topps pack unlocked!
                </span>
              ) : (
                <span>
                  Add Rs. {amountNeededForFreeGift.toFixed(2)} more for <strong>1 FREE Chrome X Topps</strong>!
                </span>
              )}
            </div>
            {/* Progress bar */}
            <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#245bff] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (rawSubtotal / FREE_GIFT_THRESHOLD) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center text-neutral-500">
                <p className="font-serif-store text-lg text-neutral-700 mb-2">
                  Your cart is empty
                </p>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-6">
                  Explore rare trading cards, Match Attax booster packs, and archival football posters.
                </p>
                <button
                  onClick={onClose}
                  className="bg-black text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xs hover:bg-neutral-800 transition-colors"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3.5 pb-4 border-b border-neutral-100 last:border-b-0 items-center"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-20 shrink-0 bg-neutral-50 rounded border border-neutral-200 overflow-hidden">
                    <ProductVisual type={product.imageType} className="h-full scale-90" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-medium text-[#212121] line-clamp-1">
                      {product.name}
                    </h4>
                    <span className="text-[11px] text-neutral-500 font-mono block mt-0.5">
                      Rs. {product.price.toFixed(2)} each
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-neutral-300 rounded overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 text-neutral-600 transition-colors active:scale-90 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold tabular-nums text-neutral-900 font-mono">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 text-neutral-600 transition-colors active:scale-90 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-red-500 rounded hover:bg-neutral-100 transition-colors active:scale-90 cursor-pointer"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-[#212121] tabular-nums">
                      Rs. {(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* Free Gift Notification card if unlocked */}
            {qualifiesForFreeGift && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-600" />
                  <span>
                    <strong>Bonus Gift:</strong> 1x Topps Chrome Booster Pack
                  </span>
                </div>
                <span className="font-semibold text-emerald-700 uppercase text-[10px]">FREE</span>
              </div>
            )}
          </div>

          {/* Footer & Calculations */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/70 space-y-3 pb-safe">
              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Discount code (FIRST5)"
                    className="w-full text-xs pl-8 pr-2 py-1.5 bg-white border border-neutral-300 rounded focus:outline-none focus:border-[#245bff]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-neutral-800 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponSuccess && (
                <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-red-500">{couponError}</p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-neutral-900">
                    Rs. {rawSubtotal.toFixed(2)}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount (FIRST5 - 5%)</span>
                    <span className="tabular-nums">- Rs. {discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="tabular-nums font-medium">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-semibold">FREE</span>
                    ) : (
                      `Rs. ${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:text-base font-bold text-[#212121] pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span className="tabular-nums text-[#245bff]">
                    Rs. {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={onCheckout}
                className="w-full bg-[#245bff] hover:bg-[#1a4de6] text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-3 px-4 rounded shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400">
                <ShieldCheck className="w-3 h-3 text-[#245bff]" />
                <span>Armored packaging • 100% Genuine Football Cards</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
