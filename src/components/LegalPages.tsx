import React, { useState } from 'react';
import { ArrowLeft, Shield, FileText, RotateCcw, Truck, Info } from 'lucide-react';

interface LegalPagesProps {
  onBack: () => void;
  initialTab?: 'privacy' | 'terms' | 'refund' | 'shipping' | 'about';
}

export const LegalPages: React.FC<LegalPagesProps> = ({ onBack, initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'about', label: 'About Us', icon: <Info className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <Shield className="w-4 h-4" /> },
    { id: 'terms', label: 'Terms of Service', icon: <FileText className="w-4 h-4" /> },
    { id: 'refund', label: 'Refund Policy', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'shipping', label: 'Shipping Policy', icon: <Truck className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Store
      </button>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[600px]">
        
        {/* Sidebar Nav */}
        <div className="md:w-64 bg-neutral-50 border-b md:border-b-0 md:border-r border-neutral-200 p-4 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap md:whitespace-normal text-left ${
                activeTab === tab.id
                  ? 'bg-white text-[#245bff] shadow-sm border border-neutral-200/60'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-transparent'
              }`}
            >
              <div className={activeTab === tab.id ? 'text-[#245bff]' : 'text-neutral-400'}>
                {tab.icon}
              </div>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 prose prose-sm md:prose-base prose-neutral max-w-none">
          {activeTab === 'about' && (
            <div>
              <h1 className="font-serif-store text-3xl font-bold mb-6 text-neutral-900">About Footenix Store</h1>
              
              <h3 className="text-lg font-bold mt-8 mb-4">Our Story</h3>
              <p>Welcome to Footenix Store, the ultimate destination for authentic football trading cards, stickers, and premium wall art. Born out of a deep passion for the beautiful game, Footenix was created to give collectors a trusted, high-quality platform to build their dream collections.</p>
              
              <h3 className="text-lg font-bold mt-8 mb-4">100% Authentic Guarantee</h3>
              <p>We know how important condition and authenticity are in the hobby. Every single Match Attax card, Panini sticker, and booster box we sell is strictly vetted, verified, and shipped with collector-grade packaging to ensure it arrives in mint condition.</p>

              <h3 className="text-lg font-bold mt-8 mb-4">Connect With Us</h3>
              <p>Whether you're chasing that elusive 100 Club gold parallel or just starting your first album, we're here to help. Reach out to our dedicated support team on WhatsApp anytime for grading advice, bulk orders, or general inquiries!</p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h1 className="font-serif-store text-3xl font-bold mb-6 text-neutral-900">Privacy Policy</h1>
              <p className="text-neutral-600">Last updated: October 2026</p>
              
              <h3 className="text-lg font-bold mt-8 mb-4">1. Information We Collect</h3>
              <p>When you purchase something from our store, as part of the buying and selling process, we collect the personal information you give us such as your name, address, and email address.</p>
              
              <h3 className="text-lg font-bold mt-8 mb-4">2. Consent</h3>
              <p>How do you get my consent? When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.</p>

              <h3 className="text-lg font-bold mt-8 mb-4">3. Data Protection (DPDP Act Compliance)</h3>
              <p>We are compliant with the Digital Personal Data Protection (DPDP) Act, 2023. We ensure that your personal data is stored securely using enterprise-grade encryption (Supabase) and is never shared with unauthorized third-party advertisers.</p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div>
              <h1 className="font-serif-store text-3xl font-bold mb-6 text-neutral-900">Terms of Service</h1>
              <p className="text-neutral-600">Last updated: October 2026</p>

              <h3 className="text-lg font-bold mt-8 mb-4">1. General Conditions</h3>
              <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks.</p>

              <h3 className="text-lg font-bold mt-8 mb-4">2. Products or Services</h3>
              <p>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.</p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div>
              <h1 className="font-serif-store text-3xl font-bold mb-6 text-neutral-900">Refund & Cancellation Policy</h1>
              <p className="text-neutral-600">Last updated: October 2026</p>

              <h3 className="text-lg font-bold mt-8 mb-4">1. Returns</h3>
              <p>Because trading cards and sealed collectible products lose significant value once opened, <strong>we do not accept returns on any opened packs, boxes, or cases.</strong> Returns are only accepted for factory-sealed products within 7 days of delivery.</p>

              <h3 className="text-lg font-bold mt-8 mb-4">2. Refunds</h3>
              <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed via Razorpay back to your original method of payment within 5-7 business days.</p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div>
              <h1 className="font-serif-store text-3xl font-bold mb-6 text-neutral-900">Shipping Policy</h1>
              <p className="text-neutral-600">Last updated: October 2026</p>

              <h3 className="text-lg font-bold mt-8 mb-4">1. Processing Time</h3>
              <p>All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>

              <h3 className="text-lg font-bold mt-8 mb-4">2. Shipping Rates & Estimates</h3>
              <p>Shipping charges for your order will be calculated and displayed at checkout. We partner with premium logistics providers (Delhivery/BlueDart) to ensure the safe transit of your collectibles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
