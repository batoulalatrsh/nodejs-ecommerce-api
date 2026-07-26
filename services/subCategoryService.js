const SubCategory = require("../model/subCategoryModel");
const factory = require("./handlersFactory");

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObj = filterObject;
  next();
};

// @desc   Get list of subCategories
// @route  GET /api/v1/subcategories
// @access public
exports.getSubCategories = factory.getAll(SubCategory);

// @desc   Get Specific subCategory by id
// @route  GET /api/v1/subcategories/:id
// @access public
exports.getSubCategory = factory.getOne(SubCategory);

// GET /api/v1/categories/:categoryId/subcategories
exports.setCategoryIdToBody = (req, res, next) => {
  // @deac Nested routes
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc   Create subCategory
// @route  POST /api/v1/subcategories
// @access private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc   Update specific subCategory
// @route  PUT /api/v1/subcategories/:id
// @access private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc   Delete specific subCategory
// @route  DELETE /api/v1/subcategories/:id
// @access private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
