const asyncHandler = require("express-async-handler");
const AppError = require("../utils/apiError");
const Cart = require("../model/cartModel");
const Product = require("../model/productModel");
const Coupon = require("../model/couponModel");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
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
  calcTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
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

// @desc   Remove specific cart item
// @route  DELETE /api/v1/cart/:itemId
// @access Private/User
exports.deleteSpecificCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true },
  );

  calcTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    message: "Product removed from cart successfully",
    data: cart,
  });
});

// @desc   Remove logged user cart
// @route  DELETE /api/v1/cart
// @access Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(204).send();
});

// @desc   Update specifc cart item quantity
// @route  PUT /api/v1/cart/:itemId
// @access Private/User
exports.updateSpecificCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOneAndUpdate({ user: req.user._id });

  if (!cart) {
    return next(
      new AppError(`There is no cart for this user ${req.user._id}`, 404),
    );
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId.toString(),
  );

  if (itemIndex > -1) {
    cart.cartItems[itemIndex].quantity = quantity;
  } else {
    return next(
      new AppError(`There is no item for this id ${req.params.itemId}`, 404),
    );
  }

  calcTotalPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc   Apply coupon on logged iser cart
// @route  PUT /api/v1/cart/applyCoupon
// @access Private/User
exports.applayCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.couponName,
    expire: { $gt: Date.now() },
  });

  console.log(coupon);
  if (!coupon) {
    return next(new AppError("Coupon is expired or invalid", 400));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });
  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
