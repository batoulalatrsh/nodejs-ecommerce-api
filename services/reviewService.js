const Review = require("../model/reviewModel");
const factory = require("./handlersFactory");

// @desc   Get list of reviews
// @route  GET /api/v1/reviews
// @access public
exports.getReviews = factory.getAll(Review);

// @desc   Get Specific review by id
// @route  GET /api/v1/reviews/:id
// @access public
exports.getReview = factory.getOne(Review);

// @desc   Create review
// @route  POST /api/v1/reviews
// @access private/protect/user
exports.createReview = factory.createOne(Review);

// @desc   Update specific review
// @route  PUT /api/v1/reviews/:id
// @access private/protect/user
exports.updateReview = factory.updateOne(Review);

// @desc   Delete specific review
// @route  DELETE /api/v1/reviews/:id
// @access private/protect/[user, admin, manager]
exports.deleteReview = factory.deleteOne(Review);
