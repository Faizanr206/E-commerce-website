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
      <div className="py-24 text-center text-[var(--muted)] font-semibold">
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
    <div className="max-w-6xl mx-auto py-24 px-6 md:px-12">
      {/* Header Profile Section */}
      <div className="soft-card p-10 mb-12 flex flex-col md:flex-row items-center gap-8 border border-[var(--border-color)]">
        <div className="relative group shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-[var(--bg)] border-4 border-[var(--border-color)] shadow-sm">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                <UserIcon size={48} strokeWidth={1.5} />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2.5 bg-[var(--text)] text-[var(--bg)] rounded-full cursor-pointer shadow-md hover:scale-105 transition-transform">
            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          </label>
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            {user?.name}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold border border-[var(--border-color)] bg-[var(--bg)] text-[var(--text)]">
              {user?.role === 'admin' ? 'Admin / Manager' : 'Customer'}
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--muted)]">
              Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2025'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('personal')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-semibold text-sm transition-all ${activeTab === 'personal' ? 'bg-[var(--text)] text-[var(--bg)] shadow-md translate-x-1' : 'hover:bg-[var(--border-color)] text-[var(--text)]'}`}
          >
            <UserIcon size={18} /> Personal Info
          </button>
          <button 
            onClick={() => setActiveTab('shipping')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-semibold text-sm transition-all ${activeTab === 'shipping' ? 'bg-[var(--text)] text-[var(--bg)] shadow-md translate-x-1' : 'hover:bg-[var(--border-color)] text-[var(--text)]'}`}
          >
            <MapPin size={18} /> Shipping Methods
          </button>
          <button 
            onClick={() => setActiveTab('cart')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-semibold text-sm transition-all ${activeTab === 'cart' ? 'bg-[var(--text)] text-[var(--bg)] shadow-md translate-x-1' : 'hover:bg-[var(--border-color)] text-[var(--text)]'}`}
          >
            <ShoppingBag size={18} /> Active Cart
            {totalItems > 0 && <span className={`ml-auto px-2py-0.5 rounded-full text-[10px] ${activeTab === 'cart' ? 'bg-[var(--bg)] text-[var(--text)]' : 'bg-[var(--text)] text-[var(--bg)]'}`}>{totalItems}</span>}
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="soft-card rounded-2xl p-8 lg:p-10 min-h-[500px]">
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
                    <label className="block text-sm font-semibold text-[var(--text)] mb-2">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--text)] transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text)] mb-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none opacity-60"
                      value={email}
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-2">New Password <span className="text-xs font-normal text-[var(--muted)]">(leave blank to keep current)</span></label>
                  <input 
                    type="password" 
                    className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--text)] transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="pill-btn mt-4 w-full sm:w-auto"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
                  <span className="ml-2">Save Profile Changes</span>
                </button>
              </form>
            )}

            {activeTab === 'shipping' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text)] mb-2">Street Address</label>
                  <input 
                    type="text" 
                    name="address"
                    className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--text)] transition-all"
                    placeholder="123 Example Blvd"
                    value={shippingAddress.address}
                    onChange={handleShippingChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text)] mb-2">City</label>
                    <input 
                      type="text" 
                      name="city"
                      className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--text)] transition-all"
                      value={shippingAddress.city}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text)] mb-2">Postal Code</label>
                    <input 
                      type="text" 
                      name="postalCode"
                      className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--text)] transition-all"
                      value={shippingAddress.postalCode}
                      onChange={handleShippingChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text)] mb-2">Country</label>
                    <input 
                      type="text" 
                      name="country"
                      className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--text)] transition-all"
                      value={shippingAddress.country}
                      onChange={handleShippingChange}
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="pill-btn mt-4 w-full sm:w-auto"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
                  <span className="ml-2">Save Shipping Info</span>
                </button>
              </form>
            )}

            {activeTab === 'cart' && (
              <div className="space-y-6">
                <div className="flex justify-between items-end mb-8 border-b border-[var(--border-color)] pb-4">
                  <h3 className="text-2xl font-bold tracking-tight">Your Cart</h3>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--muted)]">Subtotal</p>
                    <p className="text-2xl font-extrabold text-[var(--text)]">${subtotal.toFixed(2)}</p>
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <ShoppingBag size={48} className="mx-auto text-[var(--muted)] opacity-20" />
                    <p className="text-[var(--muted)] font-semibold text-lg">Your cart is currently empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.product + JSON.stringify(item.selectedOptions)} className="border border-[var(--border-color)] bg-[var(--bg)] rounded-2xl p-4 flex items-center gap-6 group hover:border-[var(--text)] transition-colors">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[var(--bg)] border border-[var(--border-color)]">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-[var(--text)]">{item.name}</h4>
                          <p className="text-sm text-[var(--muted)] mt-1">Quantity: {item.qty} • ${item.price}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product)}
                          className="p-3 text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-100 md:opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={20} />
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
