const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../model/categoryModel");
const SubCategory = require("../../model/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product required")
    .isLength({ min: 3 })
    .withMessage("Too short product name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long product description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error(
          "Product priceAfterDiscount must be a less than original price",
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("AvailableColors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category)
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`),
          );
      }),
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(
              new Error(`This SubCategories do not exits: ${subcategoriesIds}`),
            );
          }
        },
      ),
    )
    .custom((subcategoriesIds, { req }) =>
      SubCategory.find({ category: req.body.category }).then((results) => {
        const subcategoriesIdsInBD = [];
        results.forEach((res) => {
          subcategoriesIdsInBD.push(res._id.toString());
        });
        if (
          !subcategoriesIds.every((subCategoryId) =>
            subcategoriesIdsInBD.includes(subCategoryId),
          )
        ) {
          return Promise.reject(
            new Error(`SubCategories not belong to category`),
          );
        }
      }),
    ),
  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("RatingsAverage must be a number")
    .isFloat({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isFloat({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("RatingsQuantity must be a number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(req.body.title);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];
