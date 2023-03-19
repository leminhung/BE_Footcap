const express = require("express");
const router = express();

const {
  postComment,
  deleteComment,
  updateComment,
  getAllCommentsForProduct,
} = require("../controllers/comment.controller");

const { protect, authorize } = require("../middleware/auth");

const { apiEnum } = require("../enum/api.enum");

router.get(
  apiEnum.API_GET_COMMENTS_FOR_PRODUCT,
  protect,
  authorize("admin"),
  getAllCommentsForProduct
);
router.post(apiEnum.API_POST_COMMENT, protect, postComment);
router.delete(apiEnum.API_DELETE_COMMENT, protect, deleteComment);
router.put(apiEnum.API_UPDATE_COMMENT, protect, updateComment);

module.exports = router;
