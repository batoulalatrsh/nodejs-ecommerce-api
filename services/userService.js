const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcrypt");

const User = require("../model/userModel");
const factory = require("./handlersFactory");
const AppError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const generateToken = require("../utils/generateToken");

// Upload single image
exports.uploadUseryImage = uploadSingleImage("profileImg");
// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);
    // Save image into our DB
    req.body.profileImg = filename;
  }
  next();
});

// @desc   Get list of users
// @route  GET /api/v1/users
// @access private
exports.getUsers = factory.getAll(User);

// @desc   Get Specific user by id
// @route  GET /api/v1/users/:id
// @access private
exports.getUser = factory.getOne(User);

// @desc   Create user
// @route  POST /api/v1/users
// @access private
exports.createUser = factory.createOne(User);

// @desc   Update specific user
// @route  PUT /api/v1/users/:id
// @access private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findOneAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      email: req.body.email,
      role: req.body.role,
    },
    { new: true },
  );
  if (!document) {
    return next(new AppError(`No document for this id: ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const document = await User.findOneAndUpdate(
    { _id: req.params.id },
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true },
  );
  if (!document) {
    return next(new AppError(`No document for this id: ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc   Delete specific user
// @route  DELETE /api/v1/users/:id
// @access private
exports.deleteUser = factory.deleteOne(User);

// @desc   Get logged user data
// @route  GET /api/v1/users/getMe
// @access private/protected
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc   Update logged user password
// @route  PUT /api/v1/users/updatePassword
// @access private/protected
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true },
  );

  // 2) Generate token
  const token = await generateToken(user._id);
  res.status(200).json({ data: user, token });
});

// @desc   Update logged user (data without password)
// @route  PUT /api/v1/users/updateMe
// @access private/protected
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user._id },
    { name: req.body.name, email: req.body.email, phone: req.body.phone },
    { new: true },
  );
  res.status(200).json({ data: updatedUser });
});

// @desc   Delete logged user
// @route  DELETE /api/v1/users/deleteMe
// @access private/protected
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate({ _id: req.user._id }, { active: false });
  res.status(204).json({ status: "Success" });
});
