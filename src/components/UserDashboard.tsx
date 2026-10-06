import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { User, Package, LogOut, ShieldCheck, CreditCard, ChevronRight, MapPin, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Order } from '../data/orders';

interface UserDashboardProps {
  session: Session | null;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ session }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchUserOrders();
    }
  }, [session]);

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
      } else if (data) {
        setOrders(data as Order[]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Login error:', err);
      alert('Failed to login with Google.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // LOGGED OUT VIEW
  if (!session) {
    return (
      <div className="min-h-[80vh] bg-neutral-50 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-neutral-200/50">
          
          {/* Left Side: Graphic / Branding */}
          <div className="md:w-1/2 relative bg-neutral-900 p-10 flex flex-col justify-between overflow-hidden min-h-[350px] md:min-h-[500px]">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=2000&auto=format&fit=crop" 
                alt="Football Stadium" 
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30"></div>
            </div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-[#245bff]/20 text-blue-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#245bff]/30 mb-6">
                  Collector Portal
                </span>
                <h2 className="text-3xl md:text-4xl font-serif-store font-bold text-white leading-tight">
                  Manage Your <br/><span className="text-[#245bff]">Dream Collection</span>
                </h2>
              </div>
              
              <div className="mt-12 space-y-5">
                <div className="flex items-center gap-4 text-neutral-300 text-sm">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20 backdrop-blur-md">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">Track your rare card deliveries instantly</span>
                </div>
                <div className="flex items-center gap-4 text-neutral-300 text-sm">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20 backdrop-blur-md">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="font-medium">Verify 100% authentic purchases</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side: Login Form */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white relative">
            <div className="max-w-sm mx-auto w-full text-center">
              <div className="w-16 h-16 bg-[#f8faff] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#e5edff] shadow-sm">
                <User className="w-8 h-8 text-[#245bff]" />
              </div>
              
              <h3 className="text-2xl font-bold text-neutral-900 mb-3 font-serif-store">Welcome Back</h3>
              <p className="text-sm text-neutral-500 mb-10 leading-relaxed px-4">
                Sign in to view your complete match attax history and access lightning-fast checkout.
              </p>
              
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-neutral-200 hover:border-[#245bff] hover:bg-[#f8faff] hover:shadow-lg text-neutral-800 font-bold py-3.5 px-4 rounded-xl transition-all duration-300 group cursor-pointer"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[15px]">Continue with Google</span>
              </button>

              <div className="mt-10 pt-8 border-t border-neutral-100 flex items-center justify-center gap-2 text-xs text-neutral-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Secured by Supabase OAuth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN VIEW (PROPER DASHBOARD)
  const user = session.user;
  const pfp = user.user_metadata?.avatar_url;
  const fullName = user.user_metadata?.full_name || 'Valued Collector';
  
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-20">
      {/* Dashboard Header / Hero */}
      <div className="bg-[#101d3e] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6 text-center md:text-left">
            {/* Google PFP */}
            <div className="relative group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl bg-white/10">
                {pfp ? (
                  <img src={pfp} referrerPolicy="no-referrer" alt="Google Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white/50" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 border-4 border-[#101d3e] rounded-full shadow-lg"></div>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-serif-store font-bold tracking-tight mb-1">
                Welcome back, {fullName.split(' ')[0]}
              </h1>
              <p className="text-blue-200/80 font-medium text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4 opacity-80" alt="Google" />
                {user.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all font-semibold text-sm backdrop-blur-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column: Stats & Quick Links */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-xs border border-neutral-200 p-6">
              <h3 className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-bold mb-4">Account Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                  <Package className="w-6 h-6 text-[#245bff] mb-2" />
                  <p className="text-2xl font-bold text-neutral-900">{orders.length}</p>
                  <p className="text-xs text-neutral-500 font-medium">Total Orders</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                  <CreditCard className="w-6 h-6 text-emerald-500 mb-2" />
                  <p className="text-2xl font-bold text-neutral-900">₹{totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-neutral-500 font-medium">Total Spent</p>
                </div>
              </div>
            </div>

            {/* Address / Info Card */}
            <div className="bg-white rounded-xl shadow-xs border border-neutral-200 p-6">
              <h3 className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-bold mb-4">Default Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#245bff]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Shipping Address</p>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Provided at checkout.<br/>Saved securely for future orders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xs border border-neutral-200 h-full">
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <h2 className="text-lg font-serif-store font-bold text-neutral-900">Your Collector History</h2>
                <span className="text-xs font-bold bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full">
                  {orders.length} Records
                </span>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-neutral-400 space-y-4">
                    <div className="w-8 h-8 border-4 border-[#245bff] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Loading your archives...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 bg-neutral-50 rounded-xl border border-neutral-200 border-dashed">
                    <Search className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-base font-bold text-neutral-800 mb-1">No Orders Yet</h3>
                    <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-6">
                      Your collector history is empty. Start building your collection to see your purchases here.
                    </p>
                    <button className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 transition-colors shadow-sm">
                        {/* Order Header */}
                        <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-bold mb-0.5">Order ID</p>
                            <p className="text-sm font-semibold text-neutral-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-bold mb-0.5">Date Placed</p>
                            <p className="text-sm font-semibold text-neutral-900">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-bold mb-0.5">Total Amount</p>
                            <p className="text-sm font-bold text-[#245bff]">₹{order.total?.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                              order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                              order.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-neutral-200 text-neutral-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="px-5 py-4 divide-y divide-neutral-100">
                          {order.items.map((item, i) => (
                            <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                              <div className="w-16 h-16 rounded-lg bg-white border border-neutral-200 p-1 shrink-0 shadow-xs">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-neutral-900 truncate">{item.name}</h4>
                                <p className="text-xs text-neutral-500 mt-1">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-neutral-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer (Tracking) */}
                        {order.trackingNumber && (
                          <div className="bg-[#f8faff] px-5 py-3 border-t border-[#e5edff] flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-[#245bff] font-semibold">
                              <Package className="w-4 h-4" />
                              <span>Tracking Number: {order.trackingNumber}</span>
                            </div>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(order.trackingNumber || '');
                                alert(`Tracking number ${order.trackingNumber} copied to clipboard!\n\nPaste it on the Delhivery website to track your package.`);
                                window.open('https://www.delhivery.com', '_blank');
                              }}
                              className="text-xs font-bold bg-white border border-[#245bff]/20 text-[#245bff] px-4 py-1.5 rounded hover:bg-[#245bff] hover:text-white transition-colors cursor-pointer"
                            >
                              Track Package
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
