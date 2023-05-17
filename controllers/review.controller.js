const Review = require("../models/Review.model");

const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const { codeEnum } = require("../enum/status-code.enum");
const { msgEnum } = require("../enum/message.enum");

// @desc      Get all reviews
// @route     GET /api/v1/reviews
// @access    Private(Admin)
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  res.status(codeEnum.SUCCESS).json(res.advancedResults);
});

// @desc      Get all reviews for product
// @route     GET /api/v1/products/reviews?product=
// @access    Private(Admin)
exports.getAllReviewsForProduct = asyncHandler(async (req, res, next) => {
  res.status(codeEnum.SUCCESS).json(res.advancedResults);
});

// @desc      Add Review
// @route     POST /api/v1/reviews
// @access    Public (User login)
exports.createReview = asyncHandler(async (req, res, next) => {
  const review = await Review.create(req.body);
  res.status(codeEnum.CREATED).json({ data: review });
});

// @desc      Delete Review
// @route     DELETE /api/v1/Reviews/:reviewId
// @access    Private/Admin
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!Review) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  await review.remove();

  res.status(codeEnum.SUCCESS).json({ data: {} });
});

// @desc      Update Review
// @route     PUT /api/v1/Review/:reviewId
// @access    Private/Admin
exports.updateReview = asyncHandler(async (req, res, next) => {
  let Review = await Review.findById(req.params.reviewId);

  if (!Review) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  Review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(codeEnum.SUCCESS).json({
    data: review,
  });
});
