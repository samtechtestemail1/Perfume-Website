import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: 'Crafted Excellence',
      description: 'Every fragrance is a masterpiece, meticulously crafted by master perfumers with decades of experience'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Rare Ingredients',
      description: 'Sourced from the finest rose fields of Grasse, oud forests of Southeast Asia, and aromatic gardens worldwide'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Long Lasting',
      description: 'Designed to linger throughout the day with exceptional sillage, evolving beautifully on your skin'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: '100% Authentic',
      description: 'Guaranteed genuine products with quality certification and authenticity guarantee on every purchase'
    }
  ];

  const timeline = [
    { year: '2010', title: 'Our Beginning', desc: 'Founded with a vision to bring luxury fragrances to everyone' },
    { year: '2015', title: 'Global Expansion', desc: 'Expanded to serve customers in over 50 countries' },
    { year: '2020', title: 'Online Launch', desc: 'Launched our e-commerce platform with exclusive collections' },
    { year: '2024', title: 'Innovation', desc: 'Introduced AI-powered fragrance recommendations' }
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="pt-24 lg:pt-28 bg-charcoal-300">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-200/50 to-charcoal-300" />
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-300 rounded-full blur-[128px]" />
          </div>
        </div>
        
        <div className="relative container mx-auto px-6 lg:px-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label mb-6"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="heading-display text-ivory-100 mb-8"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="body-lg text-ivory-100/60 max-w-2xl mx-auto"
          >
            A legacy of olfactory excellence, crafting scents that become part of your story
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 lg:py-40">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="section-label mb-6">Our Philosophy</p>
              <h2 className="heading-1 text-ivory-100 mb-8">
                Where Artistry Meets
                <br />
                <span className="italic text-gradient-gold">Excellence</span>
              </h2>
              <div className="space-y-6 text-ivory-100/60 leading-relaxed body-lg">
                <p>
                  At Luxe Parfums, we believe that fragrance is more than just a scent—it's an expression of personality, a memory waiting to be created, and a form of self-expression that speaks volumes without saying a word.
                </p>
                <p>
                  Our master perfumers travel the world to source the finest ingredients, from the rose fields of Grasse to the oud forests of Southeast Asia. Each fragrance is a work of art, meticulously crafted to deliver an unforgettable experience.
                </p>
              </div>
              <Link to="/shop" className="btn-primary mt-12 rounded-xl">
                Explore Collection
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1000&q=90"
                  alt="Luxury Perfume Collection"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-gold-300/10 rounded-2xl backdrop-blur-sm border border-gold-300/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-serif text-gold-300">15+</div>
                  <div className="text-xs uppercase tracking-ultra-wide text-ivory-100/60">Years of Excellence</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 lg:py-40 bg-charcoal-200">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="bg-charcoal-50/50 backdrop-blur-sm border border-ivory-100/10 rounded-2xl p-8 lg:p-10 text-center card-hover"
              >
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-gold-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-serif text-ivory-100 mb-3">{feature.title}</h3>
                <p className="text-ivory-100/50 font-light leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-charcoal-300/90" />
        </div>
        
        <div className="relative container mx-auto px-6 lg:px-16">
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
                <div className="text-4xl lg:text-6xl font-serif text-gold-300 mb-3">{stat.value}</div>
                <div className="text-sm uppercase tracking-ultra-wide text-ivory-100/50">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 lg:py-40">
        <div className="container mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-24"
          >
            <p className="section-label mb-4">Our Journey</p>
            <h2 className="heading-2 text-ivory-100">
              A Legacy of
              <span className="italic text-gradient-gold"> Innovation</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-ivory-100/10 hidden lg:block" />
              
              <div className="space-y-12 lg:space-y-0">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className={`lg:flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  >
                    <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                      <div className="bg-charcoal-50/50 backdrop-blur-sm border border-ivory-100/10 rounded-2xl p-8">
                        <div className="text-4xl font-serif text-gold-300 mb-3">{item.year}</div>
                        <h3 className="text-xl font-serif text-ivory-100 mb-2">{item.title}</h3>
                        <p className="text-ivory-100/50 font-light">{item.desc}</p>
                      </div>
                    </div>
                    <div className="hidden lg:flex w-4 h-4 bg-gold-300 rounded-full border-4 border-charcoal-300 relative z-10" />
                    <div className="lg:w-1/2" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-40 bg-charcoal-200">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 text-ivory-100 mb-6">
              Ready to Find Your
              <br />
              <span className="italic text-gradient-gold">Signature</span>?
            </h2>
            <p className="body-lg text-ivory-100/60 max-w-xl mx-auto mb-12">
              Explore our collection of exceptional fragrances and find the perfect scent that speaks to you.
            </p>
            <Link to="/shop" className="btn-primary rounded-xl">
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
