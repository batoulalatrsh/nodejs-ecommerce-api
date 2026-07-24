const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const AppError = require("../utils/apiError");

// @desc   Get list of products
// @route  GET /api/v1/products
// @access public
exports.getProducts = asyncHandler(async (req, res, next) => {
  // 1) Filtering
  const queryStringObj = { ...req.query };
  const excludedFields = ["page", "limit", "sort", "fields", "keyword"];
  excludedFields.forEach((field) => delete queryStringObj[field]);

  // { ratingsAverage: { gte: '4' }, price: { gte: '50' } }
  // { ratingsAverage: { '$gte': '4' }, price: { '$gte': '50' } }
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // 2) Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  // Build query
  let mongooseQuery = Product.find(JSON.parse(queryStr));

  // 3) Search
  if (req.query.keyword) {
    console.log(req.query.keyword);
    const query = {};
    // $or is operator in MongoDB
    query.$or = [
      { title: { $regex: req.query.keyword, $options: "i" } },
      { description: { $regex: req.query.keyword, $options: "i" } },
    ];

    mongooseQuery = mongooseQuery.find(query);
  }

  // 4) Sorting
  if (req.query.sort) {
    //price,-sold => ["price","-sold"] "price-sold"
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }

  // 5) Fielsd Limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }

  // Execute the query
  const products = await mongooseQuery
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });
  res.status(200).json({ results: products.length, page, data: products });
});

// @desc   Get Specific product by id
// @route  GET /api/v1/products/:id
// @access public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: "category",
    select: "name -_id",
  });
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
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

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
