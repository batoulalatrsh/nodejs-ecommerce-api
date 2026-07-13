const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategory = require("../model/categoryModel");
const AppError = require("../utils/apiError");

// @desc   Create subCategory
// @route  POST /api/v1/subCategories
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
