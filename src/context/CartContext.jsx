import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  loading: false
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product._id === action.payload.product._id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product._id === action.payload.product._id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.payload.product, quantity: action.payload.quantity || 1 }]
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product._id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product._id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    if (isAuthenticated && token) {
      syncCartWithBackend();
    }
  }, [isAuthenticated, token]);

  const syncCartWithBackend = async () => {
    try {
      // Load cart from backend if needed
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  };

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity }
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: productId
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const checkout = async (shippingAddress) => {
    try {
      const orderData = {
        items: state.cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod: 'cod'
      };

      const response = await api.post('/orders', orderData);

      clearCart();
      return { success: true, order: response.data.order };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Checkout failed'
      };
    }
  };

  return (
    <CartContext.Provider value={{
      cart: state.cart,
      loading: state.loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
