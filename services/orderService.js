const asyncHandler = require("express-async-handler");

const Order = require("../model/orderModel");
const Cart = require("../model/cartModel");
const Product = require("../model/productModel");
const factory = require("./handlersFactory");
const AppError = require("../utils/apiError");

// @desc   Create cash order
// @route  POST /api/v1/orders/cartId
// @access Protected/user

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // app settings
  const shippingPrice = 0;
  const taxPrice = 0;

  // 1) Get cart depent on cartId
  const cart = await Cart.findById(req.params.id);
  if (!cart) {
    return next(new AppError("There is no cart with this id"), 404);
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default payment method "Cash"
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order, decreament product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.id);
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});

// @desc   Get all orders
// @route  GET /api/v1/orders
// @access Protected/User-Manger-Admin
exports.getAllOrders = factory.getAll(Order);

// @desc   Get specific order
// @route  GET /api/v1/orders/:orderId
// @access Protected/User-Manger-Admin
exports.findSpecificOrder = factory.getOne(Order);

// @desc   Update order paid status to paid
// @route  PUT /api/v1/orders/:id/pay
// @access Protected/Manger-Admin
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new AppError(`There is no such a order id: ${req.params.id}`, 404),
    );
  }

  // Update order to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

// @desc   Update order delivered status to delivered
// @route  PUT /api/v1/orders/:id/delivered
// @access Protected/Manger-Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new AppError(`There is no such a order id: ${req.params.id}`, 404),
    );
  }

  // Update order to paid
  order.isDelivered = true;
  order.deliverAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});
