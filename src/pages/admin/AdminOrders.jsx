import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/currency';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter) params.append('status', statusFilter);

      const response = await api.get(`/orders/all?${params.toString()}`);
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter, showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: status });
      showToast(`Order status updated to ${status}`);
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: status });
        setOrderDetails((prev) => prev ? { ...prev, orderStatus: status } : null);
      }
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const fetchOrderDetails = async (orderId) => {
    setDetailsLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrderDetails(response.data.order);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      showToast('Failed to load order details', 'error');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    await fetchOrderDetails(order._id);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-400', label: 'Pending', icon: '⏳' },
      confirmed: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', dot: 'bg-blue-400', label: 'Confirmed', icon: '✓' },
      processing: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', dot: 'bg-purple-400', label: 'Processing', icon: '⚙️' },
      shipped: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30', dot: 'bg-indigo-400', label: 'Shipped', icon: '🚚' },
      delivered: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400', label: 'Delivered', icon: '✨' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-400', label: 'Cancelled', icon: '✕' }
    };
    return configs[status] || configs.pending;
  };

  const getTimelineSteps = (status) => {
    const steps = [
      { key: 'pending', label: 'Placed', icon: '📋' },
      { key: 'confirmed', label: 'Confirmed', icon: '✓' },
      { key: 'processing', label: 'Preparing', icon: '⚙️' },
      { key: 'shipped', label: 'Shipped', icon: '🚚' },
      { key: 'delivered', label: 'Delivered', icon: '✨' }
    ];
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex && status !== 'cancelled',
      current: index === currentIndex && status !== 'cancelled',
      cancelled: status === 'cancelled'
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif text-ivory-100">Orders</h1>
          <p className="text-ivory-100/50 text-sm mt-1">
            {pagination.totalOrders ? `${pagination.totalOrders} total orders` : 'Manage and track all orders'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm">
            {pagination.totalOrders || 0} Total
          </span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ivory-100/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, phone, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-charcoal-100/50 border border-ivory-100/10 text-ivory-100 placeholder-charcoal-400 rounded-xl focus:outline-none focus:border-gold-300/50 focus:ring-2 focus:ring-gold-300/20 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-charcoal-100/50 border border-ivory-100/10 text-ivory-100 rounded-xl focus:outline-none focus:border-gold-300/50 transition-colors min-w-[160px]"
        >
          <option value="">All Status</option>
          {statusOptions.map(status => (
            <option key={status} value={status} className="capitalize">{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl border backdrop-blur-sm ${
              toast.type === 'success' ? 'bg-emerald-900/80 border-emerald-500/30 text-emerald-400' : 'bg-red-900/80 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-40 rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-12 text-center backdrop-blur-sm"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-charcoal-200/50 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-ivory-100/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-serif text-ivory-100 mb-3">No orders found</h3>
          <p className="text-ivory-100/50 text-sm">Orders will appear here when customers make purchases</p>
        </motion.div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.orderStatus);
              
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-charcoal-100/50 border border-ivory-100/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-gold-300/20 transition-all"
                >
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <div>
                            <p className="text-ivory-100 font-medium flex items-center gap-2">
                              Order 
                              <span className="text-gold-300 font-serif text-lg">#{order._id.slice(-8).toUpperCase()}</span>
                            </p>
                            <p className="text-sm text-ivory-100/40 font-light mt-1">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                            <span>{statusConfig.icon}</span>
                            {statusConfig.label}
                          </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <p className="text-ivory-100 font-medium">
                              {order.shippingAddress?.fullName || 'Guest'}
                            </p>
                            <p className="text-ivory-100/50 text-sm flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {order.shippingAddress?.phone || 'N/A'}
                            </p>
                          </div>
                          
                          {/* Items Preview */}
                          <div className="flex items-center gap-2">
                            {order.items?.slice(0, 4).map((item, i) => (
                              <div key={i} className="w-12 h-12 bg-charcoal-200/50 rounded-xl overflow-hidden border border-ivory-100/5">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-charcoal-400">✦</div>
                                )}
                              </div>
                            ))}
                            {order.items?.length > 4 && (
                              <span className="w-12 h-12 bg-charcoal-200/50 rounded-xl flex items-center justify-center text-ivory-100/40 text-sm border border-ivory-100/5">
                                +{order.items.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-2xl font-serif text-gold-300">{formatCurrency(order.total)}</p>
                          <p className="text-sm text-ivory-100/40 font-light">{order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}</p>
                        </div>
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="px-6 py-3 bg-gold-300/10 border border-gold-300/30 text-gold-300 rounded-xl hover:bg-gold-300/20 transition-all font-medium text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Status Update */}
                  <div className="px-6 lg:px-8 pb-6 lg:pb-8 border-t border-ivory-100/5 pt-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-ivory-100/40 uppercase tracking-wider">Quick Update:</span>
                      <div className="flex flex-wrap gap-2">
                        {statusOptions.map(status => (
                          <button
                            key={status}
                            onClick={() => updateStatus(order._id, status)}
                            disabled={order.orderStatus === status}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                              order.orderStatus === status
                                ? 'bg-gold-300/20 text-gold-300 border border-gold-300/30'
                                : 'bg-charcoal-200/50 text-ivory-100/70 border border-ivory-100/10 hover:border-ivory-100/20 hover:text-ivory-100'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 mt-8"
            >
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-charcoal-100/50 border border-ivory-100/10 text-ivory-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-charcoal-100/70 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-ivory-100/70">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 bg-charcoal-100/50 border border-ivory-100/10 text-ivory-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-charcoal-100/70 transition-colors"
              >
                Next
              </button>
            </motion.div>
          )}
        </>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            details={orderDetails}
            loading={detailsLoading}
            onClose={() => { setSelectedOrder(null); setOrderDetails(null); }}
            onStatusChange={(status) => updateStatus(selectedOrder._id, status)}
            getTimelineSteps={getTimelineSteps}
            formatDate={formatDate}
            statusOptions={statusOptions}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const OrderDetailsModal = ({ order, details, loading, onClose, onStatusChange, getTimelineSteps, formatDate, statusOptions }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-emerald-400 bg-emerald-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-ivory-100/70 bg-charcoal-200/50';
    }
  };

  const getGoogleMapsUrl = (address) => {
    if (!address) return null;
    const query = [
      address.street,
      address.city,
      address.state,
      address.country
    ].filter(Boolean).join(', ');
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  };

  const mapsUrl = details?.shippingAddress ? getGoogleMapsUrl(details.shippingAddress) : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-charcoal-100 border border-ivory-100/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl pointer-events-auto"
        >
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-2 border-gold-300/30 border-t-gold-300 rounded-full animate-spin mb-4" />
              <p className="text-ivory-100/50">Loading order details...</p>
            </div>
          ) : details && (
            <>
              {/* Header */}
              <div className="bg-charcoal-200/50 border-b border-ivory-100/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-serif text-ivory-100">Order Details</h3>
                    <p className="text-sm text-ivory-100/50 mt-1">
                      #{order._id.slice(-8).toUpperCase()} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={details.orderStatus}
                      onChange={(e) => onStatusChange(e.target.value)}
                      className="px-4 py-2 bg-charcoal-100/50 border border-ivory-100/10 text-ivory-100 rounded-lg focus:outline-none focus:border-gold-300/50 text-sm"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status} className="capitalize">{status}</option>
                      ))}
                    </select>
                    <button
                      onClick={onClose}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-ivory-100/50 hover:text-ivory-100 hover:bg-charcoal-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="p-6 space-y-6">
                  {/* Status Timeline */}
                  <div>
                    <h4 className="text-xs text-ivory-100/50 uppercase tracking-wider mb-4">Order Status</h4>
                    <div className="flex items-center justify-between">
                      {getTimelineSteps(details.orderStatus).map((step, index, arr) => (
                        <React.Fragment key={step.key}>
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm mb-2 ${
                              step.cancelled
                                ? 'bg-red-500/20 text-red-400'
                                : step.completed
                                  ? 'bg-gold-300 text-charcoal-300'
                                  : 'bg-charcoal-200/50 text-ivory-100/30'
                            }`}>
                              {step.cancelled ? '✕' : step.completed ? '✓' : step.icon}
                            </div>
                            <span className="text-xs text-ivory-100/50">{step.label}</span>
                          </div>
                          {index < arr.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 ${step.completed && !step.cancelled ? 'bg-gold-300' : 'bg-ivory-100/10'}`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Customer Info */}
                  {details.user && (
                    <div className="p-4 bg-charcoal-200/30 rounded-xl">
                      <h4 className="text-xs text-ivory-100/50 uppercase tracking-wider mb-3">Customer</h4>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gold-300/20 rounded-full flex items-center justify-center text-gold-300 font-serif text-lg">
                          {details.user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-ivory-100 font-medium">{details.user.name}</p>
                          <p className="text-ivory-100/70 text-sm">{details.user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div>
                    <h4 className="text-xs text-ivory-100/50 uppercase tracking-wider mb-4">Items ({details.items?.length || 0})</h4>
                    <div className="space-y-3">
                      {details.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-charcoal-200/30 rounded-xl">
                          <div className="w-14 h-14 bg-charcoal-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-charcoal-400">✦</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-ivory-100 font-medium truncate">{item.name}</p>
                            <p className="text-sm text-ivory-100/50">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-gold-300 font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address & Payment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Delivery Address with Google Maps Link */}
                    {details.shippingAddress && (
                      <div className="p-4 bg-charcoal-200/30 rounded-xl">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-xs text-ivory-100/50 uppercase tracking-wider">Delivery Address</h4>
                          {mapsUrl && (
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-xs font-medium flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Open in Maps
                            </a>
                          )}
                        </div>
                        <p className="text-ivory-100 text-sm font-medium">{details.shippingAddress.fullName}</p>
                        {details.shippingAddress.placeName && (
                          <p className="text-gold-300 text-sm font-medium mt-1 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {details.shippingAddress.placeName}
                          </p>
                        )}
                        <p className="text-ivory-100/70 text-sm">{details.shippingAddress.street}</p>
                        <p className="text-ivory-100/70 text-sm">{details.shippingAddress.city}, {details.shippingAddress.state}</p>
                        <p className="text-ivory-100/70 text-sm">{details.shippingAddress.country}</p>
                        <p className="text-ivory-100/70 text-sm mt-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {details.shippingAddress.phone}
                        </p>
                      </div>
                    )}
                    
                    {/* Payment */}
                    <div className="p-4 bg-charcoal-200/30 rounded-xl">
                      <h4 className="text-xs text-ivory-100/50 uppercase tracking-wider mb-2">Payment</h4>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(details.paymentStatus)}`}>
                        {details.paymentStatus?.toUpperCase() || 'PENDING'}
                      </span>
                      <p className="text-ivory-100/70 text-sm mt-2 capitalize flex items-center gap-2">
                        {details.paymentMethod === 'cod' && '💵 '}
                        {details.paymentMethod === 'card' && '💳 '}
                        {details.paymentMethod === 'paypal' && '🅿️ '}
                        {details.paymentMethod}
                      </p>
                      <p className="text-2xl font-serif text-gold-300 mt-3">{formatCurrency(details.total)}</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-4 bg-charcoal-200/30 rounded-xl">
                    <h4 className="text-xs text-ivory-100/50 uppercase tracking-wider mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-ivory-100/70">Subtotal</span>
                        <span className="text-ivory-100">{formatCurrency(details.subtotal || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ivory-100/70">Shipping</span>
                        <span className={details.shippingCost === 0 ? 'text-emerald-400' : 'text-ivory-100'}>
                          {details.shippingCost === 0 ? 'Free' : formatCurrency(details.shippingCost || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ivory-100/70">Tax</span>
                        <span className="text-ivory-100">{formatCurrency(details.tax || 0)}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-ivory-100/10">
                        <span className="text-ivory-100 font-medium">Total</span>
                        <span className="text-gold-300 font-serif text-lg">{formatCurrency(details.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {details.notes && (
                    <div className="p-4 bg-charcoal-200/30 rounded-xl">
                      <h4 className="text-xs text-ivory-100/50 uppercase tracking-wider mb-2">Notes</h4>
                      <p className="text-ivory-100/70 text-sm">{details.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default AdminOrders;
