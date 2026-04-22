import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../utils/api';
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  Camera, 
  Save, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  CreditCard
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { cartItems, removeFromCart, totalItems, subtotal } = useCart();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Form States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  
  const [shippingAddress, setShippingAddress] = useState({
    address: user?.shippingAddress?.address || '',
    city: user?.shippingAddress?.city || '',
    postalCode: user?.shippingAddress?.postalCode || '',
    country: user?.shippingAddress?.country || '',
  });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setProfilePicture(user.profilePicture || '');
      setShippingAddress({
        address: user.shippingAddress?.address || '',
        city: user.shippingAddress?.city || '',
        postalCode: user.shippingAddress?.postalCode || '',
        country: user.shippingAddress?.country || '',
      });
    }
  }, [user]);

  // Guard: don't render if user is not loaded yet
  if (!user) {
    return (
      <div className="py-20 text-center animate-pulse uppercase tracking-[0.2em] text-muted">
        Loading Profile...
      </div>
    );
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const updateData = {
        name,
        email,
        profilePicture,
        shippingAddress
      };
      
      if (password) {
        updateData.password = password;
      }

      await updateProfile(updateData);
      setMessage('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload/profile-pic', formData);
      const imageUrl = data[0].url;
      setProfilePicture(imageUrl);
      
      // Auto-update profile with new picture
      await updateProfile({ profilePicture: imageUrl });
      setMessage('Profile picture updated!');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleShippingChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Header Profile Section */}
      <div className="glass rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 animate-fade-in">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-bg/50 border-4 border-accent shadow-xl group-hover:opacity-90 transition-opacity">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">
                <UserIcon size={48} />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 bg-accent text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform active:scale-95">
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          </label>
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">
            Legend: <span className="text-accent">{user?.name}</span>
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <span className="px-4 py-1.5 glass rounded-full text-xs font-bold uppercase tracking-widest text-accent">
              {user?.role === 'admin' ? 'Strategic Commander' : 'Active Pioneer'}
            </span>
            <span className="px-4 py-1.5 glass rounded-full text-xs font-medium text-muted">
              Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2025'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('personal')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'personal' ? 'bg-accent text-white shadow-lg shadow-accent/20 translate-x-2' : 'hover:bg-muted/10 text-muted'}`}
          >
            <UserIcon size={18} /> Personal Info
          </button>
          <button 
            onClick={() => setActiveTab('shipping')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'shipping' ? 'bg-accent text-white shadow-lg shadow-accent/20 translate-x-2' : 'hover:bg-muted/10 text-muted'}`}
          >
            <MapPin size={18} /> Shipping Base
          </button>
          <button 
            onClick={() => setActiveTab('cart')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'cart' ? 'bg-accent text-white shadow-lg shadow-accent/20 translate-x-2' : 'hover:bg-muted/10 text-muted'}`}
          >
            <ShoppingBag size={18} /> Artifacts (Cart)
            {totalItems > 0 && <span className="ml-auto bg-brand-primary text-white px-2 py-0.5 rounded-full text-[10px]">{totalItems}</span>}
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="glass rounded-3xl p-8 min-h-[500px]">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 text-sm animate-shake">
                <AlertCircle size={18} /> {error}
              </div>
            )}
            {message && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3 text-green-500 text-sm">
                <CheckCircle2 size={18} /> {message}
              </div>
            )}

            {activeTab === 'personal' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-2 ml-1">Full Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full bg-bg/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-2 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-bg/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all opacity-70"
                      value={email}
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-2 ml-1">New Password (leave blank to keep current)</label>
                  <input 
                    type="password" 
                    className="w-full bg-bg/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Update Personal Telemetry
                </button>
              </form>
            )}

            {activeTab === 'shipping' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-2 ml-1">Street Address</label>
                  <input 
                    type="text" 
                    name="address"
                    className="w-full bg-bg/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="123 Legend Way"
                    value={shippingAddress.address}
                    onChange={handleShippingChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-2 ml-1">City</label>
                    <input 
                      type="text" 
                      name="city"
                      className="w-full bg-bg/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all"
                      value={shippingAddress.city}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-2 ml-1">Postal Code</label>
                    <input 
                      type="text" 
                      name="postalCode"
                      className="w-full bg-bg/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all"
                      value={shippingAddress.postalCode}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-2 ml-1">Country</label>
                    <input 
                      type="text" 
                      name="country"
                      className="w-full bg-bg/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all"
                      value={shippingAddress.country}
                      onChange={handleShippingChange}
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Secure Shipping Base
                </button>
              </form>
            )}

            {activeTab === 'cart' && (
              <div className="space-y-6">
                <div className="flex justify-between items-end mb-8 border-b border-glass-border pb-4">
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">Staged Artifacts</h3>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Subtotal</p>
                    <p className="text-2xl font-black text-accent">${subtotal.toFixed(2)}</p>
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <ShoppingBag size={48} className="mx-auto text-muted/20" />
                    <p className="text-muted uppercase tracking-widest font-bold">No artifacts in vault</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.product + JSON.stringify(item.selectedOptions)} className="glass rounded-2xl p-4 flex items-center gap-4 group">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-bg/50 border border-glass-border">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold uppercase tracking-wider text-sm">{item.name}</h4>
                          <p className="text-xs text-muted">Qty: {item.qty} • ${item.price}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product)}
                          className="p-2 text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
