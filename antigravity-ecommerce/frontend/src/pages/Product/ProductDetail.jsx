import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Plus, Minus, ArrowLeft, Star, AlertCircle, Quote } from 'lucide-react';
import StarRating from '../../components/StarRating';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart: addToCartContext } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMsg, setCartMsg] = useState('');

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      await fetchProduct();
      setRating(0);
      setComment('');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="py-20 text-center animate-pulse">Loading Antigravity Data...</div>;
  if (!product) return <div className="py-20 text-center text-red-500 font-bold">Product not found in this sector.</div>;

  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(product.basePrice);

  return (
    <div className="py-10 max-w-6xl mx-auto px-4">
      <Link to="/" className="inline-flex items-center gap-2 mb-10 text-muted hover:text-accent transition-colors font-bold uppercase tracking-widest text-xs">
        <ArrowLeft size={16} /> Return to Home
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-6">
          <div className="glass rounded-[2rem] overflow-hidden aspect-square border border-glass-border">
            <img src={product.images[selectedImage]?.url || product.images[0]?.url} alt={product.name} className="w-full h-full object-cover animate-float-slow transition-all duration-500" />
          </div>
          <div className="flex flex-wrap gap-4">
            {product.images.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedImage(i)}
                className={`w-24 h-24 rounded-2xl glass border-glass-border overflow-hidden cursor-pointer hover:border-accent transition-all ${selectedImage === i ? 'border-accent ring-2 ring-accent/20' : ''}`}
              >
                <img src={img.url} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-8">
          <h1 
            className="text-5xl font-black uppercase tracking-tighter leading-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, var(--gradient-from), var(--gradient-via), var(--gradient-to))`
            }}
          >
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4">
             <StarRating rating={product.averageRating} />
             <span className="text-muted text-sm font-bold uppercase tracking-widest border-l border-glass-border pl-4">
                {product.numReviews} LEGEND STORIES
             </span>
          </div>

          <p className="text-xl text-muted leading-relaxed">
            {product.description}
          </p>

          <div className="text-5xl font-black text-accent">{formattedPrice}</div>

          <div className="h-px bg-glass-border" />

          {product.options?.map((opt) => (
            <div key={opt.name}>
              <h3 className="text-sm font-black uppercase tracking-widest text-muted mb-4">{opt.name}</h3>
              <div className="flex flex-wrap gap-3">
                {opt.values.map(val => {
                  const isColor = opt.name.toLowerCase() === 'color';
                  // Simple color map for the dot
                  const colorMap = {
                    'honey brown': '#a16207',
                    'cloud white': '#f8fafc',
                    'sky blue': '#0ea5e9',
                    'natural pine': '#d4d4d8',
                    'smooth walnut': '#451a03',
                  };
                  const dotColor = colorMap[val.toLowerCase()] || val.toLowerCase();

                  return (
                    <button 
                      key={val} 
                      onClick={() => setSelectedOptions({ ...selectedOptions, [opt.name]: val })}
                      className={`px-6 py-3 rounded-xl border-2 font-bold transition-all flex items-center gap-3 ${selectedOptions[opt.name] === val ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' : 'glass border-glass-border hover:border-accent text-text'}`}
                    >
                      {isColor && (
                        <span 
                          className="w-4 h-4 rounded-full border border-black/10 shadow-sm" 
                          style={{ backgroundColor: dotColor }}
                        />
                      )}
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-4 bg-bg px-4 py-3 rounded-2xl border border-glass-border">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="hover:text-accent transition-colors"
              >
                <Minus size={24} />
              </button>
              <span className="w-12 text-center text-xl font-bold">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="hover:text-accent transition-colors"
              >
                <Plus size={24} />
              </button>
            </div>

            <button
              onClick={async () => {
                if (!user) {
                  setCartMsg('Please login to add items to your basket.');
                  return;
                }
                const optionsSelected = Object.keys(selectedOptions).length === (product.options?.length || 0);
                if (!optionsSelected) {
                  alert('Please select all available options.');
                  return;
                }
                setCartLoading(true);
                setCartMsg('');
                try {
                  await addToCartContext(product, qty, selectedOptions);
                  setCartMsg('✓ Added to basket!');
                  setTimeout(() => setCartMsg(''), 2500);
                } catch {
                  setCartMsg('Failed to add. Please try again.');
                } finally {
                  setCartLoading(false);
                }
              }}
              disabled={cartLoading}
              className="flex-1 bg-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-accent/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {cartLoading ? 'Adding...' : 'Add to Basket'}
              <ShoppingCart size={24} />
            </button>
          </div>
          {cartMsg && (
            <p className={`text-sm font-bold uppercase tracking-widest text-center py-2 ${cartMsg.startsWith('✓') ? 'text-green-500' : 'text-red-500'}`}>
              {cartMsg}
            </p>
          )}
        </motion.div>
      </div>

      {/* Reviews Section */}
      <section className="mt-32">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4">
          Adventure Logs
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-10">
          <div className="lg:col-span-2 space-y-10">
            {product.reviews.length === 0 ? (
              <div className="py-10 text-muted italic font-medium opacity-50 uppercase tracking-widest">
                No telemetry received yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {product.reviews.map((rev) => (
                  <motion.div
                    key={rev._id}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="glass p-8 rounded-3xl animate-float relative overflow-hidden"
                  >
                    <Quote className="absolute top-4 right-4 text-accent/5" size={80} />
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-black uppercase tracking-widest text-lg">{rev.name}</h4>
                        <p className="text-xs text-muted font-bold mt-1 uppercase">
                          Report Field: {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <StarRating rating={rev.rating} />
                    </div>
                    <p className="text-muted leading-relaxed relative z-10 italic">
                      "{rev.comment}"
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="glass p-8 rounded-3xl sticky top-24">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-6">File New Report</h3>
              
              {!user ? (
                <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20 text-center">
                  <p className="text-muted mb-4 font-medium uppercase tracking-widest text-xs">
                    Access Denied
                  </p>
                  <Link to="/login" className="text-accent font-bold hover:underline">
                    Login to Submit Telemetry
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  {reviewError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-500 text-sm font-medium">
                      <AlertCircle size={18} />
                      {reviewError}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-muted mb-3">Rating</label>
                    <StarRating rating={rating} setRating={setRating} interactive />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-muted mb-3">Comment (10+ Chars)</label>
                    <textarea
                      required
                      placeholder="Share your weightless experience..."
                      className="w-full bg-bg/50 border border-glass-border rounded-2xl p-4 min-h-[120px] focus:ring-2 focus:ring-accent outline-none"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full bg-accent text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    {reviewLoading ? 'Bubbling...' : 'Post Story'}
                  </button>
                  <p className="text-[10px] text-center text-muted uppercase tracking-widest leading-relaxed">
                    Verified purchase protocol enforced.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
