import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, CheckCircle, ShieldCheck } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Card Grading & Authenticity',
    message: '',
  });

  if (!isOpen) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Failed to send message.');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-xl border border-neutral-200">
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#245bff] uppercase font-bold">
                FOOTENIX SUPPORT
              </span>
              <h2 className="text-lg font-serif-store font-semibold text-[#212121]">
                Collector Assistance &amp; Inquiries
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif-store font-semibold text-neutral-900">
                Message Received!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
                Our card specialist will review your request and reach out within 12–24 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-black text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded hover:bg-neutral-800 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
                    placeholder="Collector Name"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 mb-1 font-medium">Inquiry Topic</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none bg-white"
                >
                  <option value="Card Grading & Authenticity">Card Grading &amp; Authenticity</option>
                  <option value="Order Tracking">Track Existing Order</option>
                  <option value="Bulk Booster Box Orders">Bulk Booster Box Orders</option>
                  <option value="Custom A5 Poster Request">Custom A5 Poster Request</option>
                  <option value="General Collector Support">General Collector Support</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 mb-1 font-medium">Message Details *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide card name, condition details, or order ID..."
                  className="w-full p-2 border border-neutral-300 rounded focus:border-[#245bff] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-neutral-400">Response guaranteed in 24h</span>
                <div className="flex flex-col items-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded transition-colors flex items-center gap-1.5 ${
                      isSubmitting 
                        ? 'bg-neutral-400 text-white cursor-not-allowed'
                        : 'bg-[#245bff] hover:bg-[#1a4de6] text-white cursor-pointer'
                    }`}
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Submit Message'}</span>
                    {!isSubmitting && <Send className="w-3.5 h-3.5" />}
                  </button>
                  {error && <span className="text-red-500 text-[10px] mt-1 font-medium">{error}</span>}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
