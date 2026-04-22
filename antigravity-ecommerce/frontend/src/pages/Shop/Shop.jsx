import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, List, X, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import FloatingProductCard from '../../components/FloatingProductCard';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters State
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [categories, setCategories] = useState(['All']);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating-high', label: 'Highest Rated' },
  ];

  useEffect(() => {
    const fetchDiscoveryData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products', {
          params: { keyword, category, sort }
        });
        setProducts(data);
        
        // Extract unique categories for filter
        const allCats = ['All', ...new Set(data.map(p => p.category))];
        if (categories.length <= 1) setCategories(allCats);
        
        setLoading(false);
      } catch (err) {
        setError('Communication failure with Antigravity server.');
        setLoading(false);
      }
    };

    // Debounced search
    const timer = setTimeout(() => {
      fetchDiscoveryData();
    }, 400);

    return () => clearTimeout(timer);
  }, [keyword, category, sort]);

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col gap-8 mb-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-6xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-accent via-brand-primary to-accent animate-gradient-x">
            Galactic Catalog
          </h1>
          <p className="text-muted font-bold tracking-[0.3em] uppercase text-xs">Explore the infinite legends</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass p-4 rounded-[2.5rem] border border-glass-border shadow-2xl">
          <div className="relative flex-1 w-full lg:max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search by name or serial..."
              className="w-full bg-bg/50 border-2 border-transparent focus:border-accent/30 rounded-2xl py-4 pl-14 pr-6 outline-none font-bold placeholder:text-muted/50 transition-all uppercase tracking-widest text-sm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-56 group">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full bg-bg/50 border-2 border-glass-border hover:border-accent/30 rounded-2xl py-3 pl-12 pr-6 outline-none font-black text-xs uppercase tracking-[0.2em] flex items-center justify-between group-hover:bg-bg/80 transition-all"
              >
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={16} />
                <span>{sortOptions.find(o => o.value === sort)?.label}</span>
                <motion.div
                  animate={{ rotate: isSortOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <List size={14} className="text-muted" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-3 p-2 glass border border-glass-border rounded-2xl shadow-2xl z-[100] overflow-hidden"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSort(opt.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all mb-1 last:mb-0 flex items-center justify-between ${
                          sort === opt.value 
                            ? 'bg-accent text-white' 
                            : 'hover:bg-accent/10 text-muted hover:text-accent'
                        }`}
                      >
                        {opt.label}
                        {sort === opt.value && (
                          <motion.div layoutId="activeSort" className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-3 rounded-xl border-2 transition-all active:scale-95 ${isFilterOpen ? 'bg-accent text-white border-accent' : 'glass border-glass-border hover:border-accent'}`}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Category Selection */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-3 pt-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all ${category === cat ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'glass border-glass-border hover:border-accent text-muted'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <Loader2 className="animate-spin text-accent" size={48} />
          <p className="font-black uppercase tracking-[0.3em] text-muted text-xs">Scanning Galaxy Segments...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-8 glass rounded-[3rem] border border-glass-border border-dashed">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center text-accent">
            <X size={48} />
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">No Legends Found</h3>
            <p className="text-muted font-bold tracking-widest uppercase text-xs">Try adjusting your spectral filters</p>
          </div>
          <button 
            onClick={() => { setKeyword(''); setCategory('All'); setSort('newest'); }}
            className="text-accent font-black uppercase tracking-widest text-xs border-b-2 border-accent pb-1 hover:opacity-70 transition-opacity"
          >
            Clear All Data
          </button>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <FloatingProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Stats Indicator */}
      {!loading && products.length > 0 && (
        <div className="mt-20 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-glass-border" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted whitespace-nowrap px-4">
            Total Telemetry: {products.length} Legends Detected
          </p>
          <div className="h-px flex-1 bg-glass-border" />
        </div>
      )}
    </div>
  );
};

export default Shop;
