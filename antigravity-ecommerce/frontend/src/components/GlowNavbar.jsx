import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, ShoppingCart, User, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const GlowNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-accent flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent animate-float-slow bg-gradient-to-br from-accent to-brand-primary" />
          LITTLELEGENDS
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-accent transition-colors font-bold uppercase tracking-widest text-xs">Home</Link>
          <Link to="/shop" className="hover:text-accent transition-colors font-bold uppercase tracking-widest text-xs">Shop</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-accent font-black uppercase tracking-widest text-xs border-b-2 border-accent pb-1">Dashboard</Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted/10 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="text-accent font-black uppercase tracking-widest text-[10px] sm:text-xs border-b-2 border-accent pb-1"
            >
              Dashboard
            </Link>
          )}

          {user && (
            <Link 
              to="/cart" 
              className="p-2 relative hover:bg-muted/10 transition-all active:scale-95 group"
              aria-label="View Basket"
            >
              <ShoppingCart size={22} className="group-hover:text-accent transition-colors" />
              {totalItems > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 font-black rounded-full flex items-center justify-center shadow-lg z-50 text-[10px]"
                  style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 hover:text-accent transition-all active:scale-95 group">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-glass-border group-hover:border-accent transition-colors bg-bg/50 flex items-center justify-center">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <span className="hidden sm:inline font-bold uppercase tracking-widest text-[10px]">{user.name}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default GlowNavbar;
