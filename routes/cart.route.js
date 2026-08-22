const express = require("express");

const router = express.Router();
const {
  addProductToCart,
  getLoggedUserCart,
} = require("../services/cartService");
const authService = require("../services/authService");

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").get(getLoggedUserCart).post(addProductToCart);

module.exports = router;
