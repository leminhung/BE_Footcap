const authRouter = require("./auth.route");
const productRouter = require("./product.route");
const orderRouter = require("./order.route");
const orderDetailRouter = require("./orderDetail.route");
const categoryRouter = require("./category.route");
const imageRouter = require("./image.route");
const commentRouter = require("./comment.route");
const stripeRouter = require("./stripe.route");

const routers = [
  authRouter,
  productRouter,
  orderRouter,
  orderDetailRouter,
  categoryRouter,
  imageRouter,
  commentRouter,
  stripeRouter,
];

module.exports = (app) => {
  routers.forEach((router) => {
    app.use("/api/v1/", router);
  });
};
