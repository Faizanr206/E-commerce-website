import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// fetchCart is injected from CartContext via a setter
let _fetchCart = null;
let _clearCart = null;

export const setCartCallbacks = (fetchCart, clearCart) => {
  _fetchCart = fetchCart;
  _clearCart = clearCart;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setUser(data);
        if (_fetchCart) _fetchCart();
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    setUser(data);
    if (_fetchCart) _fetchCart();
    return data;
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post('/users', { name, email, password });
    setUser(data);
    if (_fetchCart) _fetchCart();
    return data;
  };

  const logout = async () => {
    if (_clearCart) await _clearCart();
    await api.post('/users/logout');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const { data } = await api.put('/users/profile', profileData);
    setUser(data);
    return data;
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
