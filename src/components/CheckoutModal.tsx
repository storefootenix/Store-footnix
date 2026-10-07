import React, { useState } from 'react';
import { CartItem } from './CartDrawer';
import { ProductVisual } from './ProductVisual';
import { Order } from '../data/orders';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, Package, Tag } from 'lucide-react';
import { StoreBannerConfig } from '../data/storeConfig';
import { Session } from '@supabase/supabase-js';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  config: StoreBannerConfig;
  onOrderComplete: (order?: Order) => void;
  session?: Session | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  config,
  onOrderComplete,
  session,
}) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: session?.user?.user_metadata?.full_name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod' as 'cod' | 'razorpay' | 'card',
  });
  const [orderId, setOrderId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (promoApplied && config.activePromoCode) {
    if (config.activePromoDiscountType === 'percentage') {
      discountAmount = subtotal * (config.activePromoDiscountValue / 100);
    } else {
      discountAmount = config.activePromoDiscountValue;
    }
  }
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  
  const shipping = discountedSubtotal >= (config.freeShippingThreshold || 499) ? 0 : 49;
  const total = discountedSubtotal + shipping;

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    if (config.activePromoCode && promoCode.trim().toUpperCase() === config.activePromoCode.toUpperCase()) {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError('Invalid or expired promo code');
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const proceedWithOrderCreation = (newOrderId: string, paymentMethod: string, status: string) => {
    setOrderId(newOrderId);
    setStep('success');

    const createdOrder: Order = {
      id: newOrderId,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        imageUrl: i.product.imageUrl,
        category: i.product.category,
      })),
      subtotal,
      shipping,
      total,
      paymentMethod,
      status: status as any,
      createdAt: new Date().toISOString(),
    };

    onOrderComplete(createdOrder);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newOrderId = `FTX-${Math.floor(100000 + Math.random() * 900000)}`;
    
    setStep('processing');
    
    if (formData.paymentMethod === 'razorpay') {
      const res = await loadRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setStep('form');
        return;
      }
      
      try {
        const orderRes = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total })
        });
        const orderData = await orderRes.json();
        
        // Fetch dynamic Razorpay Key ID from DB
        const settingsRes = await fetch('/api/settings/public');
        const { razorpay_key_id } = await settingsRes.json();
        
        const options = {
          key: razorpay_key_id || 'rzp_test_dummy',
          amount: orderData.amount,
          currency: orderData.currency,
          name: config.storeName || 'Footenix Store',
          description: "Order Payment",
          order_id: orderData.id,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response)
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                proceedWithOrderCreation(newOrderId, 'razorpay', 'processing');
              } else {
                alert('Payment verification failed!');
                setStep('form');
              }
            } catch (err) {
              alert('Verification error');
              setStep('form');
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          theme: { color: "#245bff" },
          modal: {
            ondismiss: function() {
              setStep('form');
            }
          }
        };
        
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any){
          alert('Payment failed: ' + response.error.description);
          setStep('form');
        });
        rzp.open();
      } catch (err) {
        alert('Failed to initiate payment');
        setStep('form');
      }
    } else {
      // COD
      proceedWithOrderCreation(newOrderId, formData.paymentMethod, 'pending');
    }
  };

  const handleDone = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end sm:items-center justify-center p-0 sm:p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={step === 'form' ? onClose : undefined}
        />

        <div className="relative transform overflow-hidden rounded-t-2xl sm:rounded-lg bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-2xl border border-neutral-200 max-h-[92vh] sm:max-h-none flex flex-col">
          {/* Mobile Drag Indicator Bar */}
          <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto my-2 sm:hidden shrink-0" />

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 shrink-0">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#245bff] uppercase font-bold">
                FOOTENIX CHECKOUT
              </span>
              <h2 className="text-lg font-serif-store font-semibold text-[#212121]">
                {step === 'form' ? 'Collector Order Verification' : 'Order Confirmed!'}
              </h2>
            </div>
            {step === 'form' && (
              <button
                onClick={onClose}
                className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {step === 'processing' ? (
            <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 border-4 border-[#e5edff] border-t-[#245bff] rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2 font-serif-store">Processing Order...</h3>
              <p className="text-sm text-neutral-500 text-center max-w-xs">
                {formData.paymentMethod === 'razorpay' 
                  ? 'Awaiting secure payment confirmation from Razorpay. Please do not close this window.'
                  : 'Finalizing your collector items and securing inventory...'}
              </p>
            </div>
          ) : step === 'form' ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Order Summary Snapshot */}
              <div className="bg-neutral-50 p-4 rounded-md border border-neutral-200 text-xs">
                <div className="flex justify-between font-semibold text-neutral-800 pb-2 border-b border-neutral-200">
                  <span>Order Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span className="tabular-nums">Rs. {total.toFixed(2)}</span>
                </div>
                <div className="max-h-24 overflow-y-auto pt-2 space-y-1.5 text-neutral-600">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between items-center text-[11px]">
                      <span className="truncate max-w-[280px]">
                        {quantity}x {product.name}
                      </span>
                      <span className="tabular-nums font-mono">
                        Rs. {(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="bg-white p-4 rounded-md border border-neutral-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#245bff]" />
                    Have a Promo Code?
                  </label>
                  {promoApplied && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      APPLIED: -Rs. {discountAmount.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      if (promoError) setPromoError('');
                    }}
                    disabled={promoApplied}
                    placeholder="Enter code here"
                    className="flex-1 p-2 text-xs border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={promoApplied ? () => { setPromoApplied(false); setPromoCode(''); } : handleApplyPromo}
                    className={`px-4 py-2 text-xs font-bold rounded transition-colors ${
                      promoApplied
                        ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        : 'bg-[#245bff] text-white hover:bg-[#1a47d6]'
                    }`}
                  >
                    {promoApplied ? 'Remove' : 'Apply'}
                  </button>
                </div>
                {promoError && <p className="text-[10px] text-rose-500 font-medium">{promoError}</p>}
              </div>

              {/* Customer Contact & Address Form */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-700">
                  1. Shipping &amp; Delivery Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-neutral-600 mb-1 font-medium">Full Name *</label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none text-base sm:text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1 font-medium">Mobile Phone (for delivery SMS) *</label>
                    <input
                      type="tel"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none text-base sm:text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-600 mb-1 font-medium">Email Address (for invoice) *</label>
                    <input
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none text-base sm:text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-600 mb-1 font-medium">Complete Delivery Address *</label>
                    <input
                      type="text"
                      required
                      autoComplete="street-address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House / Flat / Street name"
                      className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none text-base sm:text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1 font-medium">City *</label>
                    <input
                      type="text"
                      required
                      autoComplete="address-level2"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none text-base sm:text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1 font-medium">Postal PIN Code *</label>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoComplete="postal-code"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none text-base sm:text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-700">
                  2. Select Payment Method
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer transition-colors ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#245bff] bg-blue-50/50'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className="mt-0.5 text-[#245bff]"
                    />
                    <div>
                      <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span>Cash on Delivery (COD)</span>
                      </div>
                      <span className="text-[11px] text-neutral-500 block mt-0.5">
                        Pay upon doorstep verification
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer transition-colors ${
                      formData.paymentMethod === 'razorpay'
                        ? 'border-[#245bff] bg-blue-50/50'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === 'razorpay'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'razorpay' })}
                      className="mt-0.5 text-[#245bff]"
                    />
                    <div>
                      <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-[#245bff]" />
                        <span>Razorpay Secure (UPI / Cards)</span>
                      </div>
                      <span className="text-[11px] text-neutral-500 block mt-0.5">
                        GPay, PhonePe, Cards, NetBanking
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* DPDP Compliance Checkbox */}
              <div className="pt-2 border-t border-neutral-100">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      required
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="peer appearance-none w-4 h-4 border-2 border-neutral-300 rounded-sm checked:bg-[#245bff] checked:border-[#245bff] focus:outline-none focus:ring-2 focus:ring-[#245bff]/30 transition-all cursor-pointer shrink-0"
                    />
                    <CheckCircle className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <div className="text-[11px] text-neutral-600 leading-tight">
                    I agree to the <span className="text-[#245bff] hover:underline">Terms of Service</span> and acknowledge that my shipping and payment details will be securely processed by our authorized partners (Delhivery, Razorpay) in compliance with the <span className="font-semibold text-neutral-800">DPDP Act 2023</span>.
                  </div>
                </label>
              </div>

              {/* Sticky Submit Button on Mobile Viewports */}
              <div className="sticky bottom-0 bg-white pt-3 pb-safe border-t border-neutral-200 flex items-center justify-between -mx-6 px-6 shadow-sm">
                <div>
                  <span className="text-[11px] text-neutral-500 block">Total Payable:</span>
                  <span className="text-base sm:text-lg font-bold text-[#212121] tabular-nums font-mono">
                    Rs. {total.toFixed(2)}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={!acceptedTerms}
                  className={`text-white text-xs sm:text-sm font-bold uppercase tracking-wider h-11 sm:h-12 px-5 sm:px-6 rounded shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                    acceptedTerms 
                      ? 'bg-[#245bff] hover:bg-[#1a4de6] active:scale-95' 
                      : 'bg-neutral-300 cursor-not-allowed'
                  }`}
                >
                  <span>CONFIRM ORDER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* ORDER SUCCESS CONFIRMATION */
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                  ORDER PLACED SUCCESSFULLY
                </span>
                <h3 className="text-2xl font-serif-store font-semibold text-[#212121]">
                  Order #{orderId} Confirmed
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mt-2">
                  Thank you, <strong>{formData.name}</strong>! We have dispatched your collector invoice to <strong>{formData.email}</strong>.
                </p>
              </div>

              {/* Shipment Details Box */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-neutral-800 font-semibold border-b border-neutral-200 pb-2">
                  <Package className="w-4 h-4 text-[#245bff]" />
                  <span>Preparing Armored Collector Dispatch</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-neutral-600 pt-1">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-mono">DELIVERY ADDRESS</span>
                    <span>{formData.address}, {formData.city} - {formData.pincode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-mono">PAYMENT MODE</span>
                    <span className="capitalize">{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Instant Prepaid'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDone}
                className="bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
