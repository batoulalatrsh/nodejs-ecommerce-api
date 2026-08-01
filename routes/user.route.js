const express = require("express");

const router = express.Router();
const {
  getUserValidator,
  createUserValidator,
  updateUserdValidator,
  deleteUserValidator,
} = require("../utils/validators/userValidator");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUseryImage,
  resizeImage,
} = require("../services/userService");

router
  .route("/")
  .get(getUserValidator, getUsers)
  .post(uploadUseryImage, resizeImage, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUser)
  .put(uploadUseryImage, resizeImage, updateUserdValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
module.exports = router;
