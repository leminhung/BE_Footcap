const _ = require("lodash");

const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const Product = require("../models/Product.model");
const OrderDetail = require("../models/OrderDetail.model");


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

// @desc      Get orders detail
// @route     GET /api/v1/ordersdetail
// @access    Private(Admin)
exports.getOrdersdetail = asyncHandler(async (req, res, next) => {
  const ordersdetail = await OrderDetail.find().populate("order");
  res.status(codeEnum.SUCCESS).json({ data: ordersdetail });
});

// @desc      Create order
// @route     POST /api/v1/orderdetail/create
// @access    Public
exports.createOrderDetail = asyncHandler(async (req, res, next) => {
  const orderdetail = await OrderDetail.create(req.body);
  res.status(codeEnum.CREATED).json({ data: orderdetail });
});

// @desc      lấy order detail theo orderid
// @route     DELETE /api/v1/order-detai/:orderId
// @access    Public
exports.getByOrderId=asyncHandler(async(req,res,next)=>{
  
  const orderDetail = await OrderDetail.find({order:req.params.orderId});

  res.status(codeEnum.CREATED).json({ data: orderDetail});
})