import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider, setCartCallbacks } from './context/AuthContext'
import { CartProvider, useCart } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'

// Bridge component to wire cart callbacks into AuthContext
const CartBridge = () => {
  const { fetchCart, clearCart } = useCart();
  React.useEffect(() => {
    setCartCallbacks(fetchCart, clearCart);
  }, [fetchCart, clearCart]);
  return null;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <CartBridge />
            <App />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
