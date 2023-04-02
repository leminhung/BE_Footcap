const mongoose = require("mongoose");

const orderDetailSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      min: [0, "Quantity must be at least 0"],
    },
    price: {
      type: Number,
      min: [0, "Total price must be at least 0"],
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      cellPhone: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // product name
    name: {
      type: String,
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
