const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      minlength: 10,
    },
  },
  {
    timestamps: true,
  }
);

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Color", "Size", "Gravity Level"
  values: [{ type: String, required: true }], // e.g., ["Red", "Blue"], ["Weightless", "Earth-bound"]
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Please add a base price'],
      min: [0, 'Price must be positive'],
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    options: [optionSchema],
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate average rating after a review is saved
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    this.averageRating =
      this.reviews.reduce((acc, item) => item.rating + acc, 0) /
      this.reviews.length;
  }
  this.numReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);
