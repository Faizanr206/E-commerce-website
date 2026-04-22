import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-24 px-6 md:px-12 soft-card rounded-3xl border border-[var(--border-color)]">
      <h2 className="text-3xl font-extrabold tracking-tight text-center mb-8 text-[var(--text)]">
        Welcome Back
      </h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-500 text-sm font-semibold">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text)]">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
            <input
              type="email"
              required
              className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-12 py-3 focus:ring-2 focus:ring-[var(--text)] outline-none transition-all placeholder:text-[var(--muted)]"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-semibold mb-2 text-[var(--text)]">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
            <input
              type="password"
              required
              className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-12 py-3 focus:ring-2 focus:ring-[var(--text)] outline-none transition-all placeholder:text-[var(--muted)]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-2 text-right">
            <Link 
              to="/forgot-password" 
              className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] underline-offset-2 hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full pill-btn"
        >
          {loading ? 'Please wait...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-8 text-center text-[var(--muted)] font-medium text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-[var(--text)] font-bold decoration-2 underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
