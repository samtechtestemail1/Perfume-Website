import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(null);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.03;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-charcoal-300 pt-24 lg:pt-28">
        <div className="container mx-auto px-6 lg:px-16 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center"
          >
              <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-32 h-32 mx-auto mb-8 bg-charcoal-100/50 rounded-full flex items-center justify-center"
            >
              <svg className="w-16 h-16 text-ivory-100/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-serif text-ivory-100 mb-4">Your Bag is Empty</h1>
            <p className="text-ivory-100/50 mb-8 font-light">
              Discover our exquisite collection of luxury fragrances and find your perfect scent.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold-300 text-charcoal-300 rounded-xl font-medium hover:bg-gold-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleRemove = (productId) => {
    setIsRemoving(productId);
    setTimeout(() => {
      removeFromCart(productId);
      setIsRemoving(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-charcoal-300 pt-24 lg:pt-28">
      <div className="container mx-auto px-6 lg:px-16 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl font-serif text-ivory-100 mb-2">Shopping Bag</h1>
          <p className="text-ivory-100/50 font-light">
            {cart.length} {cart.length === 1 ? 'item' : 'items'}
          </p>
        </motion.div>

        <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.product._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: isRemoving === item.product._id ? 0 : 1,
                      x: isRemoving === item.product._id ? -50 : 0
                    }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-4 lg:p-6 backdrop-blur-sm"
                  >
                    <div className="flex gap-4 lg:gap-6">
                      <Link to={`/product/${item.product._id}`} className="flex-shrink-0">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 bg-charcoal-100 rounded-xl overflow-hidden">
                          {item.product.images?.[0]?.url ? (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-charcoal-400 text-3xl">
                              ✦
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between">
                          <div>
                            <Link
                              to={`/product/${item.product._id}`}
                              className="text-lg font-serif text-ivory-100 hover:text-gold-300 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-ivory-100/50 text-sm mt-1 capitalize">
                              {item.product.category}
                              {item.product.size && ` • ${item.product.size}`}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemove(item.product._id)}
                            className="text-ivory-100/40 hover:text-red-400 transition-colors p-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <div className="flex items-center bg-charcoal-200/50 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="p-3 text-ivory-100/60 hover:text-ivory-100 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="px-4 text-ivory-100 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="p-3 text-ivory-100/60 hover:text-ivory-100 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-serif text-gold-300">
                              {formatCurrency(item.product.price * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-ivory-100/40 text-sm">
                                {formatCurrency(item.product.price)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={clearCart}
                className="text-ivory-100/50 hover:text-red-400 text-sm transition-colors"
              >
                Clear Bag
              </button>
              <Link
                to="/shop"
                className="flex items-center gap-2 text-gold-300 hover:text-gold-200 text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-charcoal-100/30 border border-ivory-100/10 rounded-2xl p-6 backdrop-blur-sm sticky top-32">
              <h2 className="text-xl font-serif text-ivory-100 mb-6">Order Summary</h2>

              <div className="space-y-4 pb-6 border-b border-ivory-100/10">
                <div className="flex justify-between text-ivory-100/70 font-light">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ivory-100/70 font-light">
                  <span>Shipping</span>
                  <span className="text-emerald-400">Free</span>
                </div>
                <div className="flex justify-between text-ivory-100/70 font-light">
                  <span>Tax (3%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-ivory-100/10">
                  <span className="text-ivory-100 font-medium">Total</span>
                  <span className="text-2xl font-serif text-gold-300">{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 flex items-center justify-center gap-3 px-6 py-4 bg-gold-300 text-charcoal-300 rounded-xl font-medium hover:bg-gold-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Proceed to Checkout
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-ivory-100/30 text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure checkout powered by Luxury Perfume</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
