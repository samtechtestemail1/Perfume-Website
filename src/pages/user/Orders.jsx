import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'shipped': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-300">
      <div className="bg-charcoal-200/50 border-b border-ivory-100/10">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="heading-3 text-ivory-100">My Orders</h1>
            <p className="text-ivory-100/50 font-light mt-1">Track and manage your orders</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
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
            <h2 className="heading-4 text-ivory-100 mb-2">No orders yet</h2>
            <p className="text-ivory-100/40 mb-6 font-light">Start shopping to see your orders here</p>
            <Link to="/shop" className="btn-primary inline-block rounded-xl">
              Shop Now
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl overflow-hidden backdrop-blur-sm"
              >
                {/* Order Header */}
                <div className="bg-charcoal-200/50 border-b border-ivory-100/5 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div>
                      <p className="text-ivory-100 font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-ivory-100/40 font-light">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-light capitalize ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-serif text-gold-300">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-ivory-100/40 font-light">{order.items.length} items</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-4">
                        <div className="w-20 h-20 bg-charcoal-200/50 rounded-xl overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-ivory-100 font-medium">{item.name}</h3>
                          <p className="text-sm text-ivory-100/40 font-light">Qty: {item.quantity}</p>
                          <p className="text-gold-300 font-medium">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
