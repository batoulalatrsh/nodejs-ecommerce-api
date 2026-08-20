const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../model/userModel");

exports.addAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 2 })
    .withMessage("Too short brand name")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);
      const aliasExists = user.addresses.some(
        (address) => address.alias === val,
      );
      if (aliasExists) {
        throw new Error("Alias name already token");
      }
      return true;
    }),
  check("details").notEmpty().withMessage("Address detail is required"),
  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number, only accept EG and SA phone numbers"),
  validatorMiddleware,
];
