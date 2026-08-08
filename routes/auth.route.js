const express = require("express");

const router = express.Router();
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValiator");
const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verifyResetCode").post(verifyPassResetCode);
router.route("/resetPassword").put(resetPassword);

module.exports = router;
