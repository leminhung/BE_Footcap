const Coupon = require("../models/Coupon.model");

const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const { codeEnum } = require("../enum/status-code.enum");
const { msgEnum } = require("../enum/message.enum");

// @desc      Get all Coupons
// @route     GET /api/v1/coupons
// @access    Public
exports.getAllCoupons = asyncHandler(async (req, res, next) => {
  res.status(codeEnum.SUCCESS).json(res.advancedResults);
});

// @desc      Get Coupon
// @route     GET /api/v1/coupons/:couponId
// @access    Public
exports.getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById({ _id: req.params.couponId });
  if (!coupon) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }
  res.status(codeEnum.SUCCESS).json({ data: coupon });
});

// @desc      Check Valid Coupon
// @route     POST /api/v1/coupons/check
// @access    Public
exports.checkValidCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({ coupon_code: req.body.coupon_code });
  if (!coupon) {
    return next(
      new ErrorResponse("Coupon code is invalid", codeEnum.NOT_FOUND)
    );
  }

  // check expiration date
  if (coupon.coupon_end_date < Date.now()) {
    return next(new ErrorResponse("Coupon had expired", 400));
  }

  // check minimum price of cart need to have a discount
  if (coupon.coupon_value > req.body.total) {
    return next(
      new ErrorResponse(
        `The price of cart not enough, need at lease ${
          coupon.coupon_value - req.body.total
        }$, let buy more`,
        400
      )
    );
  }

  // check times used
  if (coupon.coupon_uses_per_coupon <= coupon.coupon_count_per_coupon) {
    return next(
      new ErrorResponse(
        `This coupon is invalided because of exceeded ${coupon.coupon_uses_per_coupon} times used`,
        400
      )
    );
  }

  // check status
  if (
    coupon.coupon_status.includes("disabled") ||
    coupon.coupon_status.includes("expired")
  ) {
    return next(new ErrorResponse(`This coupon is disabled of expired`, 400));
  }

  res.status(codeEnum.SUCCESS).json({
    data: {
      coupon_code: coupon.coupon_code,
      discount: coupon.coupon_spend,
    },
  });
});

// @desc      Add Coupon
// @route     POST /api/v1/coupons
// @access    Private/Admin
exports.createCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.create(req.body);
  res.status(codeEnum.CREATED).json({ data: coupon });
});

// @desc      Delete Coupon
// @route     DELETE /api/v1/coupons/:couponId
// @access    Private/Admin
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.couponId);

  if (!Coupon) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  await coupon.remove();

  res.status(codeEnum.SUCCESS).json({ data: {} });
});

// @desc      Update Coupon
// @route     PUT /api/v1/coupon/:couponId
// @access    Private/Admin
exports.updateCoupon = asyncHandler(async (req, res, next) => {
  let coupon = await Coupon.findById(req.params.couponId);

  if (!coupon) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  coupon = await Coupon.findByIdAndUpdate(req.params.couponId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(codeEnum.SUCCESS).json({
    data: coupon,
  });
});
