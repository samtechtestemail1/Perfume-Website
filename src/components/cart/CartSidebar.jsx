import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const CartSidebar = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  return (
    <AnimatePresence>
      {cart.length > 0 && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => document.dispatchEvent(new CustomEvent('toggle-cart'))}
            className="fixed inset-0 bg-charcoal-500/80 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-charcoal-300 shadow-soft-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-ivory-100/10">
              <div>
                <h2 className="text-lg font-serif text-ivory-100">Your Bag</h2>
                <p className="text-xs text-ivory-100/50 mt-1">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('toggle-cart'))}
                className="text-ivory-100/70 hover:text-ivory-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.map((item) => (
                <motion.div
                  key={item.product._id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4"
                >
                  <div className="w-24 h-24 bg-charcoal-100 overflow-hidden flex-shrink-0 rounded-xl">
                    {item.product.images?.[0]?.url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="text-sm font-serif text-ivory-100 mb-1 line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-ivory-100/60 text-sm font-light mb-auto">
                      ${item.product.price}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-ivory-100/20 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="px-3 py-1 text-ivory-100/60 hover:text-ivory-100 transition-colors"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-ivory-100 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="px-3 py-1 text-ivory-100/60 hover:text-ivory-100 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="ml-auto text-ivory-100/40 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-ivory-100/10 p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-ivory-100/60">Subtotal</span>
                <span className="text-ivory-100 font-light">${getCartTotal().toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm text-ivory-100/40">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="pt-4 space-y-3">
                <Link
                  to="/checkout"
                  className="btn-primary w-full text-center rounded-xl"
                >
                  Checkout
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full py-3 text-sm text-ivory-100/50 hover:text-ivory-100/80 transition-colors"
                >
                  Clear Bag
                </button>
              </div>

              <p className="text-center text-ivory-100/30 text-xs">
                Free shipping on orders over $100
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
