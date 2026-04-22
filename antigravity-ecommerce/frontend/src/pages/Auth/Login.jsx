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
    <div className="max-w-md mx-auto py-20 px-6 glass rounded-2xl animate-float-slow">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-accent to-brand-primary bg-clip-text text-transparent">
        Welcome Back
      </h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-500 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-muted uppercase tracking-wider">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="email"
              required
              className="w-full bg-bg/50 border border-glass-border rounded-xl px-10 py-3 focus:ring-2 focus:ring-accent outline-none transition-all"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="password"
              required
              className="w-full bg-bg/50 border border-glass-border rounded-xl px-10 py-3 focus:ring-2 focus:ring-accent outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-2 text-right">
            <Link 
              to="/forgot-password" 
              className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-accent transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-4 rounded-xl font-bold font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/20 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
        >
          {loading ? 'Starting Adventure...' : 'Enter LittleLegends'}
        </button>
      </form>

      <p className="mt-8 text-center text-muted font-medium uppercase tracking-widest text-[10px]">
        New LittleLegend?{' '}
        <Link to="/signup" className="text-accent font-semibold hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default Login;
