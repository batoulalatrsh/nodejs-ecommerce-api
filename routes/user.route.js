const express = require("express");

const router = express.Router();
const {
  getUserValidator,
  createUserValidator,
  updateUserdValidator,
  deleteUserValidator,
  changePasswordValidator,
  changeLoggedUserPasswordValidator,
  updateLoggedUserdValidator,
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
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../services/userService");
const authService = require("../services/authService");

router.use(authService.protect);
router.get("/getMe", getLoggedUserData, getUser);
router.put(
  "/changeMyPassword",
  changeLoggedUserPasswordValidator,
  updateLoggedUserPassword,
);
router.put("/updateMe", updateLoggedUserdValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

// Admin
router.use(authService.allowedTo("admin"));
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
