const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const Brand = require("../model/brandModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

// Upload single image
exports.uploadBrandyImage = uploadSingleImage("image");
// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

  // Save image into our DB
  req.body.image = filename;
  next();
});

// @desc   Get list of brands
// @route  GET /api/v1/brands
// @access public
exports.getBrands = factory.getAll(Brand);

// @desc   Get Specific brand by id
// @route  GET /api/v1/brands/:id
// @access public
exports.getBrand = factory.getOne(Brand);

// @desc   Create brand
// @route  POST /api/v1/brands
// @access private
exports.createBrand = factory.createOne(Brand);

// @desc   Update specific category
// @route  PUT /api/v1/categories/:id
// @access private
exports.updateBrand = factory.updateOne(Brand);

// @desc   Delete specific brand
// @route  DELETE /api/v1/brands/:id
// @access private
exports.deleteBrand = factory.deleteOne(Brand);
