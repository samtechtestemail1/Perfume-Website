import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/orders/${orderId}/status`, { orderStatus: status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="pt-20 bg-dark-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-serif font-bold text-dark-900 mb-2">Orders</h1>
          <p className="text-dark-600">Manage and track all orders</p>
        </motion.div>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-dark-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <p className="text-dark-400 text-lg">No orders found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-dark-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-dark-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-dark-900">{order.user?.name || 'Guest'}</p>
                          <p className="text-sm text-dark-500">{order.user?.email || order.shippingAddress?.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-dark-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gold-600">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className="px-3 py-2 border border-dark-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
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
