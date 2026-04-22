import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-6 glass rounded-2xl animate-float-slow">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-accent to-brand-primary bg-clip-text text-transparent">
        Join the Mission
      </h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-500 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-muted uppercase tracking-wider">Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              required
              className="w-full bg-bg/50 border border-glass-border rounded-xl px-10 py-3 focus:ring-2 focus:ring-accent outline-none transition-all"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-4 rounded-xl font-bold font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/20 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
        >
          {loading ? 'Starting Adventure...' : 'Join LittleLegends'}
        </button>
      </form>

      <p className="mt-8 text-center text-muted">
        Already a member?{' '}
        <Link to="/login" className="text-accent font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Signup;
