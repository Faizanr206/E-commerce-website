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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 soft-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}>
      {/* Main Navbar Height Container */}
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--text)] rounded-full flex items-center justify-center">
            <span className="text-[var(--bg)] text-xs font-bold">L</span>
          </div>
          LITTLELEGENDS
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold hover:text-[var(--muted)] transition-colors">Home</Link>
          <Link to="/shop" className="text-sm font-semibold hover:text-[var(--muted)] transition-colors">Shop</Link>
          <Link to="/about" className="text-sm font-semibold hover:text-[var(--muted)] transition-colors">About</Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-5">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--border-color)] transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
          </button>

          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="text-sm font-semibold underline underline-offset-4 decoration-2"
            >
              Admin
            </Link>
          )}

          {user && (
            <Link 
              to="/cart" 
              className="p-2 relative hover:bg-[var(--border-color)] rounded-full transition-colors group"
              aria-label="View Basket"
            >
              <ShoppingCart size={22} strokeWidth={2} />
              {totalItems > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 font-bold rounded-full flex items-center justify-center shadow-sm text-[10px] bg-[var(--text)] text-[var(--bg)]"
                >
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3 ml-2">
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[var(--border-color)] flex items-center justify-center">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} strokeWidth={2} />
                  )}
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--border-color)] hover:bg-[var(--border-color)] transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="pill-btn ml-2" style={{ padding: '0.5rem 1.5rem' }}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--border-color)] transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
          </button>
          {user && (
            <Link to="/cart" className="p-2 relative hover:bg-[var(--border-color)] rounded-full transition-colors group">
              <ShoppingCart size={22} strokeWidth={2} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 font-bold rounded-full flex items-center justify-center shadow-sm text-[10px] bg-[var(--text)] text-[var(--bg)]">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full hover:bg-[var(--border-color)] transition-colors"
          >
            <Menu size={24} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-4 flex flex-col gap-4 shadow-lg pb-6">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold hover:text-[var(--muted)] transition-colors">Home</Link>
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold hover:text-[var(--muted)] transition-colors">Shop</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold hover:text-[var(--muted)] transition-colors">About</Link>
          
          <div className="h-px bg-[var(--border-color)] my-2" />

          {/* User Links inside Mobile Dropdown */}
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-bold text-[var(--accent)] underline underline-offset-4 decoration-2">Admin Dashboard</Link>
          )}

          {user ? (
            <div className="flex items-center justify-between w-full mt-2">
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--border-color)] flex items-center justify-center">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} strokeWidth={2} />
                  )}
                </div>
                <span className="font-semibold">{user.name}</span>
              </Link>
              <button 
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="text-sm font-semibold px-4 py-2 rounded-full border border-[var(--border-color)] hover:bg-[var(--border-color)] transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="pill-btn text-center mt-2">
              Login to Account
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default GlowNavbar;
