import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: 'Premium Quality',
      description: 'Every fragrance crafted with the finest ingredients from around the world'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Long Lasting',
      description: 'Designed to last throughout the day with exceptional sillage'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: '100% Authentic',
      description: 'Guaranteed genuine products with quality certification'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: 'Luxury Packaging',
      description: 'Beautifully presented in elegant gift boxes'
    }
  ];

  const timeline = [
    { year: '2010', title: 'Our Beginning', desc: 'Founded with a vision to bring luxury fragrances to everyone' },
    { year: '2015', title: 'Global Expansion', desc: 'Expanded to serve customers in over 50 countries' },
    { year: '2020', title: 'Online Launch', desc: 'Launched our e-commerce platform with exclusive collections' },
    { year: '2024', title: 'Innovation', desc: 'Introduced AI-powered fragrance recommendations' }
  ];

  return (
    <div className="pt-24 lg:pt-28 bg-neutral-50">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-white border-b border-neutral-100">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-caption text-neutral-400 mb-4"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-1 text-neutral-900"
          >
            About Us
          </motion.h1>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-caption text-neutral-400 mb-6">Our Mission</p>
              <h2 className="heading-2 text-neutral-900 mb-8">
                Where Artistry Meets
                <br />
                <span className="italic font-serif text-neutral-400">Excellence</span>
              </h2>
              <div className="space-y-6 text-neutral-600 leading-relaxed">
                <p>
                  At Luxe Perfume, we believe that fragrance is more than just a scent—it's an expression of personality, a memory waiting to be created, and a form of self-expression that speaks volumes without saying a word.
                </p>
                <p>
                  Our master perfumers travel the world to source the finest ingredients, from the rose fields of Grasse to the oud forests of Southeast Asia. Each fragrance is a work of art, meticulously crafted to deliver an unforgettable experience.
                </p>
              </div>
              <Link to="/shop" className="btn-primary mt-10">
                Explore Collection
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800"
                  alt="Luxury Perfume Collection"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 lg:py-32 bg-neutral-50">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-caption text-neutral-400 mb-4">Why Choose Us</p>
            <h2 className="heading-2 text-neutral-900">The Difference</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8"
              >
                <div className="w-12 h-12 flex items-center justify-center text-neutral-900 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '500+', label: 'Fragrances' },
              { value: '15+', label: 'Years Experience' },
              { value: '100%', label: 'Authentic' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-light mb-2">{stat.value}</div>
                <div className="text-sm text-neutral-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 text-neutral-900 mb-6">
              Ready to Find Your
              <br />
              <span className="italic font-serif text-neutral-400">Signature</span>?
            </h2>
            <p className="text-body max-w-xl mx-auto mb-10">
              Explore our collection of exceptional fragrances and find the perfect scent that speaks to you.
            </p>
            <Link to="/shop" className="btn-primary">
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
