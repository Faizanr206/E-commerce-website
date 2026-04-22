import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Search, Trash2, Edit, Plus, Package, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    if (window.confirm('Erase this item from history? This action cannot be undone.')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert('Failed to erase item.');
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="py-20 text-center flex flex-col items-center gap-4 text-accent"><Loader2 className="animate-spin" size={48} /> Scanning Inventory...</div>;

  const formattedPrice = (amount) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Propulsion Inventory</h1>
          <p className="text-muted mt-1 font-medium text-xs tracking-widest uppercase">Manage Active Gear</p>
        </div>
        <Link to="/admin/add-product" className="p-4 bg-accent text-white rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-xs shadow-xl shadow-accent/20 hover:opacity-90 active:scale-95 transition-all">
          <Plus size={18} /> Add New Entry
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted" size={20} />
        <input
          type="text"
          placeholder="SEARCH BY TYPE OR CATEGORY..."
          className="w-full glass p-6 pl-16 rounded-[2rem] border border-glass-border focus:ring-2 focus:ring-accent outline-none text-xs font-black tracking-widest uppercase"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="glass rounded-[2rem] border border-glass-border overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-bg/50 border-b border-glass-border">
              <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-muted">Gear</th>
              <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-muted">Category</th>
              <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-muted">Base Cost</th>
              <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-muted">Stock</th>
              <th className="px-8 py-5 text-right text-xs font-black uppercase tracking-[0.2em] text-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border">
            {filteredProducts.map((p) => (
              <tr key={p._id} className="hover:bg-accent/5 transition-colors group">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl glass overflow-hidden border-glass-border">
                         <img src={p.images[0]?.url} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-black uppercase tracking-widest text-sm">{p.name}</span>
                   </div>
                </td>
                <td className="px-8 py-6 uppercase text-xs font-bold text-muted tracking-widest">{p.category}</td>
                <td className="px-8 py-6 font-black text-accent">{formattedPrice(p.basePrice)}</td>
                <td className="px-8 py-6">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${p.stock < 5 ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-green-500/10 border-green-500/30 text-green-500'}`}>
                      {p.stock} Units
                   </span>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex items-center justify-end gap-2">
                     <button title="Edit" className="p-2 text-muted hover:text-accent transition-colors">
                        <Edit size={18} />
                     </button>
                     <button 
                        onClick={() => handleDelete(p._id)}
                        title="Delete" 
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
        
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center font-black uppercase tracking-widest text-muted text-xs italic">
             No matching gear found in current sector.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
