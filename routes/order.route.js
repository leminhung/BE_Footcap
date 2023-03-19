const express = require("express");
const router = express();

const {
  getProducts,
  createOrder,
  updateOrder,
  getOrder,
  deleteOrder,
  getOrders,
  getCart,
  addProductToCart,
  postCartDeleteProduct,
  postCartReduceProductByOne,
} = require("../controllers/order.controller");

const { apiEnum } = require("../enum/api.enum");
const { protect, authorize } = require("../middleware/auth");

router
  .get(apiEnum.API_ORDER_GET_PRODUCTS, getProducts)
  .get(apiEnum.API_GET_ORDERS, protect, authorize("admin"), getOrders)
  .get(apiEnum.API_GET_ORDER, protect, authorize("admin"), getOrder)
  .delete(apiEnum.API_DELETE_ORDER, protect, authorize("admin"), deleteOrder)
  .post(apiEnum.API_CREATE_ORDER, createOrder)
  .put(apiEnum.API_UPDATE_ORDER, protect, authorize("admin"), updateOrder);

// cart
router
  // .get(apiEnum.API_GET_CART, getCart)
  .post(apiEnum.API_ADD_PRODUCT_TO_CART, addProductToCart)
  .post(apiEnum.API_REDUCE_PRODUCT_FROM_CART, postCartReduceProductByOne)
  .delete(apiEnum.API_REMOVE_PRODUCT_FROM_CART, postCartDeleteProduct);

module.exports = router;
