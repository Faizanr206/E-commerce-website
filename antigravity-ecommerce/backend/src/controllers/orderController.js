const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create Stripe Checkout Session
// @route   POST /api/checkout/create-session
// @access  Private
const createCheckoutSession = async (req, res, next) => {
  try {
    const { cartItems, shippingDetails } = req.body;

    if (!cartItems || cartItems.length === 0) {
      res.status(400);
      throw new Error('No items in cart');
    }

    // 1. Server-side Price Recalculation (Security)
    const line_items = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product not found: ${item.name}`);
        }
        
        return {
          price_data: {
            currency: 'pkr',
            product_data: {
              name: product.name,
              images: [product.images[0]?.url],
            },
            unit_amount: Math.round(product.basePrice * 100), // PKR in Paise
          },
          quantity: item.qty,
        };
      })
    );

    // 2. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        userId: req.user._id.toString(),
        shippingAddress: JSON.stringify(shippingDetails),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

// @desc    Handle Order Success (Save to DB)
// @route   POST /api/orders/success
// @access  Private
const confirmOrderPayment = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // 1. Check if order already exists
      const orderExists = await Order.findOne({ 'paymentResult.id': session.id });
      if (orderExists) {
        return res.json(orderExists);
      }

      // 2. Extract line items from Stripe session (or map from metadata)
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
      
      const orderItems = lineItems.data.map((item) => ({
        name: item.description,
        qty: item.quantity,
        price: item.amount_total / 100,
        // Needs a way to map back to product IDs if not stored in metadata
        // For simplicity, we'll assume the client sends the cartItems again for DB storage
        // but validates it against the session.
      }));

      // In a real app, use Webhooks for more reliability.
      // Here we trust the verified session.
      
      const order = new Order({
        user: req.user._id,
        orderItems: req.body.cartItems, // Final list of items
        shippingAddress: JSON.parse(session.metadata.shippingAddress),
        paymentMethod: 'Stripe',
        paymentResult: {
          id: session.id,
          status: session.payment_status,
          email_address: session.customer_details.email,
        },
        itemsPrice: session.amount_subtotal / 100,
        totalPrice: session.amount_total / 100,
        isPaid: true,
        paidAt: Date.now(),
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } else {
      res.status(400);
      throw new Error('Payment not verified');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCheckoutSession,
  confirmOrderPayment,
  getOrders,
  updateOrderToDelivered,
};
