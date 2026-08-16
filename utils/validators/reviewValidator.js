const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../model/reviewModel");

exports.createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Rating value is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating value must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalid user id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom(async (val, { req }) => {
      // Check if user create review before
      const review = await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) {
        throw new Error("You already created a review before");
      }
    }),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid review id format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id format")
    .custom(async (val, { req }) => {
      // Check review ownership before update
      const review = await Review.findById(val);
      if (!review) {
        throw new Error(`There is no review with this id ${val}`);
      }
      if (review.user.toString() !== req.user._id.toString()) {
        throw new Error(`You are not allowed to perform this action`);
      }
      return true;
    }),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (val, { req }) => {
      // Check review ownership before delete
      if (req.user.role === "user") {
        const review = await Review.findById(val);
        if (!review) {
          throw new Error(`There is no review with this id ${val}`);
        }
        if (review.user.toString() !== req.user._id.toString()) {
          throw new Error(`You are not allowed to perform this action`);
        }
      }
      return true;
    }),

  validatorMiddleware,
];
