const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const Brand = require("../model/brandModel");
const AppError = require("../utils/apiError");

// @desc   Get list of brands
// @route  GET /api/v1/brands
// @access public
exports.getBrands = asyncHandler(async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 2;
  const skip = (page - 1) * limit;

  const brands = await Brand.find({}, { __v: false }).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, data: brands });
});

// @desc   Get Specific brand by id
// @route  GET /api/v1/brands/:id
// @access public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return next(new AppError(`No Brand for this id: ${req.params.id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc   Create brand
// @route  POST /api/v1/brands
// @access private
exports.createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const brand = await Brand.create({
    name,
    slug: slugify(name),
  });

  res.status(201).json({ data: brand });
});

// @desc   Update specific category
// @route  PUT /api/v1/categories/:id
// @access private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const updatedBrand = await Brand.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true },
  );
  if (!updatedBrand) {
    return next(new AppError(`No Brand for this id: ${req.params.id}`, 404));
  }
  res.status(200).json({ data: updatedBrand });
});

// @desc   Delete specific brand
// @route  DELETE /api/v1/brands/:id
// @access private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.deleteOne({ _id: id });

  if (!brand) {
    return next(new AppError(`No Brand for this id: ${req.params.id}`, 404));
  }
  res.status(204).json();
});
