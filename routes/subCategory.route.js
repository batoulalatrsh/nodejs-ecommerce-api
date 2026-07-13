const express = require("express");
const { createSubCategory } = require("../services/subCategoryService");
const {
  createsubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const router = express.Router();

router.route("/").post(createsubCategoryValidator, createSubCategory);

module.exports = router;
