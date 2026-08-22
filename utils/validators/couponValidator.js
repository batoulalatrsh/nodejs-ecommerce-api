const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Coupon = require("../../model/couponModel");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon id format"),
  validatorMiddleware,
];
exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name is required")
    .isLength({ min: 2 })
    .withMessage("Too short brand name")
    .custom(async (val, { req }) => {
      const name = await Coupon.findOne({ name: val });
      if (name) {
        throw new Error("Coupon name is already token");
      }
      return true;
    }),
  check("expire").notEmpty().withMessage("Coupon Expire date is required"),
  check("discount").notEmpty().withMessage("Coupon Expire date is required"),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon id format"),
  body("name").optional(),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon id format"),
  validatorMiddleware,
];
