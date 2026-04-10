import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  return (
    <div className="pt-20 bg-dark-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-serif font-bold text-dark-900 mb-2">Products</h1>
            <p className="text-dark-600">Manage your product inventory</p>
          </div>
          <button
            onClick={() => { setEditingProduct(null); setShowModal(true); }}
            className="btn-primary"
          >
            Add Product
          </button>
        </motion.div>

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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-dark-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-dark-100 rounded-lg overflow-hidden">
                            {product.images?.[0]?.url ? (
                              <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-dark-400">📦</div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-dark-900">{product.name}</p>
                            <p className="text-sm text-dark-500">{product.sku || 'No SKU'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-dark-600 capitalize">{product.category}</td>
                      <td className="px-6 py-4 font-semibold text-gold-600">${product.price}</td>
                      <td className="px-6 py-4 text-dark-600">{product.stockQuantity}</td>
                      <td className="px-6 py-4">
                        {product.stockQuantity === 0 ? (
                          <span className="badge bg-red-100 text-red-700">Out of Stock</span>
                        ) : product.isLowStock ? (
                          <span className="badge bg-orange-100 text-orange-700">Low Stock</span>
                        ) : (
                          <span className="badge bg-green-100 text-green-700">In Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingProduct(product); setShowModal(true); }}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
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

export default AdminProducts;
