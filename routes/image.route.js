const express = require("express");
const router = express();

const {
  getAllImages,
  getImage,
  deleteImage,
} = require("../controllers/image.controller ");

const Image = require("../models/Image.model");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

const { apiEnum } = require("../enum/api.enum");

router.get(
  apiEnum.API_GET_IMAGES,
  protect,
  authorize("admin"),
  advancedResults(Image, ""),
  getAllImages
);

router.get(apiEnum.API_GET_IMAGE, getImage);

router.delete(
  apiEnum.API_DELETE_IMAGE,
  protect,
  authorize("admin"),
  deleteImage
);

module.exports = router;
