const express = require("express");

const router = express.Router();
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValiator");
const { signup, login, forgotPassword } = require("../services/authService");

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgotPassword").post(forgotPassword);

module.exports = router;
