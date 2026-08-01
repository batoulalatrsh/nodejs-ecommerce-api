const express = require("express");

const router = express.Router();
const {
  getUserValidator,
  createUserValidator,
  updateUserdValidator,
  deleteUserValidator,
  changePasswordValidator,
} = require("../utils/validators/userValidator");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  uploadUseryImage,
  resizeImage,
} = require("../services/userService");

router
  .route("/")
  .get(getUsers)
  .post(uploadUseryImage, resizeImage, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUseryImage, resizeImage, updateUserdValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router
  .route("/changePassword/:id")
  .put(changePasswordValidator, changePassword);
module.exports = router;
