const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcrypt");

const User = require("../model/userModel");
const factory = require("./handlersFactory");
const AppError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

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
