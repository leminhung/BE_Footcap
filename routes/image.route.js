const express = require("express");
const router = express();

const {
  getAllImages,
  getImage,
  deleteImage,
  getImagesForProduct,
} = require("../controllers/image.controller");

const Assets = require("../models/Assets.model");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

const { apiEnum } = require("../enum/api.enum");

router.get(
  apiEnum.API_GET_IMAGES,
  protect,
  authorize("admin"),
  advancedResults(Assets, ""),
  getAllImages
);

router.get(apiEnum.API_GET_PRODUCT_IMAGES, getImagesForProduct);

router.get(apiEnum.API_GET_IMAGE, getImage);

router.delete(
  apiEnum.API_DELETE_IMAGE,
  protect,
  authorize("admin"),
  deleteImage
);

module.exports = router;
