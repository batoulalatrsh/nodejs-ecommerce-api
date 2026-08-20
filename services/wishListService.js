const asyncHandler = require("express-async-handler");

const User = require("../model/userModel");

// @desc   Add product to wishList
// @route  POST /api/v1/wishList
// @access private/user
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  // $addToSet=> Add product To wishlist array if product exist and dont dublicate items

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: req.body.productId },
    },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: "Product added successfully to wishList",
    data: user.wishList,
  });
});

// @desc   delete product from wishList
// @route  DELETE /api/v1/wishList
// @access private/user
exports.deleteProductFromWishList = asyncHandler(async (req, res, next) => {
  // $pull=> Remove product from wishlist array if product exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishList: req.params.productId },
    },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: "Product remove successfully to wishList",
    data: user.wishList,
  });
});

// @desc   Get products from wishList
// @route  GET /api/v1/wishList
// @access private/user
exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishList");
  res.status(200).json({
    status: "success",
    data: user.wishList,
  });
});
