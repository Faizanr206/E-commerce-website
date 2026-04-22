const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Fetch all products with filters and sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, sort } = req.query;

    const query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    let sortOption = {};
    if (sort === 'price-low') {
      sortOption = { basePrice: 1 };
    } else if (sort === 'price-high') {
      sortOption = { basePrice: -1 };
    } else if (sort === 'rating-high') {
      sortOption = { averageRating: -1 };
    } else {
      sortOption = { createdAt: -1 }; // Newest first by default
    }

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, basePrice, stock, options, images } = req.body;

    const product = new Product({
      name,
      description,
      category,
      basePrice,
      user: req.user._id,
      images,
      options,
      stock,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      basePrice,
      stock,
      options,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.basePrice = basePrice || product.basePrice;
      product.stock = stock || product.stock;
      product.options = options || product.options;
      product.images = images || product.images;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // 1. Check if user already reviewed
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
      }

      // 2. Verified Purchase Check (Must have a completed order)
      const hasOrder = await Order.findOne({
        user: req.user._id,
        'orderItems.product': req.params.id,
        isPaid: true,
      });

      if (!hasOrder) {
        res.status(400);
        throw new Error('Verified Purchase required to review');
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.calculateAverageRating();

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get KPIs for Admin Dashboard
// @route   GET /api/products/admin/kpis
// @access  Private/Admin
const getAdminKPIs = async (req, res, next) => {
  try {
    // 1. Total Revenue
    const revenueData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);

    // 2. Total Orders
    const totalOrders = await Order.countDocuments({});

    // 3. Low Stock Items
    const lowStockItems = await Product.find({ stock: { $lt: 5 } }).countDocuments();

    // 4. Customer Growth (Signups per month) - Robust check
    let customerGrowth = [];
    try {
      customerGrowth = await User.aggregate([
        {
          $group: {
            _id: { $month: '$createdAt' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
    } catch (aggErr) {
      console.warn('Customer growth aggregation failed:', aggErr);
    }

    res.json({
      totalRevenue: (revenueData && revenueData.length > 0) ? revenueData[0].totalRevenue : 0,
      totalOrders: totalOrders || 0,
      lowStockItems: lowStockItems || 0,
      customerGrowth: customerGrowth || [],
    });
  } catch (error) {
    console.error('KPI Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch dashboard stats', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack 
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getAdminKPIs,
};
