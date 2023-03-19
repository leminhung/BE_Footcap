const express = require("express");
const router = express();

const { getProducts } = require("../controllers/orderDetail.controller");

const { apiEnum } = require("../enum/api.enum");

router.get(apiEnum.API_ORDER_DETAILS_GET_PRODUCTS, getProducts);

module.exports = router;
