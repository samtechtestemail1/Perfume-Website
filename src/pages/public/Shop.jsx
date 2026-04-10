import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
    inStock: false
  });

  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.inStock) params.append('inStock', 'true');

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const categories = [
    { name: 'perfume', label: 'Perfumes' },
    { name: 'oil', label: 'Oils' },
    { name: 'gift set', label: 'Gift Sets' },
    { name: 'accessories', label: 'Accessories' }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  return (
    <div className="pt-24 lg:pt-28 bg-charcoal-300 min-h-screen">
      {/* Hero Header */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-200/50 to-charcoal-300" />
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-300 rounded-full blur-[128px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-200 rounded-full blur-[128px]" />
          </div>
        </div>
        
        <div className="relative container mx-auto px-6 lg:px-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label mb-6"
          >
            Our Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-display text-ivory-100 mb-8"
          >
            Shop
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="body-lg text-ivory-100/60 max-w-2xl mx-auto"
          >
            Discover our curated collection of exceptional fragrances, each crafted with passion and precision
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-16 pb-24 lg:pb-32">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="lg:sticky lg:top-32">
              <div className="bg-charcoal-50/50 backdrop-blur-sm border border-ivory-100/10 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="heading-4 text-ivory-100">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-ivory-100/50 hover:text-ivory-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                  <h4 className="section-label mb-4">Category</h4>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === ''}
                        onChange={() => handleFilterChange('category', '')}
                        className="w-4 h-4 rounded-full border border-ivory-100/30 text-gold-300 focus:ring-gold-300 focus:ring-offset-0 focus:ring-offset-charcoal-300"
                      />
                      <span className="ml-3 text-sm text-ivory-100/70 group-hover:text-ivory-100 transition-colors">All Products</span>
                    </label>
                    {categories.map((cat) => (
                      <label key={cat.name} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category === cat.name}
                          onChange={() => handleFilterChange('category', cat.name)}
                          className="w-4 h-4 rounded-full border border-ivory-100/30 text-gold-300 focus:ring-gold-300 focus:ring-offset-0 focus:ring-offset-charcoal-300"
                        />
                        <span className="ml-3 text-sm text-ivory-100/70 group-hover:text-ivory-100 transition-colors capitalize">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-8">
                  <h4 className="section-label mb-4">Price Range</h4>
                  <div className="flex gap-3 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-4 py-3 bg-charcoal-300 border border-ivory-100/10 text-ivory-100 text-sm placeholder-charcoal-400 focus:outline-none focus:border-gold-300 transition-colors rounded-lg"
                    />
                    <span className="text-ivory-100/30">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-4 py-3 bg-charcoal-300 border border-ivory-100/10 text-ivory-100 text-sm placeholder-charcoal-400 focus:outline-none focus:border-gold-300 transition-colors rounded-lg"
                    />
                  </div>
                </div>

                {/* Stock Filter */}
                <div className="mb-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="w-4 h-4 rounded border border-ivory-100/30 text-gold-300 focus:ring-gold-300 focus:ring-offset-0 focus:ring-offset-charcoal-300 bg-charcoal-300"
                    />
                    <span className="ml-3 text-sm text-ivory-100/70">In Stock Only</span>
                  </label>
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setFilters({
                      category: '',
                      minPrice: '',
                      maxPrice: '',
                      sort: '-createdAt',
                      inStock: false
                    });
                    setSearchParams({});
                  }}
                  className="w-full py-3 text-sm text-ivory-100/50 hover:text-gold-300 border border-ivory-100/10 hover:border-gold-300/30 transition-colors rounded-lg"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <p className="text-sm text-ivory-100/50 font-light">
                {loading ? (
                  <span className="inline-block w-24 h-4 bg-charcoal-50/50 animate-pulse rounded" />
                ) : (
                  <>{pagination.totalProducts || 0} Products</>
                )}
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 text-sm border border-ivory-100/20 text-ivory-100/70 hover:text-ivory-100 hover:border-ivory-100/40 transition-colors rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>

                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="px-4 py-2.5 text-sm border border-ivory-100/20 focus:outline-none focus:border-gold-300 transition-colors bg-charcoal-50/50 text-ivory-100/70 rounded-lg"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-ratings.average">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton h-[450px] rounded-2xl" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-charcoal-50/50 backdrop-blur-sm border border-ivory-100/10 rounded-2xl p-16 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-charcoal-100/50">
                  <svg className="w-10 h-10 text-ivory-100/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-ivory-100/50 mb-6">No products found matching your criteria</p>
                <button
                  onClick={() => {
                    setFilters({
                      category: '',
                      minPrice: '',
                      maxPrice: '',
                      sort: '-createdAt',
                      inStock: false
                    });
                    setSearchParams({});
                  }}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                  <AnimatePresence>
                    {products.map((product) => (
                      <motion.div
                        key={product._id}
                        variants={fadeInUp}
                        onMouseEnter={() => setHoveredProduct(product._id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                      >
                        <Link to={`/product/${product._id}`} className="group block">
                          {/* Image Container */}
                          <div className="relative aspect-[3/4] overflow-hidden bg-charcoal-100 rounded-2xl mb-6">
                            {product.images?.[0]?.url ? (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-6xl text-charcoal-400">✦</span>
                              </div>
                            )}
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-300/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                              {product.isFeatured && (
                                <span className="badge badge-gold">Featured</span>
                              )}
                              {product.stockQuantity === 0 && (
                                <span className="badge bg-red-500/90 text-white">Sold Out</span>
                              )}
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="badge bg-red-500/90 text-white">
                                  -{Math.round((1 - product.price/product.originalPrice) * 100)}%
                                </span>
                              )}
                            </div>
                            
                            {/* Wishlist Button */}
                            <button 
                              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-charcoal-300/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold-300 hover:text-charcoal-300 text-ivory-100"
                              onClick={(e) => e.preventDefault()}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                            
                            {/* Quick Add Button */}
                            <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  addToCart(product);
                                }}
                                disabled={product.stockQuantity === 0}
                                className="w-full py-4 bg-ivory-100 text-charcoal-300 text-xs uppercase tracking-ultra-wide hover:bg-gold-300 transition-colors rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Bag'}
                              </button>
                            </div>
                          </div>
                          
                          {/* Product Info */}
                          <div>
                            <p className="section-label mb-2 text-stone-300 capitalize">{product.category}</p>
                            <h3 className="text-lg font-serif text-ivory-100 mb-2 group-hover:text-gold-300 transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className="text-ivory-100/80 font-light">${product.price}</span>
                              {product.originalPrice && (
                                <span className="text-ivory-100/40 line-through text-sm">${product.originalPrice}</span>
                              )}
                            </div>
                            
                            {/* Rating */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex text-gold-300">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className="w-3 h-3" fill={i < Math.round(product.ratings?.average || 0) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-ivory-100/40 text-xs">({product.ratings?.count || 0})</span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-16">
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', Math.max(1, pagination.currentPage - 1));
                        setSearchParams(params);
                      }}
                      disabled={!pagination.hasPrevPage}
                      className="w-10 h-10 flex items-center justify-center border border-ivory-100/20 text-ivory-100/70 hover:border-ivory-100/40 hover:text-ivory-100 transition-colors rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams);
                          params.set('page', page);
                          setSearchParams(params);
                        }}
                        className={`w-10 h-10 flex items-center justify-center text-sm transition-colors rounded-lg ${
                          pagination.currentPage === page
                            ? 'bg-gold-300 text-charcoal-300'
                            : 'border border-ivory-100/20 text-ivory-100/70 hover:border-ivory-100/40 hover:text-ivory-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', pagination.currentPage + 1);
                        setSearchParams(params);
                      }}
                      disabled={!pagination.hasNextPage}
                      className="w-10 h-10 flex items-center justify-center border border-ivory-100/20 text-ivory-100/70 hover:border-ivory-100/40 hover:text-ivory-100 transition-colors rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
