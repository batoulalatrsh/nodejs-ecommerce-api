const express = require("express");

const router = express.Router();
const {
  addProductToCartValidator,
  deleteCartItemValidator,
} = require("../utils/validators/cartValidator");
const {
  addProductToCart,
  getLoggedUserCart,
  deleteSpecificCart,
  updateSpecificCartItem,
  clearCart,
  applayCoupon,
} = require("../services/cartService");
const authService = require("../services/authService");

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .get(getLoggedUserCart)
  .post(addProductToCartValidator, addProductToCart)
  .delete(clearCart);

router.put("/applyCoupon", applayCoupon);
router
  .route("/:itemId")
  .delete(deleteCartItemValidator, deleteSpecificCart)
  .put(updateSpecificCartItem);
module.exports = router;
