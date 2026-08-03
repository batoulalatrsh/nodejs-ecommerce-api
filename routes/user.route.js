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
const authService = require("../services/authService");

router
  .route("/")
  .get(authService.protect, authService.allowedTo("admin", "manager"), getUsers)
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadUseryImage,
    resizeImage,
    createUserValidator,
    createUser,
  );

router
  .route("/:id")
  .get(
    authService.protect,
    authService.allowedTo("admin"),
    getUserValidator,
    getUser,
  )
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadUseryImage,
    resizeImage,
    updateUserdValidator,
    updateUser,
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteUserValidator,
    deleteUser,
  );

router
  .route("/changePassword/:id")
  .put(changePasswordValidator, changePassword);
module.exports = router;
