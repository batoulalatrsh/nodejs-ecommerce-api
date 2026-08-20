const express = require("express");

const router = express.Router({ mergeParams: true });
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require("../services/reviewService");
const authService = require("../services/authService");

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview,
  );

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview,
  )
  .delete(
    authService.protect,
    authService.allowedTo("manager", "admin", "user"),
    deleteReviewValidator,
    deleteReview,
  );
module.exports = router;
