const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
} = require("../services/categoryService");

router.route("/").get(getCategories).post(createCategory);

module.exports = router;
