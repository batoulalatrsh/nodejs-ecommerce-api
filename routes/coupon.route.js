const express = require("express");

const router = express.Router();
const {
  createCouponValidator,
  getCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require("../utils/validators/couponValidator");
const {
  getCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");
const authService = require("../services/authService");

router.use(authService.protect, authService.allowedTo("admin", "manager"));

router.route("/").get(getCoupons).post(createCouponValidator, createCoupon);
router
  .route("/:id")
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
