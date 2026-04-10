import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

const Home = lazy(() => import('./pages/public/Home'));
const Shop = lazy(() => import('./pages/public/Shop'));
const ProductDetails = lazy(() => import('./pages/public/ProductDetails'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Dashboard = lazy(() => import('./pages/user/Dashboard'));
const Orders = lazy(() => import('./pages/user/Orders'));
const Profile = lazy(() => import('./pages/user/Profile'));
const Wishlist = lazy(() => import('./pages/user/Wishlist'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminPOS = lazy(() => import('./pages/admin/AdminPOS'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const Checkout = lazy(() => import('./pages/public/Checkout'));
const CartPage = lazy(() => import('./pages/public/CartPage'));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password/:token" element={<ResetPassword />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="wishlist" element={<Wishlist />} />
                </Route>
              </Route>

              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="admin/products" element={<AdminProducts />} />
                  <Route path="admin/orders" element={<AdminOrders />} />
                  <Route path="admin/users" element={<AdminUsers />} />
                  <Route path="admin/inventory" element={<AdminInventory />} />
                  <Route path="admin/coupons" element={<AdminCoupons />} />
                  <Route path="admin/pos" element={<AdminPOS />} />
                  <Route path="admin/analytics" element={<AdminAnalytics />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
