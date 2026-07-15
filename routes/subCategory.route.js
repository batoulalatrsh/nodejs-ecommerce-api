const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../services/subCategoryService");
const {
  createsubCategoryValidator,
  getSubcategoryValidator,
  updatesubCategoryValidator,
  deletesubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

// @desc mergeParams: Allow us to access parameters on other routers
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getSubCategories)
  .post(createsubCategoryValidator, createSubCategory);

router
  .route("/:id")
  .get(getSubcategoryValidator, getSubCategory)
  .put(updatesubCategoryValidator, updateSubCategory)
  .delete(deletesubCategoryValidator, deleteSubCategory);

module.exports = router;
