import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
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
      whileHover={{ y: -10, scale: 1.02 }}
      className="group glass p-5 rounded-3xl flex flex-col gap-4 shadow-xl hover:shadow-accent/20 transition-all duration-500"
    >
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden rounded-2xl aspect-square">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-accent/90 text-white text-xs font-bold rounded-full uppercase tracking-widest backdrop-blur-sm">
          {product.category}
        </div>
      </Link>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Link 
            to={`/product/${product._id}`} 
            className="text-xl font-black uppercase tracking-tighter hover:scale-105 transition-transform bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, var(--gradient-from), var(--gradient-via), var(--gradient-to))`
            }}
          >
            {product.name}
          </Link>
          <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
            <Star size={16} fill="currentColor" />
            {product.averageRating?.toFixed(1) || '0.0'}
          </div>
        </div>
        
        <p className="text-muted text-sm line-clamp-2 h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-black text-accent">{formattedPrice}</span>
          <button
            onClick={() => addToCart(product)}
            className="p-3 bg-accent text-white rounded-xl hover:bg-brand-primary active:scale-95 transition-all shadow-lg shadow-accent/20"
            aria-label="Add to Cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FloatingProductCard;
