import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/orders', {
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/20'
    },
    {
      label: 'Wishlist Items',
      value: user?.wishlist?.length || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'from-pink-500/20 to-pink-600/20 text-pink-400 border-pink-500/20'
    },
    {
      label: 'Account Age',
      value: user?.createdAt ? `${Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))} days` : 'N/A',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-emerald-500/20 to-emerald-600/20 text-emerald-400 border-emerald-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-charcoal-300">
      <div className="bg-charcoal-200/50 border-b border-ivory-100/10">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="heading-3 text-ivory-100">
              Welcome back, <span className="text-gold-300">{user?.name?.split(' ')[0]}!</span>
            </h1>
            <p className="text-ivory-100/50 font-light mt-1">Here's an overview of your account</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-charcoal-100/30 border ${stat.color} rounded-2xl p-6 backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-serif text-ivory-100 mb-1">{stat.value}</p>
              <p className="text-sm text-ivory-100/50 font-light">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { title: 'My Orders', link: '/orders', icon: '✦', color: 'border-blue-500/20 text-blue-400 hover:bg-blue-500/10' },
            { title: 'Edit Profile', link: '/profile', icon: '✦', color: 'border-purple-500/20 text-purple-400 hover:bg-purple-500/10' },
            { title: 'Wishlist', link: '/wishlist', icon: '✦', color: 'border-pink-500/20 text-pink-400 hover:bg-pink-500/10' },
            { title: 'Shop Now', link: '/shop', icon: '✦', color: 'border-gold-500/20 text-gold-400 hover:bg-gold-500/10' }
          ].map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className={`bg-charcoal-100/30 border ${item.color} rounded-2xl p-6 transition-all duration-300 flex flex-col items-center text-center`}
            >
              <span className={`text-2xl mb-3 ${item.color.split(' ')[2]}`}>{item.icon}</span>
              <span className="text-sm text-ivory-100 font-light">{item.title}</span>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-8 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-4 text-ivory-100">Recent Orders</h2>
            <Link to="/orders" className="text-gold-300 hover:text-gold-200 font-light transition-colors">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-charcoal-200/50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-ivory-100/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-ivory-100/40 mb-6">No orders yet</p>
              <Link to="/shop" className="btn-primary inline-block rounded-xl">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 bg-charcoal-200/50 border border-ivory-100/5 rounded-xl"
                >
                  <div>
                    <p className="text-ivory-100 font-medium">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-ivory-100/40 font-light">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-300 font-medium">${order.total.toFixed(2)}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-light ${
                      order.orderStatus === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                      order.orderStatus === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                      order.orderStatus === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
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
