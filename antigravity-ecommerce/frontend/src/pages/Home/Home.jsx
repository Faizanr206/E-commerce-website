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
    <div className="max-w-7xl mx-auto px-6">
      <GravityHero />

      <section id="products-section" className="py-24 scroll-mt-24 border-t border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">Our Favorites</h2>
            <p className="text-[var(--muted)] text-lg">Curated collection of toys that inspire wonder and joy.</p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2.5 rounded-full border-2 text-sm font-semibold tracking-wide border-[var(--text)] bg-[var(--text)] text-[var(--bg)] shadow-md hover:opacity-90 active:scale-95 transition-all">
              New Arrivals
            </button>
            <button className="px-6 py-2.5 rounded-full border-2 text-sm font-semibold tracking-wide border-[var(--border-color)] text-[var(--text)] hover:border-[var(--text)] active:scale-95 transition-all">
              All Products
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--text)] rounded-full animate-spin" />
            <p className="text-[var(--muted)] font-semibold uppercase tracking-widest text-sm">Loading collection...</p>
          </div>
        ) : error ? (
          <div className="py-24 text-center text-red-500 font-bold border border-red-500/20 rounded-3xl bg-red-500/5">Failed to fetch store data. Please try again.</div>
        ) : !products.length ? (
          <div className="py-24 text-center text-[var(--muted)] font-bold text-lg">No products found in this collection.</div>
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
