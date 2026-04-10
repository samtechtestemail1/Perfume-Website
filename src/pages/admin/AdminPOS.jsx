import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminPOS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products?inStock=true&limit=100');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stockQuantity) }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item._id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getTotal() * 0.08;
  };

  const getGrandTotal = () => {
    return getTotal() + getTax();
  };

  const completeSale = async () => {
    if (cart.length === 0) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/sales/in-person', {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity
        })),
        customerInfo,
        paymentMethod: 'cash'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCart([]);
      setCustomerInfo({ name: '', phone: '' });
      fetchProducts();
    } catch (error) {
      console.error('Failed to complete sale:', error);
    } finally {
      setProcessing(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-charcoal-300">
      <div className="bg-charcoal-200/50 border-b border-ivory-100/10">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="heading-3 text-ivory-100">Point of Sale</h1>
            <p className="text-ivory-100/50 font-light mt-1">Process in-person sales</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-2">
            <div className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-5 py-4 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 placeholder-charcoal-400 focus:outline-none focus:border-gold-300 transition-colors rounded-xl"
                />
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton h-40 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => addToCart(product)}
                      className="p-4 bg-charcoal-200/50 border border-ivory-100/10 rounded-xl hover:border-gold-300/30 hover:bg-charcoal-200/70 transition-all text-left"
                    >
                      <div className="aspect-square bg-charcoal-300/50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        {product.images?.[0]?.url ? (
                          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl text-charcoal-400">✦</span>
                        )}
                      </div>
                      <p className="text-ivory-100 font-medium text-sm line-clamp-1">{product.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gold-300 font-medium">${product.price}</span>
                        <span className="text-xs text-ivory-100/40">Stock: {product.stockQuantity}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-6 backdrop-blur-sm h-fit lg:sticky lg:top-8">
            <h2 className="heading-4 text-ivory-100 mb-6">Current Sale</h2>

            {/* Customer Info */}
            <div className="mb-6 space-y-3">
              <input
                type="text"
                placeholder="Customer Name (optional)"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full px-4 py-3 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 placeholder-charcoal-400 text-sm focus:outline-none focus:border-gold-300 transition-colors rounded-xl"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="w-full px-4 py-3 bg-charcoal-200/50 border border-ivory-100/10 text-ivory-100 placeholder-charcoal-400 text-sm focus:outline-none focus:border-gold-300 transition-colors rounded-xl"
              />
            </div>

            {/* Cart Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto mb-6 scrollbar-thin">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-charcoal-200/50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-ivory-100/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-ivory-100/40 text-sm">Cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 p-3 bg-charcoal-200/50 border border-ivory-100/5 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-ivory-100 font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-ivory-100/40">${item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 bg-charcoal-300/50 rounded-lg flex items-center justify-center text-ivory-100/60 hover:text-ivory-100 hover:bg-charcoal-300 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-ivory-100 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 bg-charcoal-300/50 rounded-lg flex items-center justify-center text-ivory-100/60 hover:text-ivory-100 hover:bg-charcoal-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-ivory-100/10 pt-4 space-y-3">
              <div className="flex justify-between text-ivory-100/70 font-light">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ivory-100/70 font-light">
                <span>Tax (8%)</span>
                <span>${getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-serif text-ivory-100 pt-3 border-t border-ivory-100/10">
                <span>Total</span>
                <span className="text-gold-300">${getGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={completeSale}
                disabled={cart.length === 0 || processing}
                className="w-full py-4 bg-gold-300 text-charcoal-300 rounded-xl font-medium uppercase tracking-ultra-wide hover:bg-gold-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Complete Sale'}
              </button>
              <button
                onClick={() => setCart([])}
                disabled={cart.length === 0}
                className="w-full py-3 border border-ivory-100/20 text-ivory-100/70 rounded-xl hover:border-ivory-100/40 hover:text-ivory-100 transition-colors text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPOS;
