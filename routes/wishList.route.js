const express = require("express");

const router = express.Router();

const {
  addProductToWishList,
  deleteProductFromWishList,
  getLoggedUserWishList,
} = require("../services/wishListService");
const authService = require("../services/authService");
const {
  addProductToWishListValidator,
} = require("../utils/validators/wishListValidator");

router.use(authService.protect, authService.allowedTo("user"));
router
  .route("/")
  .post(addProductToWishListValidator, addProductToWishList)
  .get(getLoggedUserWishList);

router.delete("/:productId", deleteProductFromWishList);
module.exports = router;
