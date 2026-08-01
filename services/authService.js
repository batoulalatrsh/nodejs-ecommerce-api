const asyncHandler = require("express-async-handler");
const AppError = require("../utils/apiError");
const User = require("../model/userModel");

exports.signup = asyncHandler(async (req, res, next) => {
  // 1) Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // 2) Generate token
});
