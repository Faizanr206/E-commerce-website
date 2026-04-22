import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Trash2, Plus, Minus, CreditCard, ChevronLeft } from 'lucide-react';

const Cart = () => {
  const { cartItems, handleQuantityChange, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const formattedPrice = (amount) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/checkout/create-session', {
        cartItems,
        shippingDetails: {
          address: '123 Space Way',
          city: 'Karachi',
          postalCode: '74200',
          country: 'Pakistan',
        },
      });
      window.location.href = data.url;
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-6">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Your Basket is Empty</h2>
        <p className="text-muted text-lg max-w-md">No toys detected in your current selection. Start the adventure.</p>
        <Link to="/" className="px-8 py-4 bg-accent text-white rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
          Return to Playroom
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Selection Basket ({cartItems.length})</h2>
        {cartItems.map((item) => (
          <div key={item.product} className="glass p-6 rounded-3xl flex items-center gap-6 group">
            <Link to={`/product/${item.product}`} className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-glass-border">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </Link>
            
            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.product}`} className="text-xl font-bold truncate block hover:text-accent transition-colors">
                {item.name}
              </Link>
              <p className="text-accent font-black text-lg mt-1">{formattedPrice(item.price)}</p>
            </div>

            <div className="flex items-center gap-3 bg-bg/50 px-3 py-2 rounded-xl border border-glass-border">
              <button
                onClick={() => handleQuantityChange(item.product, item.qty - 1)}
                className="p-1 hover:text-accent transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>
              <span className="w-8 text-center font-bold">{item.qty}</span>
              <button
                onClick={() => handleQuantityChange(item.product, item.qty + 1)}
                className="p-1 hover:text-accent transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={18} />
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.product)}
              className="p-3 text-muted hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        <Link to="/" className="flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-sm hover:translate-x-[-4px] transition-transform">
          <ChevronLeft size={18} />
          Continue Exploring
        </Link>
      </div>

      <div className="lg:col-span-1">
        <div className="glass p-8 rounded-3xl sticky top-24 flex flex-col gap-8">
          <h3 className="text-2xl font-black uppercase tracking-tighter">Order Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between text-muted font-medium">
              <span>Subtotal</span>
              <span>{formattedPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted font-medium">
              <span>Delivery Fee (Shipping)</span>
              <span className="text-green-500">FREE</span>
            </div>
            <div className="h-px bg-glass-border my-2" />
            <div className="flex justify-between text-2xl font-black text-accent">
              <span>Total</span>
              <span>{formattedPrice(subtotal)}</span>
            </div>
          </div>

          {!user ? (
            <Link to="/login" className="w-full bg-accent text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-center shadow-lg shadow-accent/20 hover:opacity-90 transition-all flex items-center justify-center gap-3">
              Login to Checkout
              <CreditCard size={20} />
            </Link>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-accent text-white py-5 rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-accent/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? 'Securing Transaction...' : 'Confirm Adventure'}
              <CreditCard size={20} />
            </button>
          )}

          <p className="text-xs text-center text-muted uppercase tracking-widest font-medium">
            Secured by LittleLegends-Stripe Protocol
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
