const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const Product = require("../models/Product.model");
const Order = require("../models/Order.model");
const { codeEnum } = require("../enum/status-code.enum");

const {
  raiseQuantityByOne,
  reduceQuantityByOne,
  removeOneProduct,
} = require("../utils/cookieAction");

// @desc      Get products from cart (use cookie when not loggined user)
// @route     GET /api/v1/order/products
// @access    Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  let products = await req.cookies.PRODUCT_CART.products;
  let productIds = products.map((p) => p.productId);

  Product.find({ _id: { $in: productIds } }, function (err, result) {
    if (err) {
      return next(new ErrorResponse(err.message, codeEnum.NOT_FOUND));
    }
    res.status(codeEnum.SUCCESS).json({ data: result || [] });
  });
});

// @desc      Create order
// @route     POST /api/v1/order/create
// @access    Public
exports.createOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.create(req.body);
  res.status(codeEnum.CREATED).json({ data: order });
});

// @desc      Update order
// @route     PUT /api/v1/order/:orderId
// @access    Public
exports.updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.orderId, req.body, {
    new: true,
  });

  res.status(codeEnum.SUCCESS).json({ data: order });
});

// @desc      Get order
// @route     GET /api/v1/order/:orderId
// @access    Public
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  res.status(codeEnum.SUCCESS).json({ data: order });
});

// @desc      Get orders
// @route     GET /api/v1/order
// @access    Private(Admin)
exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();
  res.status(codeEnum.SUCCESS).json({ data: orders });
});

// @desc      Delete order
// @route     DELETE /api/v1/order/:orderId
// @access    Private(Admin)
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  await Order.findByIdAndDelete(req.params.orderId);
  res.status(codeEnum.SUCCESS).json({ data: {} });
});

// @desc      Add product to cart (use cookie when not loggined user)
// @route     POST /api/v1/order/cart/:productId
// @access    Public
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { price } = req.body;

  try {
    let newProducts = {};

    if (!req.cookies.PRODUCT_CART) {
      newProducts = {
        products: [{ productId, quantity: 1 }],
        total: price,
      };
    } else
      newProducts = await raiseQuantityByOne(
        req.cookies.PRODUCT_CART,
        productId,
        price
      );

    res
      .status(codeEnum.SUCCESS)
      .cookie(process.env.PRODUCT_CART, newProducts)
      .json({
        data: newProducts,
      });
  } catch (err) {
    return next(new ErrorResponse(err.message, codeEnum.SERVER_ERROR));
  }
});

// @desc      Delete product to cart (use cookie when not loggined user)
// @route     DELETE /api/v1/order/cart/:productId
// @access    Public
exports.postCartDeleteProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { price } = req.body;

  try {
    let updatedCart;
    if (!req.cookies.PRODUCT_CART) {
      return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
    }

    updatedCart = await removeOneProduct(
      req.cookies.PRODUCT_CART,
      productId,
      price
    );

    res
      .status(codeEnum.SUCCESS)
      .cookie(process.env.PRODUCT_CART, updatedCart)
      .json({ data: updatedCart });
  } catch (err) {
    return next(new ErrorResponse(err.message, codeEnum.SERVER_ERROR));
  }
});

// @desc      Delete product to cart (use cookie when not loggined user)
// @route     DELETE /api/v1/order/cart/:productId
// @access    Public
exports.postCartReduceProductByOne = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { price } = req.body;

  try {
    let updatedCart;
    if (!req.cookies.PRODUCT_CART) {
      return next(new ErrorResponse(msgEnum.NOT_FOUND, codeEnum.NOT_FOUND));
    }

    updatedCart = await reduceQuantityByOne(
      req.cookies.PRODUCT_CART,
      productId,
      price
    );

    res
      .status(codeEnum.SUCCESS)
      .cookie(process.env.PRODUCT_CART, updatedCart)
      .json({ data: updatedCart });
  } catch (err) {
    return next(new ErrorResponse(err.message, codeEnum.SERVER_ERROR));
  }
});
