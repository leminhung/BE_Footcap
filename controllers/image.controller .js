const Image = require("../models/Image.model");
const Product = require("../models/Product.model");

const asyncHandler = require("../middleware/async");

const ErrorResponse = require("../utils/ErrorResponse");

const { codeEnum } = require("../enum/status-code.enum");
const { msgEnum } = require("../enum/message.enum");

// @desc      Get all images
// @route     GET /api/v1/images
// @access    Private(Admin)
exports.getAllImages = asyncHandler(async (req, res, next) => {
  res.status(codeEnum.SUCCESS).json(res.advancedResults);
});

// @desc      Get image
// @route     GET /api/v1/images/:imageId
// @access    Private(Admin)
exports.getImage = asyncHandler(async (req, res, next) => {
  const image = await Image.findById({ _id: req.params.imageId });

  if (!image) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  res.status(codeEnum.SUCCESS).json({ data: image });
});

// @desc      Delete image
// @route     DELETE /api/v1/images/:imageId
// @access    Private(Admin)
exports.deleteImage = asyncHandler(async (req, res, next) => {
  const image = await Image.findById(req.params.imageId);

  if (!image) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  await image.remove();

  res.status(codeEnum.SUCCESS).json({ data: image });
});
