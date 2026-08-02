const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("../utils/apiError");
const User = require("../model/userModel");

function generateToken(payload) {
  return jwt.sign(
    {
      userId: payload,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
}

// @desc   Signup
// @route  GET /api/v1/signup
// @access Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1) Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // 2) Generate token
  const token = generateToken(user._id);
  res.status(201).json({ data: user, token });
});

// @desc   Login
// @route  GET /api/v1/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) Check if user exist and correct password
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // 2) Generate token
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError(
        "You are not logged in, Please login to get this route",
        401,
      ),
    );
  }
  // 2) Verify token (no change happen, expired token)
  // 3) Check if user exist
  // 4) Check if user change his password after token created
});
