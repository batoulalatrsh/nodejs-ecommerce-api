const Review = require("../model/reviewModel");
const factory = require("./handlersFactory");

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObj = filterObject;
  next();
};

// @desc   Get list of reviews
// @route  GET /api/v1/reviews
// @access public
exports.getReviews = factory.getAll(Review);

// @desc   Get Specific review by id
// @route  GET /api/v1/reviews/:id
// @access public
exports.getReview = factory.getOne(Review);

// POST /api/v1/products/:productId/reviews
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  // @deac Nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};

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
