import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products/featured');
        setFeaturedProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const bestSellers = [
    { id: 1, name: "Noir Éternel", price: 149, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80", badge: "Bestseller" },
    { id: 2, name: "Rose Absolue", price: 129, image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&q=80", badge: "New" },
    { id: 3, name: "Oud Royale", price: 189, image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&q=80", badge: "Limited" },
    { id: 4, name: "Jasmine Noir", price: 159, image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80", badge: null },
  ];

  const testimonials = [
    { id: 1, quote: "The most captivating fragrance I've ever experienced. Every time I wear it, I feel transformed.", name: "Sarah Mitchell", title: "Fashion Editor", rating: 5 },
    { id: 2, quote: "Luxury Perfume has redefined what it means to wear elegance. Their attention to detail is unmatched.", name: "James Chen", title: "Art Director", rating: 5 },
    { id: 3, quote: "From the packaging to the scent itself, everything screams excellence and sophistication.", name: "Emma Laurent", title: "Lifestyle Blogger", rating: 5 },
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="bg-charcoal-300 overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1920&q=80"
            alt="Luxury Perfume"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 overlay-gradient-dark" />
          <div className="absolute inset-0 overlay-gradient-vignette" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-16 pt-32 pb-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.p 
              variants={fadeInUp}
              className="section-label mb-6"
            >
              Luxury Fragrance House
            </motion.p>
            
            <motion.h1 
              variants={fadeInUp}
              className="heading-display text-ivory-100 mb-8"
            >
              Define Your
              <br />
              <span className="text-gradient-gold italic">Signature</span>
              <br />
              Scent
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="body-lg text-ivory-100/70 mb-12 max-w-xl"
            >
              Crafted fragrances that embody identity, memory, and emotion. 
              Each bottle is a masterpiece waiting to become part of your story.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap gap-4"
            >
              <Link to="/shop" className="btn-primary">
                Explore Collection
              </Link>
              <Link to="/shop" className="btn-secondary">
                Discover Your Fragrance
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-24 lg:mt-32 grid grid-cols-3 gap-8 lg:gap-16 max-w-xl"
          >
            {[
              { value: '500+', label: 'Fragrances' },
              { value: '15+', label: 'Years' },
              { value: '50K+', label: 'Clients' }
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl lg:text-4xl font-serif text-ivory-100 mb-1">{stat.value}</div>
                <div className="text-2xs uppercase tracking-ultra-wide text-ivory-100/50">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <span className="text-2xs uppercase tracking-ultra-wide text-ivory-100/50 mb-3">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-gold-300 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== MARQUEE BRANDS ===== */}
      <section className="py-6 bg-charcoal-200 border-y border-ivory-100/5 overflow-hidden">
        <motion.div 
          className="flex gap-16 whitespace-nowrap"
          animate={{ x: [0, -50 + "%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-16">
              {['Chanel', 'Dior', 'Tom Ford', 'Jo Malone', 'Le Labo', 'Aesop', 'Byredo', 'Serge Lutens'].map((brand) => (
                <span key={brand} className="text-ivory-100/30 text-xs uppercase tracking-ultra-wide font-light">
                  {brand}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-24 lg:py-40">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-8 lg:mb-0">
              <p className="section-label mb-4">Curated Selection</p>
              <h2 className="heading-1 text-ivory-100">
                Featured
                <br />
                <span className="italic text-stone-300">Collection</span>
              </h2>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link to="/shop" className="btn-ghost group">
                <span>View All Products</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-[450px] rounded-2xl" />
              ))
            ) : (
              featuredProducts.slice(0, 4).map((product) => (
                <motion.div key={product._id} variants={fadeInUp}>
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
                          <span className="text-6xl text-charcoal-400">✦</span>
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

                      {/* Hover Quick Add */}
                      <div className="product-card-overlay flex items-end p-6">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          className="w-full py-4 bg-ivory-100 text-charcoal-300 text-xs uppercase tracking-ultra-wide hover:bg-gold-300 transition-colors rounded-xl"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="section-label mb-2 text-stone-300">{product.category}</p>
                      <h3 className="text-lg font-serif text-ivory-100 mb-2 group-hover:text-gold-300 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-ivory-100/60 font-light">${product.price}</p>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* ===== BRAND STORY SPLIT ===== */}
      <section className="min-h-screen flex flex-col lg:flex-row">
        {/* Left - Story */}
        <div className="lg:w-1/2 bg-charcoal-200 flex items-center py-24 lg:py-0">
          <div className="px-6 lg:px-16 xl:px-24 py-16 lg:py-0">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="section-label mb-6">Our Philosophy</p>
              <h2 className="heading-1 text-ivory-100 mb-8">
                Crafted for
                <br />
                <span className="italic text-gradient-gold">Extraordinary</span>
                <br />
                Moments
              </h2>
              <p className="body-lg text-ivory-100/60 mb-10 max-w-md leading-relaxed">
                Each fragrance in our collection is a masterpiece, meticulously crafted by master perfumers using the finest ingredients sourced from around the world.
              </p>
              <p className="body-lg text-ivory-100/60 mb-12 max-w-md leading-relaxed">
                From the rose fields of Grasse to the oud forests of Southeast Asia, we travel the globe to bring you extraordinary scents that become part of your story.
              </p>
              <Link to="/about" className="btn-secondary">
                Discover Our Story
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Right - Image */}
        <div className="lg:w-1/2 relative min-h-[50vh] lg:min-h-0">
          <img
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1000&q=80"
            alt="Perfume Crafting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 overlay-gradient-dark/30" />
        </div>
      </section>

      {/* ===== VALUE PROPS ===== */}
      <section className="py-24 lg:py-40 bg-charcoal-200">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-24"
          >
            <p className="section-label mb-4">Why Choose Us</p>
            <h2 className="heading-2 text-ivory-100">
              The Art of
              <span className="italic text-gradient-gold"> Excellence</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
                title: 'Crafted Excellence',
                desc: 'Every fragrance is a masterpiece, meticulously crafted by master perfumers'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Rare Ingredients',
                desc: 'Sourced from the finest rose fields, oud forests, and aromatic gardens'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Long-Lasting',
                desc: 'Designed to linger throughout the day with exceptional sillage'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: '100% Authentic',
                desc: 'Guaranteed genuine products with quality certification'
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-glass p-8 lg:p-10 text-center card-hover"
              >
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-gold-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-serif text-ivory-100 mb-3">{item.title}</h3>
                <p className="body-sm text-ivory-100/50">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BEST SELLERS ===== */}
      <section className="py-24 lg:py-40">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
          >
            <div className="mb-8 md:mb-0">
              <p className="section-label mb-4">Most Popular</p>
              <h2 className="heading-2 text-ivory-100">
                Best
                <span className="italic text-stone-300"> Sellers</span>
              </h2>
            </div>
            <Link to="/shop" className="btn-ghost group self-start">
              <span>View All</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {bestSellers.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to="/shop" className="block">
                  <div className="product-card-image mb-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {product.badge && (
                      <div className="absolute top-4 left-4">
                        <span className="badge badge-gold">{product.badge}</span>
                      </div>
                    )}

                    {/* Wishlist */}
                    <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-charcoal-300/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-ivory-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    <div className="product-card-overlay flex items-end p-6">
                      <button className="w-full py-4 bg-ivory-100 text-charcoal-300 text-xs uppercase tracking-ultra-wide hover:bg-gold-300 transition-colors rounded-xl">
                        Quick Add
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-serif text-ivory-100 mb-1">{product.name}</h3>
                  <p className="text-ivory-100/60 font-light">${product.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 lg:py-40 bg-charcoal-200">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            {/* Quote Icon */}
            <div className="text-center mb-12">
              <svg className="w-12 h-12 text-gold-300 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Testimonial */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif text-ivory-100 leading-relaxed mb-10 italic">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gold-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <div>
                  <p className="text-ivory-100 font-light">{testimonials[activeTestimonial].name}</p>
                  <p className="text-ivory-100/50 text-sm">{testimonials[activeTestimonial].title}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex items-center justify-center gap-3 mt-12">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'w-8 bg-gold-300' : 'bg-ivory-100/30 hover:bg-ivory-100/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-24 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 overlay-gradient-dark" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="section-label mb-4">Newsletter</p>
            <h2 className="heading-2 text-ivory-100 mb-6">
              Join the
              <span className="italic text-gradient-gold"> Fragrance House</span>
            </h2>
            <p className="body-lg text-ivory-100/60 mb-12">
              Subscribe to receive exclusive offers, early access to new collections, and curated fragrance recommendations.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-5 bg-charcoal-50/50 backdrop-blur-sm border border-ivory-100/20 text-ivory-100 placeholder-charcoal-400 focus:outline-none focus:border-gold-300 transition-colors rounded-xl"
              />
              <button type="submit" className="btn-primary whitespace-nowrap rounded-xl">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-charcoal-400 border-t border-ivory-100/5">
        <div className="container mx-auto px-6 lg:px-16 py-16 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <span className="text-2xl font-serif text-ivory-100 tracking-wide">LUXE</span>
                <span className="text-2xs uppercase tracking-ultra-wide text-gold-300 block -mt-1">Parfums</span>
              </div>
              <p className="text-ivory-100/50 font-light text-sm leading-relaxed max-w-xs mb-8">
                Crafting exceptional fragrances since 2010. Each scent tells a story, each bottle holds a universe of elegance.
              </p>
              <div className="flex gap-4">
                {['instagram', 'twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 border border-ivory-100/20 flex items-center justify-center text-ivory-100/50 hover:border-gold-300 hover:text-gold-300 transition-all rounded-full"
                  >
                    <span className="sr-only">{social}</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-2xs uppercase tracking-ultra-wide text-ivory-100/50 mb-6">Shop</h4>
              <ul className="space-y-4">
                {['All Products', 'Perfumes', 'Oils', 'Gift Sets', 'New Arrivals'].map((item) => (
                  <li key={item}>
                    <Link to="/shop" className="text-ivory-100/70 hover:text-ivory-100 transition-colors text-sm font-light">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-2xs uppercase tracking-ultra-wide text-ivory-100/50 mb-6">Company</h4>
              <ul className="space-y-4">
                {['About Us', 'Contact', 'Careers', 'Press'].map((item) => (
                  <li key={item}>
                    <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-ivory-100/70 hover:text-ivory-100 transition-colors text-sm font-light">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-2xs uppercase tracking-ultra-wide text-ivory-100/50 mb-6">Support</h4>
              <ul className="space-y-4">
                {['FAQ', 'Shipping', 'Returns', 'Track Order'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-ivory-100/70 hover:text-ivory-100 transition-colors text-sm font-light">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ivory-100/5">
          <div className="container mx-auto px-6 lg:px-16 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-ivory-100/30 text-xs font-light">
                © 2024 Luxe Parfums. All rights reserved.
              </p>
              <div className="flex gap-8">
                <a href="#" className="text-ivory-100/30 text-xs hover:text-ivory-100/50 transition-colors font-light">
                  Privacy Policy
                </a>
                <a href="#" className="text-ivory-100/30 text-xs hover:text-ivory-100/50 transition-colors font-light">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
