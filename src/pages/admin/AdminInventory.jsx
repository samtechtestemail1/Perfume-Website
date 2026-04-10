import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  const fetchInventory = async () => {
    try {
      let url = '/admin/inventory';
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }
      const response = await api.get(url);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newQuantity) => {
    try {
      await api.put(`/products/${productId}/stock`, {
        quantity: newQuantity,
        reason: 'Manual adjustment'
      });
      fetchInventory();
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const getStatusBadge = (product) => {
    if (product.stockQuantity === 0) {
      return <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">Out of Stock</span>;
    }
    if (product.stockQuantity <= product.lowStockThreshold) {
      return <span className="badge bg-orange-500/20 text-orange-400 border border-orange-500/30">Low Stock</span>;
    }
    return <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">In Stock</span>;
  };

  const stats = {
    inStock: products.filter(p => p.stockQuantity > p.lowStockThreshold).length,
    lowStock: products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold).length,
    outOfStock: products.filter(p => p.stockQuantity === 0).length
  };

  return (
    <div className="min-h-screen bg-charcoal-300">
      {/* Page Header */}
      <div className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="heading-2 text-ivory-100">Inventory</h1>
          <p className="text-ivory-100/50 font-light mt-1">Track and manage your stock levels</p>
        </motion.div>
      </div>

      <div className="px-6 pb-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {[
            { key: 'all', label: 'All' },
            { key: 'in', label: 'In Stock' },
            { key: 'low', label: 'Low Stock' },
            { key: 'out', label: 'Out of Stock' }
          ].map((status) => (
            <button
              key={status.key}
              onClick={() => setFilter(status.key)}
              className={`px-4 py-2 rounded-lg transition-all text-sm font-light ${
                filter === status.key
                  ? 'bg-gold-300 text-charcoal-300'
                  : 'bg-charcoal-100/30 border border-ivory-100/10 text-ivory-100/70 hover:text-ivory-100 hover:border-ivory-100/30'
              }`}
            >
              {status.label}
            </button>
          ))}
        </motion.div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-charcoal-100/30 border border-emerald-500/20 rounded-2xl p-6">
            <p className="text-3xl font-serif text-emerald-400 mb-1">{stats.inStock}</p>
            <p className="text-ivory-100/50 text-sm font-light">In Stock</p>
          </div>
          <div className="bg-charcoal-100/30 border border-orange-500/20 rounded-2xl p-6">
            <p className="text-3xl font-serif text-orange-400 mb-1">{stats.lowStock}</p>
            <p className="text-ivory-100/50 text-sm font-light">Low Stock</p>
          </div>
          <div className="bg-charcoal-100/30 border border-red-500/20 rounded-2xl p-6">
            <p className="text-3xl font-serif text-red-400 mb-1">{stats.outOfStock}</p>
            <p className="text-ivory-100/50 text-sm font-light">Out of Stock</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
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
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Product</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">SKU</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Category</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Stock</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Threshold</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Status</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Update Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-100/5">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-charcoal-200/30 transition-colors">
                      <td className="px-6 py-5 text-ivory-100 font-medium">{product.name}</td>
                      <td className="px-6 py-5 text-ivory-100/70 font-light">{product.sku || 'N/A'}</td>
                      <td className="px-6 py-5 text-ivory-100/70 capitalize font-light">{product.category}</td>
                      <td className="px-6 py-5 text-ivory-100 font-medium">{product.stockQuantity}</td>
                      <td className="px-6 py-5 text-ivory-100/70 font-light">{product.lowStockThreshold}</td>
                      <td className="px-6 py-5">{getStatusBadge(product)}</td>
                      <td className="px-6 py-5">
                        <input
                          type="number"
                          defaultValue={product.stockQuantity}
                          min="0"
                          className="w-24 px-4 py-2 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 rounded-lg text-sm focus:outline-none focus:border-gold-300 transition-colors"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              updateStock(product._id, parseInt(e.target.value));
                            }
                          }}
                        />
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

export default AdminInventory;
