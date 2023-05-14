const express = require("express");
const router = express();

const {
  getAllReviews,
  getAllReviewsForProduct,
  createReview,
  deleteReview,
  updateReview,
} = require("../controllers/review.controller");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

const { apiEnum } = require("../enum/api.enum");
const Review = require("../models/Review.model");

router.get(
  apiEnum.API_GET_REVIEWS,
  protect,
  // authorize("admin"),
  // advancedResults(Review),
  getAllReviews
);

router.get(
  apiEnum.API_GET_PRODUCT_REVIEWS,
  protect,
  advancedResults(Review),
  getAllReviewsForProduct
);

router.delete(
  apiEnum.API_DELETE_REVIEW,
  protect,
  authorize("admin"),
  deleteReview
);

router.put(
  apiEnum.API_UPDATE_REVIEW,
  protect,
  authorize("admin"),
  updateReview
);

router.post(apiEnum.API_CREATE_REVIEW, createReview);
module.exports = router;
