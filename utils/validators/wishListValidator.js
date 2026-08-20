const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Product = require("../../model/productModel");

exports.addProductToWishListValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID required")
    .isMongoId()
    .withMessage("Invalid Object ID")
    .custom(async (val, { req }) => {
      const product = await Product.findById(val);
      if (!product) {
        throw new Error("There is no product with this ID");
      }
      return true;
    }),
  validatorMiddleware,
];
