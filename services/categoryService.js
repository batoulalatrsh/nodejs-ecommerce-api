const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Category = require("../model/categoryModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");
// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

  // Save image into our DB
  req.body.image = filename;
  next();
});

// @desc   Get list of categories
// @route  GET /api/v1/categories
// @access public
exports.getCategories = factory.getAll(Category);

// @desc   Get Specific category by id
// @route  GET /api/v1/categories/:id
// @access public
exports.getCategory = factory.getOne(Category);

// @desc   Create category
// @route  POST /api/v1/categories
// @access private
exports.createCategory = factory.createOne(Category);

// @desc   Update specific category
// @route  PUT /api/v1/categories/:id
// @access private
exports.updateCategory = factory.updateOne(Category);

// @desc   Delete specific category
// @route  DELETE /api/v1/categories/:id
// @access private
exports.deleteCategory = factory.deleteOne(Category);
