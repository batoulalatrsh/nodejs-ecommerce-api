const express = require("express");

const subCategoriesRoute = require("./subCategory.route");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");
const AuthService = require("../services/authService");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory,
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    AuthService.protect,
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory,
  )
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
