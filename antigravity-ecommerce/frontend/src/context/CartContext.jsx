import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Fetch cart from DB (called after login)
  const fetchCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const { data } = await api.get('/cart');
      setCartItems(data);
    } catch {
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, []);

  const addToCart = async (product, qty = 1, selectedOptions = {}) => {
    try {
      const { data } = await api.post('/cart', {
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price: product.basePrice,
        qty,
        selectedOptions,
      });
      setCartItems(data);
      return true;
    } catch (err) {
      console.error('Add to cart failed:', err?.response?.data?.message || err.message);
      throw err; // re-throw so caller can handle
    }
  };

  const handleQuantityChange = async (productId, newQty) => {
    try {
      const { data } = await api.put(`/cart/${productId}`, { qty: newQty });
      setCartItems(data);
    } catch (err) {
      console.error('Update qty failed:', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCartItems(data);
    } catch (err) {
      console.error('Remove from cart failed:', err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCartItems([]);
    } catch {
      setCartItems([]);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        fetchCart,
        addToCart,
        handleQuantityChange,
        removeFromCart,
        clearCart,
        subtotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
