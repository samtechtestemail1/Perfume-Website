import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=90"
          alt="Luxury Perfume"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-300/50 to-transparent" />
        
        {/* Logo */}
        <div className="absolute top-12 left-12">
          <Link to="/" className="flex flex-col items-start">
            <span className="text-2xl font-serif text-ivory-100 tracking-wide">LUXE</span>
            <span className="text-2xs uppercase tracking-ultra-wide text-gold-300 -mt-1">Parfums</span>
          </Link>
        </div>

        {/* Quote */}
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-2xl font-serif text-ivory-100 italic leading-relaxed">
            "Fragrance is the most intimate and lasting memory we can give to someone."
          </p>
          <p className="text-ivory-100/50 text-sm mt-4">— Unknown</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16 bg-charcoal-300">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo - Mobile */}
          <div className="lg:hidden mb-12">
            <Link to="/" className="flex flex-col items-start">
              <span className="text-2xl font-serif text-ivory-100 tracking-wide">LUXE</span>
              <span className="text-2xs uppercase tracking-ultra-wide text-gold-300 -mt-1">Parfums</span>
            </Link>
          </div>

          <div className="mb-12">
            <h1 className="heading-3 text-ivory-100 mb-3">Welcome Back</h1>
            <p className="text-ivory-100/50 font-light">Sign in to your account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-900/20 border border-red-500/30 text-red-400 text-sm rounded-xl"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="input-label">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field rounded-xl"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="input-label mb-0">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-gold-300 hover:text-gold-200 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field rounded-xl"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-6 my-10">
            <div className="flex-1 h-px bg-ivory-100/10" />
            <span className="text-ivory-100/30 text-xs">or</span>
            <div className="flex-1 h-px bg-ivory-100/10" />
          </div>

          {/* Social Login */}
          <button className="w-full py-4 border border-ivory-100/20 text-ivory-100/70 text-sm font-light rounded-xl hover:border-ivory-100/40 hover:text-ivory-100 transition-all flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-10 text-center">
            <p className="text-ivory-100/50 font-light">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-gold-300 hover:text-gold-200 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
