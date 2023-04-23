const mongoose = require("mongoose");

const orderDetailSchema = new mongoose.Schema(
  {
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String },
      cellPhone: { type: String, required: true },
      city: { type: String },
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    products: {
      type: [Object],
      ref: "Product",
      required: true,
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);

module.exports = OrderDetail;
