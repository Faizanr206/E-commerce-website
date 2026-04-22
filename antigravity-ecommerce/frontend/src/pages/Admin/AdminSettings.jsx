import React, { useState, useEffect } from 'react';
import { Loader2, Save, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';

const AdminSettings = () => {
  const [heroText, setHeroText] = useState('');
  const [heroImage, setHeroImage] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [textRes, imageRes] = await Promise.all([
          api.get('/settings/hero_text').catch(() => ({ data: '' })),
          api.get('/settings/hero_image').catch(() => ({ data: '' }))
        ]);
        
        if (textRes.data) setHeroText(textRes.data);
        if (imageRes.data) setHeroImage(imageRes.data);
      } catch (err) {
        console.error('Error fetching settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage({ type: '', text: '' });
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload/profile-pic', formData);
      setHeroImage(data[0].url);
      setMessage({ type: 'success', text: 'Image uploaded successfully. Remember to save settings.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to upload image.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (heroText) await api.put('/settings/hero_text', { value: heroText });
      if (heroImage) await api.put('/settings/hero_image', { value: heroImage });
      
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-[var(--muted)] animate-pulse">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Site Settings</h1>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-green-500/10 border-green-500/30 text-green-500'}`}>
          {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {message.text}
        </div>
      )}

      <div className="soft-card p-8">
        <h2 className="text-xl font-bold mb-6 border-b border-[var(--border-color)] pb-4">Hero Section Configuration</h2>
        
        <form onSubmit={handleSave} className="space-y-8">
          {/* Hero Text */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-2">Hero Placeholder Text</label>
            <input 
              type="text" 
              className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--text)] transition-all"
              placeholder="E.g. Premium Lifestyle"
              value={heroText}
              onChange={(e) => setHeroText(e.target.value)}
            />
            <p className="text-xs text-[var(--muted)] mt-2">This is the text displayed if no image is uploaded.</p>
          </div>

          {/* Hero Image */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-2">Hero Image / SVG</label>
            
            <div className="flex gap-6 items-center">
              <div className="w-64 h-32 rounded-xl border-2 border-dashed border-[var(--border-color)] overflow-hidden bg-[var(--bg)] flex items-center justify-center relative group">
                {heroImage ? (
                  <>
                    <img src={heroImage} alt="Hero representation" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                    <button 
                      type="button"
                      onClick={() => setHeroImage('')}
                      className="absolute inset-0 m-auto w-10 h-10 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold"
                    >
                      X
                    </button>
                  </>
                ) : (
                  <div className="text-[var(--muted)] flex flex-col items-center gap-2">
                    <ImageIcon size={24} />
                    <span className="text-xs font-semibold uppercase tracking-wider">No Image</span>
                  </div>
                )}
              </div>

              <div>
                <label className="pill-btn cursor-pointer inline-flex items-center gap-2 text-sm">
                  {uploading ? <Loader2 className="animate-spin" size={16} /> : 'Upload Media'}
                  <input type="file" className="hidden" accept="image/*,.svg" onChange={handleImageUpload} disabled={uploading} />
                </label>
                <p className="text-xs text-[var(--muted)] mt-3 max-w-xs">Upload a high-quality JPG, PNG, or SVG image. Recommended ratio: 16:9.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--border-color)]">
            <button 
              type="submit" 
              disabled={saving || uploading}
              className="pill-btn w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
