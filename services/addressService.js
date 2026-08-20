const asyncHandler = require("express-async-handler");

const User = require("../model/userModel");

// @desc   Add address to user addresses list
// @route  POST /api/v1/addresses
// @access private/user
exports.addAddress = asyncHandler(async (req, res, next) => {
  // $addToSet=> Add addresses use addresses array
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    data: user.addresses,
  });
});

// @desc   delete addresses
// @route  DELETE /api/v1/addresses/:addressId
// @access private/user
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  // $pull=> Remove address from addresses list
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: "Address remove successfully from address list",
    data: user.addresses,
  });
});

// @desc   Get address
// @route  GET /api/v1/address
// @access private/user
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    status: "success",
    data: user.addresses,
  });
});
