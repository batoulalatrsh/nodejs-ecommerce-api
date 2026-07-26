const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const AppError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

// @desc   Get list of products
// @route  GET /api/v1/products
// @access public
exports.getProducts = asyncHandler(async (req, res, next) => {
  // Build query
  const documentsCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search("products")
    .limitFields()
    .sorting();

  const { mongooseQuery, pagination } = apiFeatures;
  // Execute the query
  const products = await mongooseQuery.populate({
    path: "category",
    select: "name -_id",
  });
  res.status(200).json({
    results: products.length,
    page: pagination,
    data: products,
  });
});

// @desc   Get Specific product by id
// @route  GET /api/v1/products/:id
// @access public
exports.getProduct = factory.createOne(Product);

// @desc   Create roduct
// @route  POST /api/v1/products
// @access private
exports.createProduct = factory.createOne(Product);

// @desc   Update specific product
// @route  PUT /api/v1/products/:id
// @access private
exports.updateProduct = factory.updateOne(Product);

// @desc   Delete specific product
// @route  DELETE /api/v1/products/:id
// @access private
exports.deleteProduct = factory.deleteOne(Product);
