import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'perfume',
    stockQuantity: '',
    size: '100ml',
    isFeatured: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
        const response = await api.get('/admin/products', {
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
        await api.delete(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stockQuantity: product.stockQuantity,
      size: product.size || '100ml',
      isFeatured: product.isFeatured
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/products', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchProducts();
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: 'perfume', stockQuantity: '', size: '100ml', isFeatured: false });
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const categories = [
    { name: 'perfume', label: 'Perfume' },
    { name: 'oil', label: 'Oil' },
    { name: 'gift set', label: 'Gift Set' },
    { name: 'accessories', label: 'Accessories' }
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
              <h1 className="heading-3 text-ivory-100">Products</h1>
              <p className="text-ivory-100/50 font-light mt-1">Manage your product inventory</p>
            </div>
            <button
              onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: '', category: 'perfume', stockQuantity: '', size: '100ml', isFeatured: false }); setShowModal(true); }}
              className="btn-primary rounded-xl"
            >
              Add Product
            </button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
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
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Category</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Price</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Stock</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Status</th>
                    <th className="px-6 py-5 text-left text-xs uppercase tracking-ultra-wide text-ivory-100/50 font-light">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-100/5">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-charcoal-200/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-charcoal-200/50 rounded-xl overflow-hidden flex-shrink-0">
                            {product.images?.[0]?.url ? (
                              <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-charcoal-400 text-2xl">✦</div>
                            )}
                          </div>
                          <div>
                            <p className="text-ivory-100 font-medium">{product.name}</p>
                            <p className="text-sm text-ivory-100/40 font-light">{product.sku || 'No SKU'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-ivory-100/70 capitalize font-light">{product.category}</td>
                      <td className="px-6 py-5 text-gold-300 font-medium">${product.price}</td>
                      <td className="px-6 py-5 text-ivory-100/70 font-light">{product.stockQuantity}</td>
                      <td className="px-6 py-5">
                        {product.stockQuantity === 0 ? (
                          <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">Out of Stock</span>
                        ) : product.stockQuantity <= product.lowStockThreshold ? (
                          <span className="badge bg-orange-500/20 text-orange-400 border border-orange-500/30">Low Stock</span>
                        ) : (
                          <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">In Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm font-light"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-light"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-300/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-charcoal-100/50 border border-ivory-100/10 rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-4 text-ivory-100">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-ivory-100/50 hover:text-ivory-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="section-label mb-3 block">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 placeholder-charcoal-400 focus:outline-none focus:border-gold-300 transition-colors rounded-xl"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="section-label mb-3 block">Description</label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-4 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 placeholder-charcoal-400 focus:outline-none focus:border-gold-300 transition-colors rounded-xl resize-none"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="section-label mb-3 block">Price ($)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-5 py-4 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 placeholder-charcoal-400 focus:outline-none focus:border-gold-300 transition-colors rounded-xl"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="section-label mb-3 block">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full px-5 py-4 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 placeholder-charcoal-400 focus:outline-none focus:border-gold-300 transition-colors rounded-xl"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="section-label mb-3 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-5 py-4 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 focus:outline-none focus:border-gold-300 transition-colors rounded-xl"
                  >
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="section-label mb-3 block">Size</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-5 py-4 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 placeholder-charcoal-400 focus:outline-none focus:border-gold-300 transition-colors rounded-xl"
                    placeholder="100ml"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-5 h-5 rounded border border-ivory-100/20 text-gold-300 focus:ring-gold-300 focus:ring-offset-0 bg-charcoal-200/50"
                />
                <label htmlFor="isFeatured" className="text-ivory-100/70 font-light">Featured Product</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary rounded-xl">
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
