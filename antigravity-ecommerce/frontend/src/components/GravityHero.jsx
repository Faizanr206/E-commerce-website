import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const GravityHero = () => {
  const [heroImage, setHeroImage] = useState('');
  const [heroText, setHeroText] = useState('Premium Lifestyle');

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const [textRes, imgRes] = await Promise.all([
          api.get('/settings/hero_text').catch(() => ({ data: null })),
          api.get('/settings/hero_image').catch(() => ({ data: null }))
        ]);
        if (textRes.data) setHeroText(textRes.data);
        if (imgRes.data) setHeroImage(imgRes.data);
      } catch (err) {
        console.error('Failed to load hero settings');
      }
    };
    fetchHeroData();
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-20 px-6 max-w-7xl mx-auto border-b border-[var(--border-color)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start gap-8 z-10"
        >
          <div className="px-4 py-2 rounded-full border border-[var(--text)] text-xs font-bold uppercase tracking-widest text-[var(--text)]">
            New Collection
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-[var(--text)]">
            Pure Joy For <br />
            <span className="text-[var(--muted)]">Tiny Legends.</span>
          </h1>
          
          <p className="text-xl text-[var(--muted)] max-w-xl leading-relaxed">
            Premium toys designed for imagination, safety, and endless smiles. Discover the magic of childhood with minimalist elegance.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <button 
              onClick={() => {
                const el = document.getElementById('products-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="pill-btn flex items-center gap-3 text-lg"
            >
              Shop New Arrivals
              <ShoppingBag size={20} />
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('products-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 rounded-full border border-[var(--border-color)] text-[var(--text)] font-semibold text-lg hover:border-[var(--text)] transition-colors flex items-center gap-2"
            >
              Learn More
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>

        {/* Minimalist Visual Component */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[500px] w-full rounded-[2rem] overflow-hidden soft-card bg-[var(--card-bg)] hidden lg:flex items-center justify-center p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg)] to-[var(--border-color)] opacity-50" />
          <div className="relative w-full h-full rounded-2xl border border-[var(--border-color)] overflow-hidden bg-[var(--text)] flex items-center justify-center shadow-xl">
            {heroImage ? (
              <img src={heroImage} alt="Hero representation" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700" />
            ) : (
              <div className="text-center font-bold text-[var(--bg)] opacity-80 text-xl tracking-widest uppercase">
                {heroText}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GravityHero;
