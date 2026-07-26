const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategory = require("../model/subCategoryModel");
const AppError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObj = filterObject;
  next();
};

// @desc   Get list of subCategories
// @route  GET /api/v1/subcategories
// @access public
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  // Build query
  const documentsCount = await SubCategory.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .limitFields()
    .sorting();

  const { mongooseQuery, pagination } = apiFeatures;
  // Execute the query
  const subCategories = await mongooseQuery;

  res
    .status(200)
    .json({ results: subCategories.length, pagination, data: subCategories });
});

// @desc   Get Specific subCategory by id
// @route  GET /api/v1/subcategories/:id
// @access public
exports.getSubCategory = factory.createOne(SubCategory);

// GET /api/v1/categories/:categoryId/subcategories
exports.setCategoryIdToBody = (req, res, next) => {
  // @deac Nested routes
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc   Create subCategory
// @route  POST /api/v1/subcategories
// @access private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc   Update specific subCategory
// @route  PUT /api/v1/subcategories/:id
// @access private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc   Delete specific subCategory
// @route  DELETE /api/v1/subcategories/:id
// @access private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
