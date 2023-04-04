const express = require("express");
const router = express();

const {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  productPhotoUpload,
} = require("../controllers/product.controller");

const Product = require("../models/Product.model");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

const { apiEnum } = require("../enum/api.enum");

router.get(apiEnum.API_GET_PRODUCT, getProduct);

router.get(
  apiEnum.API_GET_PRODUCTS,
  // authorize("admin"),
  // protect,
  advancedResults(Product, { path: "assets", select: "filename" }),
  getAllProducts
);

router.post(
  apiEnum.API_CREATE_PRODUCT,
  protect,
  authorize("admin"),
  createProduct
);

router.delete(
  apiEnum.API_DELETE_PRODUCT,
  protect,
  authorize("admin"),
  deleteProduct
);

router.put(
  apiEnum.API_UPDATE_PRODUCT,
  protect,
  authorize("admin"),
  updateProduct
);

router.put(
  apiEnum.API_UPLOAD_PRODUCT_PHOTO,
  protect,
  authorize("admin"),
  productPhotoUpload
);

module.exports = router;
