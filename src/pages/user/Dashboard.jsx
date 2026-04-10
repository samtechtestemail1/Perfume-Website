import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data.orders.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      label: 'Wishlist Items',
      value: user?.wishlist?.length || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      label: 'Account Age',
      value: user?.createdAt ? `${Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))} days` : 'N/A',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="pt-20 bg-dark-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-serif font-bold text-dark-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-dark-600">
            Here's an overview of your account
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gold-400/10 rounded-full flex items-center justify-center text-gold-600">
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-dark-900 mb-1">{stat.value}</p>
              <p className="text-dark-500 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'My Orders', link: '/orders', icon: '📦' },
            { title: 'Edit Profile', link: '/profile', icon: '👤' },
            { title: 'Wishlist', link: '/wishlist', icon: '❤️' },
            { title: 'Shop Now', link: '/shop', icon: '🛍️' }
          ].map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-4"
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="font-semibold text-dark-900">{item.title}</span>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-dark-900">Recent Orders</h2>
            <Link to="/orders" className="text-gold-600 hover:text-gold-700 font-medium">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-dark-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-400 mb-4">No orders yet</p>
              <Link to="/shop" className="btn-primary inline-block">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 bg-dark-50 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-dark-900">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-dark-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gold-600">${order.total.toFixed(2)}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
