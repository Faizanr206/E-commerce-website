import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data } = await api.post('/users/forgotpassword', { email });
      setMessage(data.data || 'Reset link sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-6 glass rounded-2xl animate-float-slow">
      <Link to="/login" className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
        <ArrowLeft size={16} />
        Back to Login
      </Link>

      <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-accent to-brand-primary bg-clip-text text-transparent">
        Forgot Password?
      </h2>
      <p className="text-muted text-center mb-8 text-sm">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-500 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {message && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 text-green-500 text-sm">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {!message && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-muted uppercase tracking-wider">Email Address</label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-4 rounded-xl font-bold font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/20 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
          >
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
