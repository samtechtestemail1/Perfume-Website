import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({ inStock: 0, lowStock: 0, outOfStock: 0, total: 0 });

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: '',
    sort: '-stockQuantity'
  });

  const [page, setPage] = useState(1);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editReason, setEditReason] = useState('');
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyProduct, setHistoryProduct] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 50);
      if (filters.search) params.append('search', filters.search);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      params.append('sort', filters.sort);

      const response = await api.get(`/admin/inventory?${params.toString()}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);

      const allStats = {
        inStock: response.data.products.filter(p => p.status === 'in_stock').length,
        lowStock: response.data.products.filter(p => p.status === 'low_stock').length,
        outOfStock: response.data.products.filter(p => p.status === 'out_of_stock').length,
        total: response.data.pagination.totalProducts
      };
      setStats(prev => ({ ...prev, ...allStats }));
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      showToast('Failed to load inventory', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, page, showToast]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    if (selectAll) {
      setSelectedProducts(products.map(p => p._id));
    } else if (selectedProducts.length === products.length) {
      // Keep selected if not selectAll
    } else {
      setSelectedProducts([]);
    }
  }, [selectAll, products]);

  const handleSelectProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const updateStock = async (productId, newQuantity, reason = 'Manual adjustment') => {
    try {
      await api.put(`/products/${productId}/stock`, {
        quantity: newQuantity,
        reason
      });
      showToast('Stock updated successfully');
      fetchInventory();
    } catch (error) {
      console.error('Failed to update stock:', error);
      showToast(error.response?.data?.message || 'Failed to update stock', 'error');
    }
  };

  const handleEditStart = (product) => {
    setEditingId(product._id);
    setEditValue(product.stockQuantity);
  };

  const handleEditConfirm = () => {
    if (pendingUpdate) {
      updateStock(pendingUpdate._id, parseInt(editValue), editReason || 'Manual adjustment');
    }
    setEditingId(null);
    setPendingUpdate(null);
    setEditValue('');
    setEditReason('');
    setShowReasonModal(false);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setPendingUpdate(null);
    setEditValue('');
    setEditReason('');
    setShowReasonModal(false);
  };

  const handleQuickAdjust = (product, change) => {
    const newQuantity = Math.max(0, product.stockQuantity + change);
    updateStock(product._id, newQuantity, change > 0 ? 'Restock' : 'Stock adjustment');
  };

  const fetchHistory = async (product) => {
    setHistoryProduct(product);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    try {
      const response = await api.get(`/admin/inventory/logs/${product._id}`);
      setHistoryLogs(response.data.logs);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      showToast('Failed to load history', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  const bulkRestock = async (amount) => {
    if (selectedProducts.length === 0) return;
    try {
      const updates = selectedProducts.map(id => ({
        productId: id,
        change: amount
      }));
      await api.put('/admin/inventory/bulk', { updates });
      showToast(`Added ${amount} units to ${selectedProducts.length} products`);
      setSelectedProducts([]);
      setSelectAll(false);
      fetchInventory();
    } catch (error) {
      console.error('Failed to bulk update:', error);
      showToast('Failed to update products', 'error');
    }
  };

  const getStockPercentage = (product) => {
    const maxStock = Math.max(product.lowStockThreshold * 3, product.stockQuantity + 10);
    return Math.min(100, (product.stockQuantity / maxStock) * 100);
  };

  const getStockColor = (status) => {
    switch (status) {
      case 'out_of_stock': return 'bg-red-500';
      case 'low_stock': return 'bg-orange-500';
      default: return 'bg-emerald-500';
    }
  };

  const categories = ['perfume', 'oil', 'gift set', 'accessories'];

  const getChangeTypeLabel = (type) => {
    const labels = {
      sale: 'Sale',
      restock: 'Restock',
      manual_adjustment: 'Adjustment',
      return: 'Return',
      damaged: 'Damaged'
    };
    return labels[type] || type;
  };

  const getChangeTypeColor = (type) => {
    switch (type) {
      case 'sale': return 'text-red-400';
      case 'restock': return 'text-emerald-400';
      case 'return': return 'text-blue-400';
      case 'damaged': return 'text-orange-400';
      default: return 'text-ivory-100/70';
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-300">
      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl backdrop-blur-xl border ${
              toast.type === 'success'
                ? 'bg-emerald-500/90 border-emerald-400/30 text-emerald-100'
                : 'bg-red-500/90 border-red-400/30 text-red-100'
            } shadow-xl`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="font-light">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="heading-2 text-ivory-100">Inventory Management</h1>
            <p className="text-ivory-100/50 font-light mt-1">Track, monitor, and manage your stock levels</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-ivory-100/50 text-xs uppercase tracking-wider font-light">Total Products</span>
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-serif text-ivory-100">{stats.total}</p>
            <div className="mt-3 h-1.5 bg-charcoal-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-charcoal-100/30 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-ivory-100/50 text-xs uppercase tracking-wider font-light">In Stock</span>
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-serif text-emerald-400">{stats.inStock}</p>
            <div className="mt-3 h-1.5 bg-charcoal-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${stats.total ? (stats.inStock / stats.total) * 100 : 0}%` }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-charcoal-100/30 border border-orange-500/20 rounded-2xl p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-ivory-100/50 text-xs uppercase tracking-wider font-light">Low Stock</span>
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-serif text-orange-400">{stats.lowStock}</p>
            <div className="mt-3 h-1.5 bg-charcoal-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${stats.total ? (stats.lowStock / stats.total) * 100 : 0}%` }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-charcoal-100/30 border border-red-500/20 rounded-2xl p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-ivory-100/50 text-xs uppercase tracking-wider font-light">Out of Stock</span>
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-serif text-red-400">{stats.outOfStock}</p>
            <div className="mt-3 h-1.5 bg-charcoal-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${stats.total ? (stats.outOfStock / stats.total) * 100 : 0}%` }} />
            </div>
          </motion.div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ivory-100/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
                className="w-full pl-12 pr-4 py-3 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 placeholder-charcoal-400 focus:outline-none focus:border-gold-300 transition-colors rounded-xl"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
              className="px-4 py-3 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 rounded-xl focus:outline-none focus:border-gold-300 min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setPage(1); }}
              className="px-4 py-3 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 rounded-xl focus:outline-none focus:border-gold-300 min-w-[140px]"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => { setFilters({ ...filters, sort: e.target.value }); setPage(1); }}
              className="px-4 py-3 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 rounded-xl focus:outline-none focus:border-gold-300 min-w-[160px]"
            >
              <option value="-stockQuantity">Stock: High to Low</option>
              <option value="stockQuantity">Stock: Low to High</option>
              <option value="-name">Name: A-Z</option>
              <option value="name">Name: Z-A</option>
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-ivory-100/10 flex flex-wrap items-center gap-4"
            >
              <span className="text-sm text-gold-300 font-light">
                {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ivory-100/50 uppercase tracking-wider">Quick Adjust:</span>
                <button
                  onClick={() => bulkRestock(5)}
                  className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-light"
                >
                  +5 Units
                </button>
                <button
                  onClick={() => bulkRestock(10)}
                  className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-light"
                >
                  +10 Units
                </button>
                <button
                  onClick={() => bulkRestock(25)}
                  className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-light"
                >
                  +25 Units
                </button>
              </div>
              <button
                onClick={() => { setSelectedProducts([]); setSelectAll(false); }}
                className="px-4 py-2 text-ivory-100/50 hover:text-ivory-100 transition-colors text-sm font-light"
              >
                Clear Selection
              </button>
            </motion.div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-12 text-center backdrop-blur-sm"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-charcoal-200/50 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-ivory-100/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-ivory-100 mb-2">No Products Found</h3>
            <p className="text-ivory-100/50 font-light">Try adjusting your filters or add new products</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`bg-charcoal-100/30 border rounded-2xl p-5 backdrop-blur-sm transition-all ${
                    selectedProducts.includes(product._id)
                      ? 'border-gold-300/50 ring-1 ring-gold-300/20'
                      : 'border-ivory-100/10 hover:border-ivory-100/20'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <label className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => handleSelectProduct(product._id)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-ivory-100/30 rounded peer-checked:bg-gold-300 peer-checked:border-gold-300 peer-checked:text-charcoal-300 transition-colors cursor-pointer flex items-center justify-center">
                          {selectedProducts.includes(product._id) && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </label>
                      <div>
                        <h3 className="text-ivory-100 font-medium line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-ivory-100/40 font-light mt-0.5">{product.sku || 'No SKU'}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-light ${
                      product.status === 'out_of_stock' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      product.status === 'low_stock' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {product.status === 'out_of_stock' ? 'Out' :
                       product.status === 'low_stock' ? 'Low' : 'In Stock'}
                    </span>
                  </div>

                  {/* Stock Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-ivory-100/50 uppercase tracking-wider">Stock Level</span>
                      <span className="text-sm font-medium text-ivory-100">{product.stockQuantity} / {product.lowStockThreshold * 3}+</span>
                    </div>
                    <div className="h-3 bg-charcoal-200/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getStockPercentage(product)}%` }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                        className={`h-full rounded-full ${getStockColor(product.status)}`}
                      />
                    </div>
                  </div>

                  {/* Quick Adjust Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuickAdjust(product, -5)}
                      disabled={product.stockQuantity < 5}
                      className="flex-1 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-light disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => handleQuickAdjust(product, -1)}
                      disabled={product.stockQuantity < 1}
                      className="flex-1 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-light disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      -1
                    </button>

                    {editingId === product._id ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        className="flex-1 px-3 py-2 bg-charcoal-200/50 border border-gold-300 text-ivory-100 rounded-lg text-center focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setPendingUpdate(product);
                            setShowReasonModal(true);
                          } else if (e.key === 'Escape') {
                            handleEditCancel();
                          }
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => handleEditStart(product)}
                        className="flex-1 py-2 bg-charcoal-200/50 border border-ivory-100/20 text-ivory-100 rounded-lg hover:bg-charcoal-200 transition-colors text-sm font-light"
                      >
                        {product.stockQuantity}
                      </button>
                    )}

                    <button
                      onClick={() => handleQuickAdjust(product, 1)}
                      className="flex-1 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors text-sm font-light"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleQuickAdjust(product, 5)}
                      className="flex-1 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors text-sm font-light"
                    >
                      +5
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-ivory-100/5">
                    <span className="text-xs text-ivory-100/40 capitalize">{product.category}</span>
                    <button
                      onClick={() => fetchHistory(product)}
                      className="flex items-center gap-1.5 text-xs text-ivory-100/50 hover:text-gold-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      History
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-charcoal-100/30 border border-ivory-100/10 text-ivory-100/70 rounded-lg hover:bg-charcoal-100/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="px-4 py-2 text-ivory-100/70 font-light">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 bg-charcoal-100/30 border border-ivory-100/10 text-ivory-100/70 rounded-lg hover:bg-charcoal-100/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reason Modal */}
      <AnimatePresence>
        {showReasonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-300/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-charcoal-200/95 border border-ivory-100/10 rounded-2xl p-6 backdrop-blur-xl"
            >
              <h3 className="heading-4 text-ivory-100 mb-4">Update Stock</h3>
              <p className="text-ivory-100/70 font-light mb-4">
                Changing stock from <span className="text-gold-300">{pendingUpdate?.stockQuantity}</span> to <span className="text-gold-300">{editValue}</span>
              </p>
              <input
                type="text"
                placeholder="Reason for adjustment (optional)"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                className="w-full px-4 py-3 bg-charcoal-300/50 border border-ivory-100/10 text-ivory-100 placeholder-charcoal-400 focus:outline-none focus:border-gold-300 transition-colors rounded-xl mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleEditCancel}
                  className="flex-1 py-3 border border-ivory-100/20 text-ivory-100/70 rounded-xl hover:border-ivory-100/40 transition-colors font-light"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditConfirm}
                  className="flex-1 py-3 bg-gold-300 text-charcoal-300 rounded-xl hover:bg-gold-200 transition-colors font-medium"
                >
                  Confirm Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-300/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[80vh] bg-charcoal-200/95 border border-ivory-100/10 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col"
            >
              <div className="p-6 border-b border-ivory-100/10 flex items-center justify-between">
                <div>
                  <h3 className="heading-4 text-ivory-100">Stock History</h3>
                  <p className="text-ivory-100/50 font-light text-sm mt-1">{historyProduct?.name}</p>
                </div>
                <button
                  onClick={() => { setShowHistoryModal(false); setHistoryProduct(null); setHistoryLogs([]); }}
                  className="w-10 h-10 rounded-xl bg-charcoal-300/50 flex items-center justify-center text-ivory-100/50 hover:text-ivory-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {historyLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="skeleton h-16 rounded-xl" />
                    ))}
                  </div>
                ) : historyLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 mx-auto mb-4 text-ivory-100/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-ivory-100/40">No history available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historyLogs.map((log) => (
                      <div key={log._id} className="flex items-center justify-between p-4 bg-charcoal-300/30 border border-ivory-100/5 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            log.quantityChanged > 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
                          }`}>
                            <span className={`font-serif text-lg ${log.quantityChanged > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {log.quantityChanged > 0 ? '+' : ''}{log.quantityChanged}
                            </span>
                          </div>
                          <div>
                            <p className={`text-sm font-light ${getChangeTypeColor(log.changeType)}`}>
                              {getChangeTypeLabel(log.changeType)}
                            </p>
                            <p className="text-xs text-ivory-100/40 mt-0.5">
                              {log.previousQuantity} → {log.newQuantity}
                            </p>
                            {log.reason && (
                              <p className="text-xs text-ivory-100/50 mt-1">{log.reason}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-ivory-100/40">
                            {new Date(log.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-ivory-100/30 mt-0.5">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </p>
                          {log.user && (
                            <p className="text-xs text-ivory-100/40 mt-1">
                              by {log.user.name}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminInventory;
