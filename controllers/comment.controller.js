const Comment = require("../models/Comment.model");

const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const { codeEnum } = require("../enum/status-code.enum");
const { msgEnum } = require("../enum/message.enum");

// @desc      Get comments for product
// @route     GET /api/v1/comments/:productId
// @access    Private(Admin)
exports.getAllCommentsForProduct = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ product: req.params.productId });

  if (!comments) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  res.status(codeEnum.SUCCESS).json({ data: comments });
});

// @desc      Add comment
// @route     POST /api/v1/comments
// @access    Private/User
exports.postComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.create(req.body);

  res.status(codeEnum.CREATED).json({ data: comment });
});

// @desc      Delete comment
// @route     DELETE /api/v1/comments/:commentId
// @access    Private/User
exports.deleteComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(msgEnum.UNAUTHORIZED, codeEnum.UNAUTHORIZED));
  }

  comment.remove();

  res.status(codeEnum.SUCCESS).json({ data: {} });
});

// @desc      Update comment
// @route     PUT /api/v1/comment/:commentId
// @access    Private/User
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(msgEnum.UNAUTHORIZED, codeEnum.UNAUTHORIZED));
  }

  comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(codeEnum.SUCCESS).json({
    data: comment,
  });
});
