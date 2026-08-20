const express = require("express");

const router = express.Router();

const {
  addAddress,
  deleteAddress,
  getLoggedUserAddresses,
} = require("../services/addressService");
const { addAddressValidator } = require("../utils/validators/addressValidator");
const authService = require("../services/authService");

router.use(authService.protect, authService.allowedTo("user"));
router
  .route("/")
  .post(addAddressValidator, addAddress)
  .get(getLoggedUserAddresses);

router.delete("/:addressId", deleteAddress);
module.exports = router;
