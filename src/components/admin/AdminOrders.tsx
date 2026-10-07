import React, { useState, useMemo } from 'react';
import { Order } from '../../data/orders';
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  Mail,
  Printer,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status'], trackingNumber?: string) => void;
  selectedOrder?: Order | null;
  onClearSelectedOrder?: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onUpdateOrderStatus,
  selectedOrder: externalSelectedOrder,
  onClearSelectedOrder,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status'] | 'cod'>('all');
  const [search, setSearch] = useState('');
  const [internalSelectedOrder, setInternalSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingMode, setTrackingMode] = useState<'auto' | 'manual'>('auto');

  const activeOrder = externalSelectedOrder || internalSelectedOrder;

  const handleCloseDetail = () => {
    setInternalSelectedOrder(null);
    if (onClearSelectedOrder) onClearSelectedOrder();
  };

  const handleSelectOrder = (order: Order) => {
    setInternalSelectedOrder(order);
    setTrackingInput(order.trackingNumber || '');
    setTrackingMode(order.trackingNumber ? 'manual' : 'auto');
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'cod' ? o.paymentMethod === 'cod' : o.status === statusFilter);
      
      const matchesSearch =
        search === '' ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerPhone.includes(search) ||
        o.city.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
    cod: orders.filter((o) => o.paymentMethod === 'cod').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-store font-semibold text-[#171923]">
            Orders &amp; Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Manage collector dispatches, tracking numbers, and delivery statuses.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
            {statusCounts.pending + statusCounts.processing} Need Fulfillment
          </span>
        </div>
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
            placeholder="Search order ID, customer name, phone, city..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#245bff]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 md:pb-0 scrollbar-none">
          {(['all', 'cod', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded text-xs font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {status === 'cod' ? 'COD Only' : status} ({statusCounts[status]})
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          <span className="font-mono text-[11px]">FILTER: {statusFilter.toUpperCase()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Shipping Destination</th>
                <th className="py-3 px-4">Items Ordered</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-400">
                    No orders match your current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusStyles = {
                    pending: 'bg-amber-50 text-amber-700 border-amber-200',
                    processing: 'bg-blue-50 text-blue-700 border-blue-200',
                    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
                    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
                  }[order.status];

                  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={order.id}
                      onClick={() => handleSelectOrder(order)}
                      className="hover:bg-neutral-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#171923]">
                        {order.id}
                      </td>
                      <td className="py-3 px-4 text-neutral-500 text-[11px] whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900">{order.customerName}</div>
                        <div className="text-[11px] text-neutral-400">{order.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600 max-w-xs truncate">
                        {order.city}, {order.pincode}
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items ({order.items.length} SKUs)
                      </td>
                      <td className="py-3 px-4 uppercase text-[10px] font-mono text-neutral-500">
                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'razorpay' ? 'Razorpay Secure' : 'Online Payment'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                        Rs. {order.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${statusStyles}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectOrder(order);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={handleCloseDetail} />

            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-3xl border border-neutral-200">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#245bff] uppercase font-bold">
                      ORDER DETAILS
                    </span>
                    <span className="font-mono text-xs font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
                      {activeOrder.id}
                    </span>
                  </div>
                  <h3 className="text-base font-serif-store font-semibold text-[#171923] mt-0.5">
                    Order for {activeOrder.customerName}
                  </h3>
                </div>
                <button onClick={handleCloseDetail} className="p-1 text-neutral-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Status Controller Bar */}
              <div className="p-4 bg-neutral-900 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 font-mono text-[11px]">STATUS:</span>
                  <span className="uppercase font-mono font-bold tracking-wider text-cyan-300">
                    {activeOrder.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-neutral-400 text-[11px] mr-1">Advance to:</span>
                  {activeOrder.status === 'pending' && (
                    <button
                      onClick={() => onUpdateOrderStatus(activeOrder.id, 'processing')}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold text-[11px]"
                    >
                      Process / Pack
                    </button>
                  )}
                  {(activeOrder.status === 'pending' || activeOrder.status === 'processing') && (
                    <button
                      onClick={() => onUpdateOrderStatus(activeOrder.id, 'shipped', trackingInput || 'TRACK-99214')}
                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded font-semibold text-[11px]"
                    >
                      Dispatch (Ship)
                    </button>
                  )}
                  {activeOrder.status === 'shipped' && (
                    <button
                      onClick={() => onUpdateOrderStatus(activeOrder.id, 'delivered')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold text-[11px]"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {activeOrder.status !== 'cancelled' && activeOrder.status !== 'delivered' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Cancel this order?')) {
                          onUpdateOrderStatus(activeOrder.id, 'cancelled');
                        }
                      }}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-rose-700 text-neutral-300 hover:text-white rounded text-[11px]"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Content Grid */}
              <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* 2 Column Customer & Delivery Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer Info */}
                  <div className="p-4 bg-neutral-50 rounded border border-neutral-200 text-xs space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-neutral-500 block">
                      Customer Contact
                    </span>
                    <div className="font-semibold text-neutral-900 text-sm">
                      {activeOrder.customerName}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{activeOrder.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{activeOrder.customerEmail}</span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="p-4 bg-neutral-50 rounded border border-neutral-200 text-xs space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-neutral-500 block">
                      Delivery Address
                    </span>
                    <div className="flex items-start gap-2 text-neutral-700">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                      <div>
                        <p>{activeOrder.shippingAddress}</p>
                        <p className="font-semibold">
                          {activeOrder.city} - {activeOrder.pincode}
                        </p>
                      </div>
                    </div>
                    {/* Tracking & Logistics */}
                    <div className="pt-3 border-t border-neutral-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-neutral-500">
                          Fulfillment Method
                        </span>
                        <div className="flex items-center gap-1 bg-neutral-200/50 p-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          <button
                            onClick={() => setTrackingMode('auto')}
                            className={`px-2 py-1 rounded transition-colors ${trackingMode === 'auto' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                          >
                            Auto
                          </button>
                          <button
                            onClick={() => setTrackingMode('manual')}
                            className={`px-2 py-1 rounded transition-colors ${trackingMode === 'manual' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}
                          >
                            Manual
                          </button>
                        </div>
                      </div>

                      {trackingMode === 'auto' ? (
                        <div className="space-y-2 p-2.5 bg-rose-50/50 border border-rose-100 rounded">
                          <p className="text-[10px] text-neutral-500 leading-tight">
                            Generate a tracking number automatically via Delhivery. Status will change to <strong>Shipped</strong>.
                          </p>
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch('/api/shipping/create-shipment', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ orderId: activeOrder.id })
                                });
                                const data = await res.json();
                                if (data.success && data.awb) {
                                  setTrackingInput(data.awb);
                                  onUpdateOrderStatus(activeOrder.id, 'shipped', data.awb);
                                  alert(`Delhivery Shipment Created! AWB: ${data.awb}`);
                                } else {
                                  alert('Failed to create Delhivery shipment.');
                                }
                              } catch(err) {
                                alert('Network error communicating with shipping API.');
                              }
                            }}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded transition-colors cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Generate Delhivery AWB</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 p-2.5 bg-neutral-100 rounded border border-neutral-200">
                           <p className="text-[10px] text-neutral-500 leading-tight">
                            Manually enter a tracking ID from a third-party courier (e.g. BlueDart, India Post).
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={trackingInput}
                              onChange={(e) => setTrackingInput(e.target.value)}
                              placeholder="e.g. AWB-9021482"
                              className="flex-1 px-2 py-1.5 bg-white border border-neutral-300 rounded text-xs font-mono focus:outline-none focus:border-neutral-500"
                            />
                            <button
                              onClick={() =>
                                onUpdateOrderStatus(activeOrder.id, activeOrder.status, trackingInput)
                              }
                              className="px-3 py-1.5 text-xs bg-neutral-900 text-white rounded font-medium shrink-0 hover:bg-black transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                    Items in Order ({activeOrder.items.length})
                  </h4>
                  <div className="border border-neutral-200 rounded divide-y divide-neutral-100 overflow-hidden">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain p-0.5"
                              />
                            ) : (
                              <Package className="w-4 h-4 text-neutral-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900">{item.name}</div>
                            <div className="text-[11px] text-neutral-500 font-mono">
                              Category: {item.category} · Qty: {item.quantity} × Rs. {item.price}
                            </div>
                          </div>
                        </div>

                        <div className="font-mono font-bold text-neutral-900">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals Breakdown */}
                <div className="p-4 bg-neutral-50 rounded border border-neutral-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-mono">Rs. {activeOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping Charges</span>
                    <span className="font-mono">
                      {activeOrder.shipping === 0 ? 'FREE' : `Rs. ${activeOrder.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#171923] pt-2 border-t border-neutral-200">
                    <span>Total Amount</span>
                    <span className="font-mono text-[#245bff]">Rs. {activeOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 pt-1">
                    Payment Mode: {activeOrder.paymentMethod.toUpperCase()} (
                    {activeOrder.paymentMethod === 'cod'
                      ? 'Collect on delivery'
                      : 'Verified online payment'}
                    )
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded border border-neutral-300 text-neutral-700 hover:bg-neutral-100 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Packing Slip</span>
                </button>

                <button
                  onClick={handleCloseDetail}
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-black text-white font-semibold rounded"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hidden Packing Slip Print Layout (Only visible during window.print) */}
      {activeOrder && (
        <div id="packing-slip-printout" className="hidden print:block absolute inset-0 bg-white p-8 font-sans">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-neutral-800 pb-6 mb-6">
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase mb-1">Footenix</h1>
              <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">Premium Collectibles</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-neutral-800 mb-1">PACKING SLIP</h2>
              <p className="font-mono text-sm font-semibold text-neutral-600">Order: {activeOrder.id}</p>
              <p className="font-mono text-sm text-neutral-500">Date: {new Date(activeOrder.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          {/* Addresses */}
          <div className="flex gap-12 mb-8 mt-12">
            <div className="flex-1">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 border-b border-neutral-200 pb-1">Ship To</h3>
              <p className="font-bold text-neutral-900 text-lg">{activeOrder.customerName}</p>
              <p className="text-neutral-700 whitespace-pre-wrap text-sm mt-1">{activeOrder.shippingAddress}</p>
              <p className="text-neutral-700 text-sm mt-0.5">{activeOrder.city} - {activeOrder.pincode}</p>
              <p className="text-neutral-700 text-sm mt-1 font-mono">Ph: {activeOrder.customerPhone}</p>
            </div>
            <div className="flex-1">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 border-b border-neutral-200 pb-1">Ship From</h3>
              <p className="font-bold text-neutral-900 text-lg">Footenix Store</p>
              <p className="text-neutral-700 text-sm mt-1">Andheri West, Link Road</p>
              <p className="text-neutral-700 text-sm mt-0.5">Mumbai - 400053</p>
              <p className="text-neutral-700 text-sm mt-1 font-mono">storefootenix@gmail.com</p>
            </div>
          </div>
          
          {/* Items Table */}
          <table className="w-full text-left mb-8 border-collapse mt-12">
            <thead>
              <tr className="border-b-2 border-neutral-800">
                <th className="py-2 text-[11px] font-bold uppercase tracking-widest text-neutral-500">Item Description</th>
                <th className="py-2 text-[11px] font-bold uppercase tracking-widest text-neutral-500 text-center">Qty</th>
                <th className="py-2 text-[11px] font-bold uppercase tracking-widest text-neutral-500 text-right">Price</th>
                <th className="py-2 text-[11px] font-bold uppercase tracking-widest text-neutral-500 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {activeOrder.items.map((item, idx) => (
                <tr key={idx} className="border-b border-neutral-200">
                  <td className="py-4">
                    <p className="font-bold text-neutral-900 text-base">{item.name}</p>
                    <p className="text-[10px] font-mono text-neutral-500 uppercase mt-1">Category: {item.category}</p>
                  </td>
                  <td className="py-4 text-center font-mono text-base">{item.quantity}</td>
                  <td className="py-4 text-right font-mono text-neutral-600">Rs. {item.price.toFixed(2)}</td>
                  <td className="py-4 text-right font-mono font-bold text-base">Rs. {(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Totals & Notes */}
          <div className="flex justify-between items-start mt-12">
            <div className="p-5 border-2 border-neutral-200 rounded-lg w-1/2">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Payment Information</h3>
              <p className="text-base font-bold uppercase">{activeOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Paid Online (Razorpay)'}</p>
              
              {activeOrder.paymentMethod === 'cod' && (
                <p className="text-sm font-semibold text-red-600 mt-2 border border-red-200 bg-red-50 p-2 rounded">
                  Collect Rs. {activeOrder.total.toFixed(2)} upon delivery.
                </p>
              )}
              
              {activeOrder.trackingNumber && (
                <div className="mt-4 pt-3 border-t border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">AWB Tracking Number:</span> 
                  <p className="font-mono font-bold text-lg mt-1">{activeOrder.trackingNumber}</p>
                </div>
              )}
            </div>
            
            <div className="w-1/3 text-sm">
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-500 font-semibold">Subtotal</span>
                <span className="font-mono">Rs. {activeOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-500 font-semibold">Shipping</span>
                <span className="font-mono">{activeOrder.shipping === 0 ? 'FREE' : `Rs. ${activeOrder.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between py-3 text-xl font-bold border-b-2 border-neutral-900 mt-2">
                <span>Total</span>
                <span className="font-mono">Rs. {activeOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-20 text-center border-t-2 border-neutral-100 pt-8">
            <p className="font-bold tracking-widest uppercase text-sm text-neutral-800">Thank you for shopping with Footenix!</p>
            <p className="text-xs text-neutral-500 mt-2">If you have any questions about your order, please contact us on WhatsApp.</p>
          </div>
        </div>
      )}
    </div>
  );
};
