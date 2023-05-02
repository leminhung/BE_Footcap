const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      require: [true, "Please add a phone number"],
      // match: [/^(?:0|\+84)[1-9][0-9]{8,9}$/, "Please add a valid phone number"],
    },
    address: {
      type: String,
      required: true,
    },

    // Trạng thái đơn hàng (đang chờ xử lý, đã xử lý, đã giao hàng, hủy đơn hàng, ...)
    status: { type: String, required: true, default: "đang chờ xử lý" },
    shipping_fee: {
      type: Number,
    },
    coupon_id: {
      type: Number,
    },
    affiliate_id: {
      type: Number,
    },
    note: {
      type: String,
    },
    delivery_at: { type: Date },
    total_price: {
      type: Number,
      min: [0, "Total price must be at least 0"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", async function (next) {
  this.status = true;
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
