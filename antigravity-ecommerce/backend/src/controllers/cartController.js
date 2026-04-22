const User = require('../models/User');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('cart');
    res.json(user.cart);
  } catch (error) {
    console.error('getCart error:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// @desc    Add or update item in cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { product, name, image, price, qty, selectedOptions } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const optionKey = JSON.stringify(selectedOptions || {});
    const existingIndex = user.cart.findIndex(
      (item) =>
        item.product.toString() === product &&
        JSON.stringify(item.selectedOptions) === optionKey
    );

    if (existingIndex >= 0) {
      user.cart[existingIndex].qty += qty;
    } else {
      user.cart.push({ product, name, image, price, qty, selectedOptions: selectedOptions || {} });
    }

    // Using findByIdAndUpdate to avoid triggering full validation (like password) on save()
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { cart: user.cart },
      { new: true, runValidators: true }
    ).select('cart');

    res.json(updatedUser.cart);
  } catch (error) {
    console.error('addToCart error:', error.message);
    res.status(500).json({ message: error.message || 'Error adding to cart' });
  }
};

// @desc    Update quantity of a cart item
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { qty } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const item = user.cart.find((i) => i.product.toString() === req.params.productId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (qty <= 0) {
      user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
    } else {
      item.qty = qty;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { cart: user.cart },
      { new: true, runValidators: true }
    ).select('cart');

    res.json(updatedUser.cart);
  } catch (error) {
    console.error('updateCartItem error:', error);
    res.status(500).json({ message: 'Error updating cart item' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { cart: user.cart },
      { new: true }
    ).select('cart');

    res.json(updatedUser.cart);
  } catch (error) {
    console.error('removeFromCart error:', error);
    res.status(500).json({ message: 'Error removing from cart' });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { cart: [] },
      { new: true }
    ).select('cart');

    res.json(updatedUser.cart);
  } catch (error) {
    console.error('clearCart error:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
