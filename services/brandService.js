const Brand = require("../model/brandModel");
const factory = require("./handlersFactory");

// @desc   Get list of brands
// @route  GET /api/v1/brands
// @access public
exports.getBrands = factory.getAll(Brand);

// @desc   Get Specific brand by id
// @route  GET /api/v1/brands/:id
// @access public
exports.getBrand = factory.getOne(Brand);

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
