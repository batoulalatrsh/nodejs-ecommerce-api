const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Category = require("../model/categoryModel");
const AppError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// @desc   Get list of categories
// @route  GET /api/v1/categories
// @access public
const getCategories = asyncHandler(async (req, res, next) => {
  // Build query
  const documentsCount = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .limitFields()
    .sorting();

  const { mongooseQuery, pagination } = apiFeatures;
  // Execute the query
  const categories = await mongooseQuery;

  res
    .status(200)
    .json({ results: categories.length, page: pagination, data: categories });
});

// @desc   Get Specific category by id
// @route  GET /api/v1/categories/:id
// @access public
const getCategory = factory.createOne(Category);

// @desc   Create category
// @route  POST /api/v1/categories
// @access private
const createCategory = factory.createOne(Category);

// @desc   Update specific category
// @route  PUT /api/v1/categories/:id
// @access private
const updateCategory = factory.updateOne(Category);

// @desc   Delete specific category
// @route  DELETE /api/v1/categories/:id
// @access private
const deleteCategory = factory.deleteOne(Category);

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
