const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("../utils/apiError");
const User = require("../model/userModel");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// @desc   Signup
// @route  POST /api/v1/auth/signup
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
// @route  POST /api/v1/auth/login
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

// @desc Make sure that user is logged in
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
  // 2) Verify token (no change happen, expired token), verify method throw error
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new AppError("The user that belong to this token does not exist", 401),
    );
  }
  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new AppError(
          "User recently change his password, please login again",
          401,
        ),
      );
    }
  }
  req.user = currentUser;
  next();
});

// @desc Autorization (user permission)
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered use (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to access this route", 403),
      );
    }
    next();
  });

// @desc   Forgot password
// @route  post /api/v1/auth/forgotPassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(`There is no user for this email ${req.body.email}`, 404),
    );
  }

  // 2) If user exist, Generate hash reset random 6 digits and save in DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // We convert it to string to hash it(as it is sensitive data)
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password resetcode into DB
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password code(10 min)
  user.passwordReserExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on E-shop Account. \n ${resetCode} \n Enter the code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code valid for 10 minutes",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordReserExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new AppError("There is an error in sending code", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email." });
});

// @desc   Verify Reset code
// @route  post /api/v1/auth/verifyResetCode
// @access Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.code)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordReserExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Reset code invalid or expired", 404));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: "Success" });
});

// @desc   Reset password
// @route  post /api/v1/auth/resetPassword
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(`There is no user for this email ${req.body.email}`, 404),
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(
      new AppError(`Reset code is not verified ${req.body.email}`, 400),
    );
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordReserExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) If everything is ok, generate token
  const token = generateToken(user._id);

  res.status(200).json({ token });
});
