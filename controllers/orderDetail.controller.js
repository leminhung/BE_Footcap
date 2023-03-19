const _ = require("lodash");

const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const Product = require("../models/Product.model");

const { codeEnum } = require("../enum/status-code.enum");
const { msgEnum } = require("../enum/message.enum");

// @desc      Get products from cart (use cookie when not loggined user)
// @route     GET /api/v1/order-details/products
// @access    Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  let products = await req.cookies.PRODUCT_CART?.products;
  let temp = [...products];
  let productIds = products.map((p) => p.productId);

  products = await Product.find({ _id: { $in: productIds } });

  if (!products) {
    return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
  }

  products = products.map((p) => p._doc);

  products = _.merge(
    {
      data: products,
    },
    {
      data: temp,
    }
  );

  res.status(codeEnum.SUCCESS).json({
    data: products?.data || [],
    total: req.cookies.PRODUCT_CART.total,
  });
});
