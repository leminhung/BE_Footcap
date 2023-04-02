const Product = require("../models/Product.model");
const Assets = require("../models/Assets.model");

const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const { codeEnum } = require("../enum/status-code.enum");
const { msgEnum } = require("../enum/message.enum");

const cloudinary = require("../utils/cloudinaryConfig");

// @desc      Get all products
// @route     GET /api/v1/products
// @access    Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  res.status(codeEnum.SUCCESS).json(res.advancedResults);
});

// @desc      Get product
// @route     GET /api/v1/products/:productId
// @access    Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById({ _id: req.params.productId })
    .populate("assets")
    .populate("category")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });
  if (!product) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }
  res.status(codeEnum.SUCCESS).json({ data: product });
});

// @desc      Add product
// @route     POST /api/v1/products
// @access    Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(codeEnum.CREATED).json({ data: product });
});

// @desc      Delete product
// @route     DELETE /api/v1/products/:productId
// @access    Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  product.remove();

  res.status(codeEnum.SUCCESS).json({ data: {} });
});

// @desc      Update product
// @route     PUT /api/v1/product/:productId
// @access    Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(codeEnum.SUCCESS).json({
    data: product,
  });
});

// @desc      Upload photo for product
// @route     PUT /api/v1/products/:productId/photo
// @access    Private
exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorResponse(msgEnum.DATA_NOT_FOUND, codeEnum.NOT_FOUND));
  }

  if (!req.files) {
    return next(new ErrorResponse(msgEnum.UPLOAD_FAIL, codeEnum.BAD_REQUEST));
  }

  const file = req.files.photo;

  if (!file.mimetype.startsWith("image")) {
    return next(
      new ErrorResponse(msgEnum.WRONG_FILE_TYPE, codeEnum.BAD_REQUEST)
    );
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(msgEnum.FILE_SIZE_OVER, codeEnum.BAD_REQUEST)
    );
  }

  cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
    await Image.create({
      path: result.url,
      product: req.params.productId,
    });
    res.status(codeEnum.SUCCESS).json({ msg: msgEnum.UPLOAD_SUCCESS });
  });
});
