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
    <div className="py-24 max-w-7xl mx-auto px-6">
      <div className="mb-12">
        <Link to="/" className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors font-semibold text-sm">
          <ArrowLeft size={16} strokeWidth={2} /> Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-6">
          <div className="soft-card overflow-hidden aspect-square border border-[var(--border-color)]">
            <img src={product.images[selectedImage]?.url || product.images[0]?.url} alt={product.name} className="w-full h-full object-cover transition-all duration-500" />
          </div>
          <div className="flex flex-wrap gap-4">
            {product.images.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedImage(i)}
                className={`w-24 h-24 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === i ? 'border-[var(--text)]' : 'border-transparent hover:border-[var(--muted)]'}`}
              >
                <img src={img.url} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text)] leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4">
             <StarRating rating={product.averageRating} />
             <span className="text-[var(--muted)] text-sm font-semibold border-l border-[var(--border-color)] pl-4">
                {product.numReviews} Reviews
             </span>
          </div>

          <div className="text-3xl font-bold text-[var(--text)]">{formattedPrice}</div>

          <p className="text-lg text-[var(--muted)] leading-relaxed mt-2 mb-4">
            {product.description}
          </p>

          <div className="h-px w-full bg-[var(--border-color)] my-2" />

          {product.options?.map((opt) => (
            <div key={opt.name}>
              <h3 className="text-sm font-bold text-[var(--text)] mb-3">{opt.name}</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {opt.values.map(val => {
                  const isColor = opt.name.toLowerCase() === 'color';
                  return (
                    <button 
                      key={val} 
                      onClick={() => setSelectedOptions({ ...selectedOptions, [opt.name]: val })}
                      className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all flex items-center gap-2 ${selectedOptions[opt.name] === val ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]' : 'bg-transparent text-[var(--text)] border-[var(--border-color)] hover:border-[var(--text)]'}`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <div className="flex items-center justify-between w-full sm:w-auto bg-[var(--bg)] px-4 py-3 rounded-full border border-[var(--border-color)]">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="hover:text-[var(--text)] text-[var(--muted)] transition-colors p-1"
              >
                <Minus size={20} />
              </button>
              <span className="w-12 text-center text-lg font-bold">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="hover:text-[var(--text)] text-[var(--muted)] transition-colors p-1"
              >
                <Plus size={20} />
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
              className="w-full sm:flex-1 pill-btn whitespace-nowrap"
            >
              {cartLoading ? 'Adding...' : 'Add to Basket'}
            </button>
          </div>
          {cartMsg && (
            <p className={`text-sm font-semibold text-center mt-2 ${cartMsg.startsWith('✓') ? 'text-green-500' : 'text-red-500'}`}>
              {cartMsg}
            </p>
          )}
        </motion.div>
      </div>

      {/* Reviews Section */}
      <section className="mt-24 pt-16 border-t border-[var(--border-color)]">
        <h2 className="text-3xl font-extrabold mb-12">
          Customer Reviews
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            {product.reviews.length === 0 ? (
              <div className="py-8 text-[var(--muted)] font-medium text-lg">
                No reviews yet. Be the first to review this product.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {product.reviews.map((rev) => (
                  <motion.div
                    key={rev._id}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="soft-card p-8 relative overflow-hidden"
                  >
                    <Quote className="absolute top-6 right-6 text-[var(--border-color)]" size={48} />
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{rev.name}</h4>
                        <p className="text-sm text-[var(--muted)] mt-1">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <StarRating rating={rev.rating} />
                    </div>
                    <p className="text-[var(--muted)] leading-relaxed relative z-10">
                      "{rev.comment}"
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="soft-card p-8 sticky top-28">
              <h3 className="text-xl font-bold mb-6">Write a Review</h3>
              
              {!user ? (
                <div className="text-center">
                  <p className="text-[var(--muted)] mb-4 text-sm">
                    You must be logged in to write a review.
                  </p>
                  <Link to="/login" className="text-[var(--text)] font-semibold underline underline-offset-4 decoration-2">
                    Login to Submit Reivew
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
                    <label className="block text-sm font-semibold text-[var(--text)] mb-2">Rating</label>
                    <StarRating rating={rating} setRating={setRating} interactive />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--text)] mb-2">Comment</label>
                    <textarea
                      required
                      placeholder="Share your experience..."
                      className="w-full bg-[var(--bg)] border border-[var(--border-color)] rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-[var(--text)] outline-none transition-all"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full pill-btn"
                  >
                    {reviewLoading ? 'Submitting...' : 'Post Review'}
                  </button>
                  <p className="text-xs text-center text-[var(--muted)]">
                    Only verified purchases can be reviewed.
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
