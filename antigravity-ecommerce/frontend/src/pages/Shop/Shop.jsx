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
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-extrabold tracking-tight text-[var(--text)]">
            Explore Collection
          </h1>
          <p className="text-[var(--muted)] font-semibold text-lg">Find what you love perfectly crafted for daily use.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-2 rounded-full border border-[var(--border-color)] bg-[var(--bg)] shadow-sm">
          <div className="relative flex-1 w-full lg:max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--text)] transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent py-3 pl-14 pr-6 outline-none font-semibold placeholder:text-[var(--muted)] transition-all text-sm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto px-2 md:px-0">
            <div className="relative flex-1 md:w-48 group">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full bg-[var(--bg)] border border-[var(--border-color)] hover:border-[var(--text)] rounded-full py-2.5 pl-10 pr-4 outline-none font-semibold text-sm flex items-center justify-between transition-all"
              >
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text)]" size={16} />
                <span className="truncate">{sortOptions.find(o => o.value === sort)?.label}</span>
                <motion.div
                  animate={{ rotate: isSortOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <List size={16} className="text-[var(--muted)] ml-2" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-3 p-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-xl z-[100] min-w-[200px]"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSort(opt.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-xl font-semibold text-sm transition-all mb-1 last:mb-0 flex items-center justify-between ${
                          sort === opt.value 
                            ? 'bg-[var(--text)] text-[var(--bg)]' 
                            : 'hover:bg-[var(--border-color)] text-[var(--text)]'
                        }`}
                      >
                        {opt.label}
                        {sort === opt.value && (
                          <motion.div layoutId="activeSort" className="w-1.5 h-1.5 rounded-full bg-[var(--bg)] shadow-sm" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2.5 rounded-full border transition-all active:scale-95 ${isFilterOpen ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]' : 'border-[var(--border-color)] hover:border-[var(--text)] bg-[var(--bg)]'}`}
            >
              <SlidersHorizontal size={18} />
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
                    className={`px-5 py-2 rounded-full font-semibold text-sm transition-all border ${category === cat ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]' : 'border-[var(--border-color)] hover:border-[var(--text)] text-[var(--text)]'}`}
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
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <Loader2 className="animate-spin text-[var(--text)]" size={40} />
          <p className="font-semibold text-[var(--muted)] text-sm">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 soft-card border border-[var(--border-color)] border-dashed">
          <div className="w-20 h-20 bg-[var(--border-color)] rounded-full flex items-center justify-center text-[var(--muted)]">
            <X size={40} />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">No Products Found</h3>
            <p className="text-[var(--muted)] text-sm">Try modifying your search or filters.</p>
          </div>
          <button 
            onClick={() => { setKeyword(''); setCategory('All'); setSort('newest'); }}
            className="text-sm font-semibold underline underline-offset-4"
          >
            Clear Filters
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
          <div className="h-px flex-1 bg-[var(--border-color)]" />
          <p className="text-sm font-semibold text-[var(--muted)] px-4">
            Showing {products.length} Products
          </p>
          <div className="h-px flex-1 bg-[var(--border-color)]" />
        </div>
      )}
    </div>
  );
};

export default Shop;
