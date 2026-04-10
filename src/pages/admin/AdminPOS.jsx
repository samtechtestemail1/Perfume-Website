import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../../context/CartContext';

const AdminPOS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [processing, setProcessing] = useState(false);
  const { clearCart } = useCart();

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
      fetchProducts(); // Refresh stock
      alert('Sale completed successfully!');
    } catch (error) {
      console.error('Failed to complete sale:', error);
      alert('Failed to complete sale. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-20 bg-dark-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-serif font-bold text-dark-900 mb-2">Point of Sale</h1>
          <p className="text-dark-600">Process in-person sales</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field"
                />
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 bg-dark-100 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => addToCart(product)}
                      className="p-4 bg-dark-50 rounded-xl hover:bg-dark-100 transition-colors text-left"
                    >
                      <div className="aspect-square bg-dark-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        {product.images?.[0]?.url ? (
                          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl">📦</span>
                        )}
                      </div>
                      <p className="font-medium text-dark-900 text-sm line-clamp-1">{product.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gold-600 font-semibold">${product.price}</span>
                        <span className="text-xs text-dark-400">Stock: {product.stockQuantity}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-dark-900 mb-4">Current Sale</h2>

            {/* Customer Info */}
            <div className="mb-4 space-y-2">
              <input
                type="text"
                placeholder="Customer Name (optional)"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="input-field text-sm py-2"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="input-field text-sm py-2"
              />
            </div>

            {/* Cart Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {cart.length === 0 ? (
                <p className="text-center text-dark-400 py-8">Cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 p-3 bg-dark-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-dark-900 text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-dark-500">${item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 bg-white rounded flex items-center justify-center text-dark-600 hover:bg-dark-200"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 bg-white rounded flex items-center justify-center text-dark-600 hover:bg-dark-200"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-dark-200 pt-4 space-y-2">
              <div className="flex justify-between text-dark-600">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-dark-600">
                <span>Tax (8%)</span>
                <span>${getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-dark-900 pt-2 border-t border-dark-200">
                <span>Total</span>
                <span className="text-gold-600">${getGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={completeSale}
                disabled={cart.length === 0 || processing}
                className="w-full py-4 bg-gradient-to-r from-gold-400 to-gold-500 text-dark-900 rounded-xl font-bold uppercase tracking-wider hover:from-gold-500 hover:to-gold-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Complete Sale'}
              </button>
              <button
                onClick={() => setCart([])}
                disabled={cart.length === 0}
                className="w-full py-3 border-2 border-dark-200 text-dark-600 rounded-xl font-semibold hover:bg-dark-50 transition-colors disabled:opacity-50"
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
