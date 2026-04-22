import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FloatingProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(product.basePrice);

  return (
    <motion.div
      initial={{ y: 0 }}
      whileHover={{ y: -5 }}
      className="group soft-card p-5 flex flex-col gap-4 transition-all duration-300"
    >
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden rounded-2xl aspect-square bg-[var(--bg)] border border-[var(--border-color)]">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-[var(--text)] text-[var(--bg)] text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
          {product.category}
        </div>
      </Link>

      <div className="flex flex-col gap-2 relative z-10 bg-[var(--card-bg)]">
        <div className="flex items-start justify-between gap-2">
          <Link 
            to={`/product/${product._id}`} 
            className="text-xl font-bold tracking-tight text-[var(--text)] hover:text-[var(--muted)] transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          <div className="flex items-center gap-1 text-[var(--text)] text-xs font-bold bg-[var(--bg)] px-2 py-1 rounded-full border border-[var(--border-color)]">
            <Star size={12} fill="currentColor" />
            {product.averageRating?.toFixed(1) || '0.0'}
          </div>
        </div>
        
        <p className="text-[var(--muted)] text-sm line-clamp-2 min-h-[40px]">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-extrabold text-[var(--text)]">{formattedPrice}</span>
          <button
            onClick={() => addToCart(product)}
            className="p-3 bg-[var(--text)] text-[var(--bg)] rounded-full hover:opacity-80 active:scale-95 transition-all shadow-md"
            aria-label="Add to Cart"
          >
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FloatingProductCard;
