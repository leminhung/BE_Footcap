const express = require("express");
const router = express();

const { getProducts, getOrdersdetail, createOrderDetail,getByOrderId } = require("../controllers/orderDetail.controller");

const { apiEnum } = require("../enum/api.enum");

router.get(apiEnum.API_ORDER_DETAILS_GET_PRODUCTS, getProducts);
router.get("/ordersdetail", getOrdersdetail);
router.post("/orderdetail/create", createOrderDetail);
router.get("/order-detail/:orderId",getByOrderId);
module.exports = router;
