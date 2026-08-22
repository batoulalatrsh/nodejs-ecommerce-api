const asyncHandler = require("express-async-handler");
const AppError = require("../utils/apiError");
const Cart = require("../model/cartModel");
const Product = require("../model/productModel");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  return totalPrice;
};

// @desc   Add product to cart
// @route  POST /api/v1/cart
// @access Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  // Get Cart of logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create cart for this user with this product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // If product exist, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId.toString() &&
        item.color === color,
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // If dont exist, Push product to cartItems
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  // Calculate total cart price
  const totalPrice = calcTotalPrice(cart);
  cart.totalCartPrice = totalPrice;

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    data: cart,
  });
});

// @desc   Get logged user cart
// @route  GET /api/v1/cart
// @access Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new AppError(`There is no cart for this user id: ${req.user._id}`, 404),
    );
  }

  res.status(200).json({
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
