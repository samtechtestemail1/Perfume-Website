import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data.stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Users',
      value: stats?.users?.total || 0,
      change: `+${stats?.users?.newThisWeek || 0} this week`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'from-blue-500/20 to-blue-600/20 text-blue-400',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Total Products',
      value: stats?.products?.total || 0,
      change: `${stats?.products?.lowStock || 0} low stock`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'from-emerald-500/20 to-emerald-600/20 text-emerald-400',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Total Orders',
      value: stats?.orders?.total || 0,
      change: `${stats?.orders?.pending || 0} pending`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'from-purple-500/20 to-purple-600/20 text-purple-400',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.revenue?.total || 0).toLocaleString()}`,
      change: `$${(stats?.revenue?.weekly || 0).toLocaleString()} this week`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-gold-500/20 to-gold-600/20 text-gold-400',
      borderColor: 'border-gold-500/20'
    }
  ];

  const adminLinks = [
    { title: 'Products', link: '/admin/products', icon: '✦', color: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20', textColor: 'text-blue-400' },
    { title: 'Orders', link: '/admin/orders', icon: '✦', color: 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20', textColor: 'text-emerald-400' },
    { title: 'Users', link: '/admin/users', icon: '✦', color: 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20', textColor: 'text-purple-400' },
    { title: 'Inventory', link: '/admin/inventory', icon: '✦', color: 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20', textColor: 'text-orange-400' },
    { title: 'POS', link: '/admin/pos', icon: '✦', color: 'bg-pink-500/10 border-pink-500/20 hover:bg-pink-500/20', textColor: 'text-pink-400' }
  ];

  return (
    <div className="min-h-screen bg-charcoal-300">
      {/* Header */}
      <div className="bg-charcoal-200/50 border-b border-ivory-100/10">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="heading-3 text-ivory-100">Admin Dashboard</h1>
              <p className="text-ivory-100/50 font-light mt-1">Overview of your store's performance</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin/products" className="btn-primary rounded-xl">
                Add Product
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="skeleton h-40 rounded-2xl" />
            ))
          ) : (
            cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-charcoal-100/30 border ${card.borderColor} rounded-2xl p-6 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                    {card.icon}
                  </div>
                </div>
                <p className="text-3xl font-serif text-ivory-100 mb-1">{card.value}</p>
                <p className="text-sm text-ivory-100/50 font-light">{card.title}</p>
                <p className="text-xs text-ivory-100/30 mt-2">{card.change}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Admin Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="heading-4 text-ivory-100 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {adminLinks.map((link) => (
              <Link
                key={link.title}
                to={link.link}
                className={`${link.color} border rounded-2xl p-6 transition-all duration-300 flex flex-col items-center text-center`}
              >
                <span className={`text-2xl mb-3 ${link.textColor}`}>{link.icon}</span>
                <span className="text-sm text-ivory-100 font-light">{link.title}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-4 text-ivory-100">Recent Orders</h2>
              <Link to="/admin/orders" className="text-gold-300 hover:text-gold-200 text-sm font-light transition-colors">
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton h-16 rounded-xl" />
                ))}
              </div>
            ) : stats?.recentOrders?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-ivory-100/30">No recent orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.recentOrders?.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-charcoal-200/50 rounded-xl border border-ivory-100/5">
                    <div>
                      <p className="text-ivory-100 font-medium">#{order._id.slice(-8)}</p>
                      <p className="text-sm text-ivory-100/40">{order.user?.name || 'Guest'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold-300 font-medium">${order.total.toFixed(2)}</p>
                      <span className="text-xs text-ivory-100/40 capitalize">{order.orderStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Sales */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-4 text-ivory-100">Recent Sales (In-Store)</h2>
              <Link to="/admin/pos" className="text-gold-300 hover:text-gold-200 text-sm font-light transition-colors">
                Open POS →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton h-16 rounded-xl" />
                ))}
              </div>
            ) : stats?.recentSales?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-ivory-100/30">No recent sales</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.recentSales?.map((sale) => (
                  <div key={sale._id} className="flex items-center justify-between p-4 bg-charcoal-200/50 rounded-xl border border-ivory-100/5">
                    <div>
                      <p className="text-ivory-100 font-medium">#{sale._id.slice(-8)}</p>
                      <p className="text-sm text-ivory-100/40">
                        {new Date(sale.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold-300 font-medium">${sale.total.toFixed(2)}</p>
                      <span className="text-xs text-ivory-100/40 capitalize">{sale.paymentMethod}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Low Stock Alert */}
        {stats?.products?.lowStock > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-ivory-100 font-medium">Low Stock Alert</h3>
                <p className="text-ivory-100/50 text-sm font-light">
                  {stats.products.lowStock} products are running low on stock
                </p>
              </div>
              <Link
                to="/admin/inventory"
                className="px-6 py-3 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-xl hover:bg-orange-500/30 transition-colors text-sm font-light"
              >
                View Inventory
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
