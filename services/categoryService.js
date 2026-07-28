const multer = require("multer");
const Category = require("../model/categoryModel");
const factory = require("./handlersFactory");

const upload = multer({ storage: multerStorage });
exports.uploadCategoryImage = upload.single("image");

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
