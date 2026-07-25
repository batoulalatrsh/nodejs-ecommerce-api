const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategory = require("../model/subCategoryModel");
const AppError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

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
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await SubCategory.findById(req.params.id);

  if (!subCategory) {
    return next(
      new AppError(`No SubCategory for this id: ${req.params.id}`, 404),
    );
  }
  res.status(200).json({ data: subCategory });
});

// GET /api/v1/categories/:categoryId/subcategories
exports.setCategoryIdToBody = (req, res, next) => {
  // @deac Nested routes
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc   Create subCategory
// @route  POST /api/v1/subcategories
// @access private
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;

  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(201).json({ data: subCategory });
});

// @desc   Update specific subCategory
// @route  PUT /api/v1/subcategories/:id
// @access private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const updatedSubCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true },
  );
  if (!updatedSubCategory) {
    return next(
      new AppError(`No SubCategory for this id: ${req.params.id}`, 404),
    );
  }
  res.status(200).json({ data: updatedSubCategory });
});

// @desc   Delete specific subCategory
// @route  DELETE /api/v1/subcategories/:id
// @access private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.deleteOne({ _id: id });

  if (!subCategory) {
    return next(
      new AppError(`No SubCategory for this id: ${req.params.id}`, 404),
    );
  }
  res.status(204).json();
});
