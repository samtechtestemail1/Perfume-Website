import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isAuthenticated && product.stockQuantity > 0) {
      addToCart(product);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product._id}`} className="group block">
        <div className="product-card-image mb-6">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isFeatured && (
              <span className="badge badge-gold">Featured</span>
            )}
            {product.stockQuantity === 0 && (
              <span className="badge badge-outline">Sold Out</span>
            )}
          </div>

          {/* Wishlist */}
          <button 
            onClick={(e) => e.preventDefault()} 
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-charcoal-300/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold-300 hover:text-charcoal-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Hover Overlay with Quick Add */}
          <div className="product-card-overlay flex items-end p-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0 || !isAuthenticated}
              className="w-full py-4 bg-ivory-100 text-charcoal-300 text-xs uppercase tracking-ultra-wide hover:bg-gold-300 transition-colors rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!isAuthenticated ? 'Login to Add' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <p className="section-label mb-2 text-stone-300">{product.category}</p>
          <h3 className="text-lg font-serif text-ivory-100 mb-2 group-hover:text-gold-300 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex text-gold-300">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-3 h-3"
                  fill={i < Math.round(product.ratings?.average || 0) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-ivory-100/40 text-xs">
              ({product.ratings?.count || 0})
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-ivory-100 font-light">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-ivory-100/40 line-through text-sm">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
