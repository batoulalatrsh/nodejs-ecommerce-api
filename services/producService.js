const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const AppError = require("../utils/apiError");

// @desc   Get list of products
// @route  GET /api/v1/products
// @access public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 2;
  const skip = (page - 1) * limit;

  const products = await Product.find({}, { __v: false })
    .skip(skip)
    .limit(limit);
  res.status(200).json({ results: products.length, page, data: products });
});

// @desc   Get Specific product by id
// @route  GET /api/v1/products/:id
// @access public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError(`No Product for this id: ${req.params.id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc   Create roduct
// @route  POST /api/v1/products
// @access private
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);

  const product = await Product.create(req.body);

  res.status(201).json({ data: product });
});

// @desc   Update specific product
// @route  PUT /api/v1/products/:id
// @access private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.title);

  const updatedProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!updatedProduct) {
    return next(new AppError(`No Product for this id: ${req.params.id}`, 404));
  }
  res.status(200).json({ data: updatedProduct });
});

// @desc   Delete specific product
// @route  DELETE /api/v1/products/:id
// @access private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.deleteOne({ _id: id });

  if (!product) {
    return next(new AppError(`No Product for this id: ${req.params.id}`, 404));
  }
  res.status(204).json();
});
