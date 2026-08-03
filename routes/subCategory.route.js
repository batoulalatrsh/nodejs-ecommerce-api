const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");
const {
  createsubCategoryValidator,
  getSubcategoryValidator,
  updatesubCategoryValidator,
  deletesubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const authService = require("../services/authService");

// @desc mergeParams: Allow us to access parameters on other routers
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getSubCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createsubCategoryValidator,
    createSubCategory,
  );

router
  .route("/:id")
  .get(getSubcategoryValidator, getSubCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    updatesubCategoryValidator,
    updateSubCategory,
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deletesubCategoryValidator,
    deleteSubCategory,
  );

module.exports = router;
