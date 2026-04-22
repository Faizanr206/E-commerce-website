import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Edit3, Loader2, Package, Search, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  
  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    basePrice: '',
    stock: '',
    images: [], // Array of {url, public_id}
    options: []
  });
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this legend from the store?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        alert('Failed to remove product');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    setUploading(true);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Check if we are in mock mode
      if (data[0]?.isMock) {
        alert('DEVELOPMENT MODE: Since Cloudinary is not configured in your .env file, we are using beautiful placeholder images for your toy legends!');
        console.log('System: Received placeholder adventure images.');
      }

      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, ...data]
      }));
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to upload images';
      alert(`${errorMsg}. Check console for more details.`);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeSelectedImage = (publicId) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter(img => img.public_id !== publicId)
    }));
  };

  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      category: product.category,
      basePrice: product.basePrice,
      stock: product.stock,
      images: product.images,
      options: product.options || []
    });
    setEditProductId(product._id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/products/${editProductId}`, {
          ...newProduct,
          basePrice: Number(newProduct.basePrice),
          stock: Number(newProduct.stock)
        });
      } else {
        await api.post('/products', {
          ...newProduct,
          basePrice: Number(newProduct.basePrice),
          stock: Number(newProduct.stock)
        });
      }
      
      setShowAddModal(false);
      setIsEditing(false);
      setEditProductId(null);
      fetchProducts();
      setNewProduct({ name: '', description: '', category: '', basePrice: '', stock: '', images: [], options: [] });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="py-20 text-center animate-pulse font-black uppercase tracking-widest">Scanning Catalog...</div>;

  return (
    <div className="py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <Link to="/admin" className="text-xs font-black text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2 hover:text-accent transition-colors">
            <ChevronLeft size={16} /> Command Center
          </Link>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Legend Management</h1>
          <p className="text-muted font-medium mt-1">Manage all toys in the LittleLegends adventure fleet.</p>
        </div>
        <button 
          onClick={() => {
            setIsEditing(false);
            setNewProduct({ name: '', description: '', category: '', basePrice: '', stock: '', images: [], options: [] });
            setShowAddModal(true);
          }}
          className="px-8 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus size={24} /> Add New Toy
        </button>
      </div>

      <div className="glass p-4 rounded-[2rem] border-glass-border mb-10">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or category..."
            className="w-full bg-bg/50 border border-glass-border rounded-2xl py-4 pl-16 pr-6 outline-none focus:ring-2 focus:ring-accent font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass rounded-[2rem] border-glass-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-glass-border bg-muted/5">
              <th className="p-6 text-xs font-black uppercase tracking-widest text-muted">Toy Details</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-muted">Category</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-muted">Stock</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-muted">Price</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-muted text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id} className="border-b border-glass-border hover:bg-muted/5 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img src={p.images[0]?.url} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div>
                      <p className="font-black uppercase tracking-tight">{p.name}</p>
                      <p className="text-xs text-muted font-medium">PKR {p.basePrice.toLocaleString()}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 glass rounded-full text-[10px] font-black uppercase tracking-widest border-glass-border">
                    {p.category}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${p.stock < 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className="font-bold">{p.stock} Units</span>
                  </div>
                </td>
                <td className="p-6 font-black text-accent">{p.basePrice}</td>
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => handleEdit(p)}
                      className="p-2 text-muted hover:text-accent transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(p._id)}
                      className="p-2 text-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass p-8 rounded-[3rem] w-full max-w-2xl border-2 border-accent/20 overflow-y-auto max-h-[90vh] shadow-2xl"
            >
               <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-accent">
                 {isEditing ? 'Edit Legend Details' : 'Add New Legend'}
               </h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-accent mb-3">Product Name</label>
                   <input required type="text" className="w-full bg-bg/80 border-2 border-glass-border rounded-2xl p-4 outline-none focus:border-accent text-text font-bold" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-accent mb-3">Description</label>
                   <textarea required className="w-full bg-bg/80 border-2 border-glass-border rounded-2xl p-4 outline-none focus:border-accent text-text font-medium min-h-[100px]" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                </div>
                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-accent mb-3">Category</label>
                   <input required type="text" className="w-full bg-bg/80 border-2 border-glass-border rounded-2xl p-4 outline-none focus:border-accent text-text font-bold" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                </div>
                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-accent mb-3">Price (PKR)</label>
                   <input required type="number" className="w-full bg-bg/80 border-2 border-glass-border rounded-2xl p-4 outline-none focus:border-accent text-text font-bold" value={newProduct.basePrice} onChange={e => setNewProduct({...newProduct, basePrice: e.target.value})} />
                </div>
                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-accent mb-3">Initial Stock</label>
                   <input required type="number" className="w-full bg-bg/80 border-2 border-glass-border rounded-2xl p-4 outline-none focus:border-accent text-text font-bold" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-accent mb-3">Upload Toy Gallery (Max 5)</label>
                   
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                     {newProduct.images.map((img, idx) => (
                       <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-glass-border">
                         <img src={img.url} className="w-full h-full object-cover" alt="" />
                         <button 
                           type="button"
                           onClick={() => removeSelectedImage(img.public_id)}
                           className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           <Trash2 className="text-white" size={20} />
                         </button>
                       </div>
                     ))}
                     
                     {newProduct.images.length < 5 && (
                       <label className="aspect-square rounded-xl border-2 border-dashed border-glass-border flex flex-col items-center justify-center gap-2 hover:border-accent cursor-pointer transition-colors group">
                         {uploading ? (
                           <Loader2 className="text-accent animate-spin" size={24} />
                         ) : (
                           <>
                             <Plus className="text-muted group-hover:text-accent" size={24} />
                             <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-accent">Add Photo</span>
                           </>
                         )}
                         <input 
                           type="file" 
                           multiple 
                           hidden 
                           accept="image/*"
                           onChange={handleImageUpload}
                           disabled={uploading}
                         />
                       </label>
                     )}
                   </div>
                   
                   {newProduct.images.length === 0 && !uploading && (
                     <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">At least one image is required to launch this legend.</p>
                   )}
                </div>
                <div className="md:col-span-2 flex justify-end gap-4 mt-8">
                   <button type="button" onClick={() => setShowAddModal(false)} className="px-8 py-4 font-black uppercase tracking-widest text-muted hover:text-text">Cancel</button>
                   <button 
                     type="submit" 
                     disabled={uploading || newProduct.images.length === 0}
                     className="px-10 py-4 bg-accent text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                   >
                     {uploading ? <Loader2 className="animate-spin" size={20} /> : null}
                     {uploading ? 'Processing Gallery...' : (isEditing ? 'Update Legend' : 'Upload Legend')}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
