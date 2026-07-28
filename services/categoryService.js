const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const sharp = require("sharp");

const Category = require("../model/categoryModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

// 1-DiskStorage solution
// const multerstorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     // category-${id}-Data.now().jpeg
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

// 2) Memeory Storage engine
const multerstorage = multer.memoryStorage({});

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images allowed", 400), false);
  }
};
const upload = multer({ storage: multerstorage, fileFilter: multerFilter });
exports.uploadCategoryImage = upload.single("image");

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
