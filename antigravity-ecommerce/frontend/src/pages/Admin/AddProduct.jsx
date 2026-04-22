import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  ArrowLeft, 
  Loader2, 
  Layers,
  Settings,
  DollarSign
} from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    basePrice: '',
    stock: '',
    images: [{ url: '', public_id: 'auto' }],
    options: [{ name: '', values: [''] }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddImage = () => {
    setFormData({ 
      ...formData, 
      images: [...formData.images, { url: '', public_id: 'auto' }] 
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({ 
      ...formData, 
      images: formData.images.filter((_, i) => i !== index) 
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index].url = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleAddOption = () => {
    setFormData({ 
      ...formData, 
      options: [...formData.options, { name: '', values: [''] }] 
    });
  };

  const handleOptionNameChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index].name = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleOptionValueChange = (optIndex, valIndex, value) => {
    const newOptions = [...formData.options];
    newOptions[optIndex].values[valIndex] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleAddOptionValue = (index) => {
    const newOptions = [...formData.options];
    newOptions[index].values.push('');
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic Validation (Could use Zod here)
      if (formData.images.some(img => !img.url)) {
        throw new Error('All image fields must be filled.');
      }
      if (formData.options.some(opt => !opt.name || opt.values.some(v => !v))) {
        throw new Error('All options and values must be filled.');
      }

      await api.post('/products', {
        ...formData,
        basePrice: Number(formData.basePrice),
        stock: Number(formData.stock),
      });

      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to initialize entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Link to="/admin/products" className="inline-flex items-center gap-2 mb-10 text-muted hover:text-accent transition-colors font-black uppercase tracking-widest text-xs">
        <ArrowLeft size={16} /> Return to Inventory
      </Link>

      <div className="flex flex-col gap-2 mb-10">
         <h1 className="text-4xl font-black uppercase tracking-tighter">Initialize Gear</h1>
         <p className="text-muted font-medium text-xs tracking-widest uppercase italic">Deploy New Propulsion Technology</p>
      </div>

      {error && (
        <div className="mb-8 p-6 glass bg-red-500/10 border-red-500/30 text-red-500 rounded-2xl font-bold uppercase tracking-widest text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Core Details */}
        <div className="glass p-8 rounded-[2rem] border border-glass-border space-y-6">
           <div className="flex items-center gap-2 mb-4">
              <Layers className="text-accent" size={20} />
              <h2 className="text-xl font-black uppercase tracking-tighter">Core Telemetry</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-muted">Gear Name</label>
                 <input
                   type="text"
                   name="name"
                   required
                   className="w-full bg-bg/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                   placeholder="e.g., QUANTUM BOOTS"
                   value={formData.name}
                   onChange={handleChange}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-muted">Category</label>
                 <input
                   type="text"
                   name="category"
                   required
                   className="w-full bg-bg/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                   placeholder="e.g., FOOTWEAR"
                   value={formData.category}
                   onChange={handleChange}
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted">Description</label>
              <textarea
                name="description"
                required
                className="w-full bg-bg/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all font-bold min-h-[100px]"
                placeholder="DETAILS REGARDING WEIGHTLESS PERFORMANCE..."
                value={formData.description}
                onChange={handleChange}
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-muted">Base Cost (PKR)</label>
                 <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                      type="number"
                      name="basePrice"
                      required
                      className="w-full bg-bg/50 border border-glass-border rounded-xl px-10 py-3 outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                      placeholder="0"
                      value={formData.basePrice}
                      onChange={handleChange}
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-muted">Initial Stock</label>
                 <input
                   type="number"
                   name="stock"
                   required
                   className="w-full bg-bg/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                   placeholder="0"
                   value={formData.stock}
                   onChange={handleChange}
                 />
              </div>
           </div>
        </div>

        {/* Visual Assets */}
        <div className="glass p-8 rounded-[2rem] border border-glass-border space-y-6">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <ImageIcon className="text-accent" size={20} />
                 <h2 className="text-xl font-black uppercase tracking-tighter">Visual Assets</h2>
              </div>
              <button
                type="button"
                onClick={handleAddImage}
                className="text-xs font-black uppercase tracking-widest text-accent hover:underline"
              >
                + ADD IMAGE URL
              </button>
           </div>

           <div className="space-y-4">
              {formData.images.map((img, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <input
                    type="text"
                    required
                    className="flex-1 bg-bg/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all font-bold text-xs"
                    placeholder="https://image-source.com/..."
                    value={img.url}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                  />
                  {formData.images.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="p-3 text-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
           </div>
        </div>

        {/* Variants & Options */}
        <div className="glass p-8 rounded-[2rem] border border-glass-border space-y-6">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <Settings className="text-accent" size={20} />
                 <h2 className="text-xl font-black uppercase tracking-tighter">Modifications</h2>
              </div>
              <button
                type="button"
                onClick={handleAddOption}
                className="text-xs font-black uppercase tracking-widest text-accent hover:underline"
              >
                + ADD MOD CATEGORY
              </button>
           </div>

           <div className="space-y-8">
              {formData.options.map((opt, optIndex) => (
                <div key={optIndex} className="p-6 bg-bg/30 rounded-[1.5rem] border border-glass-border space-y-6">
                   <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="NAME (E.G. GRAVITY LEVEL)"
                        className="flex-1 bg-bg/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition-all font-black uppercase tracking-widest text-xs"
                        value={opt.name}
                        onChange={(e) => handleOptionNameChange(optIndex, e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, options: formData.options.filter((_, i) => i !== optIndex) })}
                        className="p-3 text-red-500/50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>
                   
                   <div className="flex flex-wrap gap-3">
                      {opt.values.map((val, valIndex) => (
                        <div key={valIndex} className="relative group">
                           <input
                             type="text"
                             placeholder="VALUE"
                             className="bg-bg/50 border border-glass-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-accent transition-all font-bold text-xs w-32"
                             value={val}
                             onChange={(e) => handleOptionValueChange(optIndex, valIndex, e.target.value)}
                           />
                           {opt.values.length > 1 && (
                             <button 
                               type="button"
                               onClick={() => {
                                  const newOptions = [...formData.options];
                                  newOptions[optIndex].values = newOptions[optIndex].values.filter((_, i) => i !== valIndex);
                                  setFormData({ ...formData, options: newOptions });
                               }}
                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                               <Plus size={10} className="rotate-45" />
                             </button>
                           )}
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={() => handleAddOptionValue(optIndex)}
                        className="px-3 py-2 border border-dashed border-glass-border rounded-lg text-xs font-bold text-muted hover:border-accent hover:text-accent transition-all"
                      >
                         + VAL
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-accent/20 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all text-xl"
        >
          {loading ? (
             <div className="flex items-center justify-center gap-3">
                <Loader2 className="animate-spin" /> INITIALIZING DEPLOYMENT...
             </div>
          ) : 'DEPLOY GEAR TO ORBIT'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
