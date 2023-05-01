const express = require("express");
const router = express();

const {
  getAllCoupons,
  getCoupon,
  createCoupon,
  deleteCoupon,
  updateCoupon,
  checkValidCoupon,
} = require("../controllers/coupon.controller");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

const { apiEnum } = require("../enum/api.enum");
const Coupon = require("../models/Coupon.model");

router.get(apiEnum.API_GET_COUPON, protect, authorize("admin"), getCoupon);
router.get(
  apiEnum.API_GET_COUPONS,
  protect,
  authorize("admin"),
  advancedResults(Coupon),
  getAllCoupons
);

router.post(apiEnum.API_CHECK_COUPON_VALIDATION, checkValidCoupon);

router.post(
  apiEnum.API_CREATE_COUPON,
  protect,
  authorize("admin"),
  createCoupon
);

router.delete(
  apiEnum.API_DELETE_COUPON,
  protect,
  authorize("admin"),
  deleteCoupon
);

router.put(
  apiEnum.API_UPDATE_COUPON,
  protect,
  authorize("admin"),
  updateCoupon
);

module.exports = router;
