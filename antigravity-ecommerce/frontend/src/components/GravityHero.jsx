import React from 'react';
import Typewriter from 'typewriter-effect';
import { MousePointer2, MoveDown } from 'lucide-react';

const GravityHero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-accent/20 blur-xl animate-float-slow"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          />
        ))}
      </div>

      <div className="z-10 px-4 max-w-5xl">
        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
          <span 
            className="inline-block bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, var(--gradient-from), var(--gradient-via), var(--gradient-to))`
            }}
          >
            <Typewriter
              options={{
                strings: ['Pure Joy', 'Little Wonders', 'Gentle Play'],
                autoStart: true,
                loop: true,
              }}
            />
          </span>
          <br />
          For Your Tiny Legends
        </h1>
        
        <p className="text-xl md:text-2xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
          Premium toys designed for imagination, safety, and endless smiles. Discover the magic of childhood with LittleLegends.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button 
            onClick={() => {
              const el = document.getElementById('products-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 py-5 bg-accent text-white text-lg font-bold rounded-2xl shadow-2xl shadow-accent/40 hover:shadow-accent/60 flex items-center gap-3 active:scale-95 transition-all cursor-pointer"
          >
            SHOP NEW ARRIVALS
            <MousePointer2 size={24} />
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById('products-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 py-5 glass border-glass-border text-lg font-bold rounded-2xl hover:bg-muted/10 active:scale-95 transition-all cursor-pointer"
          >
            LEARN MORE
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 animate-bounce text-muted">
        <MoveDown size={32} />
      </div>
    </section>
  );
};

export default GravityHero;
