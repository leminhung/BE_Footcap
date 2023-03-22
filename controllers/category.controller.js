const Category = require("../models/Category.model");
const Product = require("../models/Product.model");

const asyncHandler = require("../middleware/async");

const ErrorResponse = require("../utils/ErrorResponse");
const cloudinary = require("../utils/cloudinaryConfig");

const { codeEnum } = require("../enum/status-code.enum");
const { msgEnum } = require("../enum/message.enum");

// @desc      Get all categories
// @route     GET /api/v1/categories
// @access    Private(Admin)
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  res.status(codeEnum.SUCCESS).json(res.advancedResults);
});

// @desc      Get category
// @route     GET /api/v1/categories/:categoryId
// @access    Private(Admin)
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ _id: req.params.categoryId });

  if (!category) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  res.status(codeEnum.SUCCESS).json({ data: category });
});

// @desc      Add category
// @route     POST /api/v1/categories
// @access    Private(Admin)
exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(codeEnum.CREATED).json({ data: category });
});

// @desc      Delete category
// @route     DELETE /api/v1/categories/:categoryId
// @access    Private(Admin)
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  await category.remove();

  res.status(codeEnum.SUCCESS).json({ data: {} });
});

// @desc      Update category
// @route     PUT /api/v1/category/:categoryId
// @access    Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.categoryId);

  if (!category) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  category = await Category.findByIdAndUpdate(req.params.categoryId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(codeEnum.SUCCESS).json({
    data: category,
  });
});

// @desc      Get products for 1 category
// @route     GET /api/v1/categories/:categoryId/products
// @access    Public
exports.getProductsForCategory = asyncHandler(async (req, res, next) => {
  const products = await Product.find({
    category: req.params.categoryId,
  }).populate("comments").populate("images");

  if (!products) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  res.status(codeEnum.SUCCESS).json({ data: products });
});

// @desc      Upload photo for category
// @route     PUT /api/v1/categories/:categoryId/photo
// @access    Private(Admin)
exports.categoryPhotoUpload = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.categoryId);

  if (!category) {
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
    category = await Category.findByIdAndUpdate(
      req.params.categoryId,
      {
        thumbnail: result.url,
      },
      { new: true }
    );
    res.status(codeEnum.SUCCESS).json({ msg: msgEnum.UPLOAD_SUCCESS });
  });
});
