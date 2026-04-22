import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import GravityHero from '../../components/GravityHero';
import FloatingProductCard from '../../components/FloatingProductCard';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <GravityHero />

      <section id="products-section" className="py-20 scroll-mt-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase">Tiny Legend Favorites</h2>
            <p className="text-muted mt-2 text-lg">Curated collection of toys that inspire wonder and joy.</p>
          </div>
          <div className="h-px flex-1 bg-glass-border hidden md:block" />
          <div className="flex gap-4">
            <button className="px-5 py-2 glass rounded-full text-[10px] font-black uppercase tracking-widest border-accent/40 text-accent hover:bg-accent/10 active:scale-95 transition-all cursor-pointer">
              NEW ARRIVALS
            </button>
            <button className="px-5 py-2 glass rounded-full text-[10px] font-black uppercase tracking-widest border-glass-border hover:border-accent hover:text-accent active:scale-95 transition-all cursor-pointer">
              LIMITLESS
              ADVENTURE STORIES
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-6 animate-pulse">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-muted font-bold uppercase tracking-widest">Opening World of Wonders...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500 font-bold">Failed to fetch store data. Returning to the playroom...</div>
        ) : !products.length ? (
          <div className="py-20 text-center text-muted font-bold uppercase tracking-widest">No toys found in this collection.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <FloatingProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
