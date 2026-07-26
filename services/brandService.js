const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Brand = require("../model/brandModel");
const AppError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");
// @desc   Get list of brands
// @route  GET /api/v1/brands
// @access public
exports.getBrands = asyncHandler(async (req, res, next) => {
  // Build query
  const documentsCount = await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .limitFields()
    .sorting();

  const { mongooseQuery, pagination } = apiFeatures;
  // Execute the query
  const brands = await mongooseQuery;
  res
    .status(200)
    .json({ results: brands.length, page: pagination, data: brands });
});

// @desc   Get Specific brand by id
// @route  GET /api/v1/brands/:id
// @access public
exports.getBrand = factory.createOne(Brand);

// @desc   Create brand
// @route  POST /api/v1/brands
// @access private
exports.createBrand = factory.createOne(Brand);

// @desc   Update specific category
// @route  PUT /api/v1/categories/:id
// @access private
exports.updateBrand = factory.updateOne(Brand);

// @desc   Delete specific brand
// @route  DELETE /api/v1/brands/:id
// @access private
exports.deleteBrand = factory.deleteOne(Brand);
