import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/all');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: status });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      processing: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      delivered: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30'
    };
    return colors[status] || 'bg-charcoal-200/20 text-charcoal-400 border border-charcoal-200/30';
  };

  return (
    <div className="min-h-screen bg-charcoal-300">
      {/* Page Header */}
      <div className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="heading-2 text-ivory-100">Orders</h1>
          <p className="text-ivory-100/50 font-light mt-1">Manage and track all orders</p>
        </motion.div>
      </div>

      <div className="px-6 pb-8">
        {loading ? (
          <div className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-charcoal-200/50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-ivory-100/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-ivory-100/50">No orders found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl overflow-hidden backdrop-blur-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ivory-100/10">
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Order ID</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Customer</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Date</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Total</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Status</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-100/5">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-charcoal-200/30 transition-colors">
                      <td className="px-6 py-5 text-ivory-100 font-medium">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-ivory-100 font-medium">{order.user?.name || 'Guest'}</p>
                          <p className="text-sm text-ivory-100/40 font-light">{order.user?.email || order.shippingAddress?.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-ivory-100/70 font-light">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 text-gold-300 font-medium">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`badge ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className="px-4 py-2 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 rounded-lg text-sm focus:outline-none focus:border-gold-300 transition-colors"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
