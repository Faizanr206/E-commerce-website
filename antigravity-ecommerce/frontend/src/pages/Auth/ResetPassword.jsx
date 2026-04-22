import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Lock, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      await api.put(`/users/resetpassword/${token}`, { password });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Link might be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-6 glass rounded-2xl animate-float-slow">
      <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-accent to-brand-primary bg-clip-text text-transparent">
        Reset Password
      </h2>
      <p className="text-muted text-center mb-8 text-sm">
        Enter your new password below.
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
            <label className="block text-sm font-medium mb-2 text-muted uppercase tracking-wider">New Password</label>
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

          <div>
            <label className="block text-sm font-medium mb-2 text-muted uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="password"
                required
                className="w-full bg-bg/50 border border-glass-border rounded-xl px-10 py-3 focus:ring-2 focus:ring-accent outline-none transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-4 rounded-xl font-bold font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/20 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link to="/login" className="text-accent font-semibold hover:underline text-sm uppercase tracking-widest">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
