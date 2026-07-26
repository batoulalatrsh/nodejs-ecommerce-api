const Product = require("../model/productModel");
const factory = require("./handlersFactory");

// @desc   Get list of products
// @route  GET /api/v1/products
// @access public
exports.getProducts = factory.getAll(Product, "products");
// @desc   Get Specific product by id
// @route  GET /api/v1/products/:id
// @access public
exports.getProduct = factory.getOne(Product);

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
