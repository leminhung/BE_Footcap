const express = require("express");
const router = express();

const {
  getAllCategories,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  getProductsForCategory,
  categoryPhotoUpload,
} = require("../controllers/category.controller");

const { apiEnum } = require("../enum/api.enum");
const advancedResults = require("../middleware/advancedResults");

const Category = require("../models/Category.model");

const { protect, authorize } = require("../middleware/auth");

router.get(apiEnum.API_GET_PRODUCTS_FOR_CATEGORY, getProductsForCategory);
router.get(apiEnum.API_GET_CATEGORY, getCategory);
router.get(
  apiEnum.API_GET_CATEGORIES,
  advancedResults(Category, ""),
  getAllCategories
);

router.post(
  apiEnum.API_CREATE_CATEGORY,
  protect,
  authorize("admin"),
  createCategory
);

router.put(
  apiEnum.API_UPDATE_CATEGORY,
  protect,
  authorize("admin"),
  updateCategory
);
router.put(
  apiEnum.API_UPLOAD_CATEGORY_PHOTO,
  protect,
  authorize("admin"),
  categoryPhotoUpload
);

router.delete(
  apiEnum.API_DELETE_CATEGORY,
  protect,
  authorize("admin"),
  deleteCategory
);

module.exports = router;
