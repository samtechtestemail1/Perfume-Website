import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = '/api/admin/inventory';
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      const product = products.find(p => p._id === productId);
      const change = newQuantity - product.stockQuantity;
      
      await axios.put(`/api/products/${productId}/stock`, {
        quantity: newQuantity,
        reason: 'Manual adjustment'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInventory();
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const getStatusBadge = (product) => {
    if (product.stockQuantity === 0) {
      return <span className="badge bg-red-100 text-red-700">Out of Stock</span>;
    }
    if (product.stockQuantity <= product.lowStockThreshold) {
      return <span className="badge bg-orange-100 text-orange-700">Low Stock</span>;
    }
    return <span className="badge bg-green-100 text-green-700">In Stock</span>;
  };

  return (
    <div className="pt-20 bg-dark-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-serif font-bold text-dark-900 mb-2">Inventory</h1>
            <p className="text-dark-600">Monitor and manage stock levels</p>
          </div>

          <div className="flex gap-2">
            {['all', 'in', 'low', 'out'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === status
                    ? 'bg-gold-400 text-dark-900'
                    : 'bg-white text-dark-600 hover:bg-dark-100'
                }`}
              >
                {status === 'all' ? 'All' : status === 'in' ? 'In Stock' : status === 'low' ? 'Low Stock' : 'Out of Stock'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-3xl font-bold text-dark-900">
              {products.filter(p => p.status === 'in_stock').length}
            </p>
            <p className="text-dark-500">In Stock</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-3xl font-bold text-orange-600">
              {products.filter(p => p.status === 'low_stock').length}
            </p>
            <p className="text-dark-500">Low Stock</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-3xl font-bold text-red-600">
              {products.filter(p => p.status === 'out_of_stock').length}
            </p>
            <p className="text-dark-500">Out of Stock</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-dark-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">SKU</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Threshold</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Update Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-dark-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-dark-900">{product.name}</td>
                      <td className="px-6 py-4 text-dark-600">{product.sku || 'N/A'}</td>
                      <td className="px-6 py-4 text-dark-600 capitalize">{product.category}</td>
                      <td className="px-6 py-4 font-semibold text-dark-900">{product.stockQuantity}</td>
                      <td className="px-6 py-4 text-dark-600">{product.lowStockThreshold}</td>
                      <td className="px-6 py-4">{getStatusBadge(product)}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          defaultValue={product.stockQuantity}
                          min="0"
                          className="w-24 px-3 py-2 border border-dark-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
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
