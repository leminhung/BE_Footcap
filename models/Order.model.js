const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    require: [true, "Please add a phone number"],
    match: [/^(?:0|\+84)[1-9][0-9]{8,9}$/, "Please add a valid phone number"],
  },
  address: {
    type: String,
    required: true,
  },

  // Trong giỏ: false
  // Đã đặt: true
  status: { type: Boolean, required: true, default: false },
  note: {
    type: String,
  },
  total_price: {
    type: Number,
    min: [0, "Total price must be at least 0"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

orderSchema.pre("save", async function (next) {
  this.status = true;
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
