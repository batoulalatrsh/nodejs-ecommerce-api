const { check, body, param } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.addProductToCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID required")
    .isMongoId()
    .withMessage("Invalid object id"),
  check("quantity")
    .optional()
    .notEmpty()
    .withMessage("Invalid object id")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("color")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Color must not be empty if provided"),
  validatorMiddleware,
];

exports.updateSpecificItemValidator = [
  param("itemId").isMongoId().withMessage("Invalid item ID format"),
  body("quantity").optional(),
  validatorMiddleware,
];

exports.deleteCartItemValidator = [
  param("itemId").isMongoId().withMessage("Invalid item ID format"),
  validatorMiddleware,
];
