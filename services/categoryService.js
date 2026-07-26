const Category = require("../model/categoryModel");
const factory = require("./handlersFactory");

// @desc   Get list of categories
// @route  GET /api/v1/categories
// @access public
const getCategories = factory.getAll(Category);

// @desc   Get Specific category by id
// @route  GET /api/v1/categories/:id
// @access public
const getCategory = Category;

// @desc   Create category
// @route  POST /api/v1/categories
// @access private
const createCategory = factory.createOne(Category);

// @desc   Update specific category
// @route  PUT /api/v1/categories/:id
// @access private
const updateCategory = factory.updateOne(Category);

// @desc   Delete specific category
// @route  DELETE /api/v1/categories/:id
// @access private
const deleteCategory = factory.deleteOne(Category);

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
