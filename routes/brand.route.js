const express = require("express");

const router = express.Router();
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandyImage,
  resizeImage,
} = require("../services/brandService");
const AuthService = require("../services/authService");

router
  .route("/")
  .get(getBrands)
  .post(
    AuthService.protect,
    uploadBrandyImage,
    resizeImage,
    createBrandValidator,
    createBrand,
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(uploadBrandyImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);
module.exports = router;
