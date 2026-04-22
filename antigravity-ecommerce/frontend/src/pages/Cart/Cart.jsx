import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Trash2, Plus, Minus, CreditCard, ChevronLeft, MapPin, AlertCircle } from 'lucide-react';

const Cart = () => {
  const { cartItems, handleQuantityChange, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('cart'); // 'cart' or 'shipping'
  const [shippingDetails, setShippingDetails] = useState({
    address: user?.shippingAddress?.address || '',
    city: user?.shippingAddress?.city || '',
    postalCode: user?.shippingAddress?.postalCode || '',
    country: user?.shippingAddress?.country || ''
  });
  const [error, setError] = useState(new URLSearchParams(window.location.search).get('canceled') ? 'Payment was cancelled or rejected. Please try again.' : '');

  const formattedPrice = (amount) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);

  const handleCheckout = async () => {
    if (!shippingDetails.address || !shippingDetails.city || !shippingDetails.postalCode) {
      setError('Please complete all shipping fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/checkout/create-session', {
        cartItems,
        shippingDetails,
      });
      window.location.href = data.url;
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
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
              <Link to={`/product/${item.product}`} className="text-xl font-bold truncate block hover:text-[var(--muted)] transition-colors">
                {item.name}
              </Link>
              {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(item.selectedOptions).map(([key, value]) => (
                    <span key={key} className="text-xs font-semibold px-2 py-0.5 bg-[var(--text)] text-[var(--bg)] rounded-full">
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}
              <p className="font-extrabold text-lg mt-2 text-[var(--text)]">{formattedPrice(item.price)}</p>
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
        <div className="soft-card p-8 sticky top-32 flex flex-col gap-8 border border-[var(--border-color)]">
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-sm flex gap-3 font-semibold">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          {step === 'cart' ? (
            <>
              <h3 className="text-2xl font-extrabold tracking-tight">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-[var(--muted)] font-semibold">
                  <span>Subtotal</span>
                  <span>{formattedPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[var(--muted)] font-semibold">
                  <span>Delivery Fee</span>
                  <span className="text-green-500 font-bold">FREE</span>
                </div>
                <div className="h-px bg-[var(--border-color)] my-2" />
                <div className="flex justify-between text-2xl font-extrabold text-[var(--text)]">
                  <span>Total</span>
                  <span>{formattedPrice(subtotal)}</span>
                </div>
              </div>

              {!user ? (
                <Link to="/login" className="pill-btn w-full justify-center gap-3">
                  Login to Checkout
                  <CreditCard size={20} />
                </Link>
              ) : (
                <button
                  onClick={() => setStep('shipping')}
                  className="pill-btn w-full justify-center gap-3"
                >
                  Proceed to Secure Checkout
                  <MapPin size={20} />
                </button>
              )}
            </>
          ) : (
            <>
              <h3 className="text-xl font-extrabold flex items-center gap-2">
                <button onClick={() => setStep('cart')} className="hover:text-[var(--muted)]"><ChevronLeft size={24} /></button>
                Shipping Details
              </h3>

              <div className="space-y-4">
                <input 
                  type="text" placeholder="Street Address" required
                  className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm font-medium"
                  value={shippingDetails.address} onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="City" required
                    className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm font-medium"
                    value={shippingDetails.city} onChange={e => setShippingDetails({...shippingDetails, city: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Postal Code" required
                    className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm font-medium"
                    value={shippingDetails.postalCode} onChange={e => setShippingDetails({...shippingDetails, postalCode: e.target.value})}
                  />
                </div>
                <input 
                  type="text" placeholder="Country" required
                  className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm font-medium"
                  value={shippingDetails.country} onChange={e => setShippingDetails({...shippingDetails, country: e.target.value})}
                />
              </div>

              <div className="h-px bg-[var(--border-color)] my-2" />

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="pill-btn w-full justify-center gap-3 bg-[var(--text)] text-[var(--bg)]"
              >
                {loading ? 'Processing Payment...' : `Pay ${formattedPrice(subtotal)}`}
                <CreditCard size={20} />
              </button>
            </>
          )}

          <p className="text-xs text-center text-[var(--muted)] font-semibold uppercase tracking-wider">
            Secured by SSL • Power Checkout
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
