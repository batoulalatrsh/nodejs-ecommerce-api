const Category = require("../model/categoryModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

// @desc   Get list of categories
// @route  GET /api/v1/categories
// @access public
const getCategories = asyncHandler(async (req, res, next) => {
  const query = req.query;
  const page = +query.page || 1;
  const limit = +query.limit || 2;
  const skip = (page - 1) * limit;

  const categories = await Category.find({}, { __v: false })
    .skip(skip)
    .limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc   Get Specific category by id
// @route  GET /api/v1/categories/:id
// @access public
const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404).json({ msg: `No Category for this id: ${req.params.id}` });
  }
  res.status(200).json({ data: category });
});

// @desc   Create category
// @route  POST /api/v1/categories
// @access private
const createCategory = asyncHandler(async (req, res, next) => {
  const name = req.body.name;

  const category = await Category.create({
    name,
    slug: slugify(name),
  });

  res.status(201).json({ data: category });
});

// @desc   Update specific category
// @route  PUT /api/v1/categories/:id
// @access private
const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const updatedCategory = await Category.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true },
  );
  if (!updatedCategory) {
    res.status(404).json({ msg: `No Category for this id: ${id}` });
  }
  res.status(200).json({ data: updatedCategory });
});

// @desc   Delete specific category
// @route  DELETE /api/v1/categories/:id
// @access private
const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.deleteOne({_id:id});

  if (!category) {
    res.status(404).json({ msg: `No Category for this id: ${id}` });
  }
  res.status(204).json();
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
