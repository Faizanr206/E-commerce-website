const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const products = [
  {
    name: 'Soft Cuddle Bear',
    description: 'Ultra-soft, organic cotton plush bear. Perfect for bedtime snuggles and tactile development.',
    category: 'Plushies',
    basePrice: 2500,
    stock: 50,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11',
        public_id: 'bear1',
      },
    ],
    options: [
      { name: 'Color', values: ['Honey Brown', 'Cloud White', 'Sky Blue'] },
      { name: 'Size', values: ['Small (20cm)', 'Large (40cm)'] },
    ],
  },
  {
    name: 'Organic Rubber Teether',
    description: 'Eco-friendly, food-grade natural rubber teether. Easy to grip for tiny hands and soothing for gums.',
    category: 'Teethers',
    basePrice: 1200,
    stock: 100,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522771917563-ee75ff71e23f',
        public_id: 'teether1',
      },
    ],
    options: [
      { name: 'Shape', values: ['Giraffe', 'Elephant', 'Star'] },
    ],
  },
  {
    name: 'Wooden Activity Gym',
    description: 'Minimalist wooden baby gym with 3 hanging sensory toys. Promotes motor skills and curiosity.',
    category: 'Activity',
    basePrice: 8500,
    stock: 15,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1',
        public_id: 'gym1',
      },
    ],
    options: [
      { name: 'Wood Finish', values: ['Natural Pine', 'Smooth Walnut'] },
    ],
  },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create Admin
    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@antigravity.com',
      password: 'adminpassword123',
      role: 'admin',
    });

    // Create Products
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser._id };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const Order = require('./src/models/Order');
importData();
